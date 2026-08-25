"""Create a transparent-background derivative of the authoritative brand logo.

The source `public/assets/brand/logo.png` is a flat gold emblem composited on a
uniform white background. Every observed pixel is therefore

    c = a * F + (1 - a) * 255

where `F` is the gold ink colour and `a` the ink coverage. This script inverts
that equation per pixel, so the derivative keeps every gold pixel (including the
anti-aliased edges) at its original colour and the original 2000x1600 canvas —
only the white paper is turned into alpha. The source file is never modified.

Pure stdlib (zlib + struct): no image dependency is added to the project.
"""

import struct
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/assets/brand/logo.png"
DST = ROOT / "public/assets/brand/logo-transparent.png"

PNG_SIG = b"\x89PNG\r\n\x1a\n"


def read_png_rgb(path):
    data = path.read_bytes()
    if data[:8] != PNG_SIG:
        raise SystemExit(f"{path} is not a PNG")
    idat, ihdr, offset = bytearray(), None, 8
    while offset < len(data):
        (length,) = struct.unpack(">I", data[offset : offset + 4])
        kind = data[offset + 4 : offset + 8]
        body = data[offset + 8 : offset + 8 + length]
        if kind == b"IHDR":
            ihdr = struct.unpack(">IIBBBBB", body)
        elif kind == b"IDAT":
            idat += body
        elif kind == b"IEND":
            break
        offset += 12 + length
    width, height, depth, colour, _, _, interlace = ihdr
    if (depth, colour, interlace) != (8, 2, 0):
        raise SystemExit("expected an 8-bit non-interlaced truecolour PNG")

    raw = zlib.decompress(bytes(idat))
    stride, bpp = width * 3, 3
    out = bytearray(height * stride)
    prev = bytearray(stride)
    pos = 0
    for row in range(height):
        ftype = raw[pos]
        pos += 1
        line = bytearray(raw[pos : pos + stride])
        pos += stride
        if ftype == 1:
            for i in range(bpp, stride):
                line[i] = (line[i] + line[i - bpp]) & 0xFF
        elif ftype == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif ftype == 3:
            for i in range(stride):
                left = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + ((left + prev[i]) >> 1)) & 0xFF
        elif ftype == 4:
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                b = prev[i]
                c = prev[i - bpp] if i >= bpp else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pred) & 0xFF
        elif ftype != 0:
            raise SystemExit(f"unsupported PNG filter {ftype}")
        out[row * stride : (row + 1) * stride] = line
        prev = line
    return width, height, out


def estimate_ink(pixels):
    """Median colour of the most saturated (darkest-blue) ink pixels."""
    core = [
        (pixels[i], pixels[i + 1], pixels[i + 2])
        for i in range(0, len(pixels), 3)
        if pixels[i + 2] < 110 and pixels[i] > pixels[i + 2]
    ]
    if not core:
        raise SystemExit("no ink pixels found — is this the right logo?")
    core.sort(key=lambda p: p[2])
    return core[len(core) // 2]


def knockout(width, height, pixels, ink):
    """Un-premultiply the white background into an alpha channel."""
    fr, fg, fb = ink
    # Solve per channel and keep the strongest signal; blue dominates for gold.
    denom = [255 - fr or 1, 255 - fg or 1, 255 - fb or 1]
    rgba = bytearray(width * height * 4)
    for i in range(0, len(pixels), 3):
        r, g, b = pixels[i], pixels[i + 1], pixels[i + 2]
        if r >= 253 and g >= 253 and b >= 253:
            continue  # pure paper -> fully transparent
        a = max((255 - r) / denom[0], (255 - g) / denom[1], (255 - b) / denom[2])
        a = 1.0 if a > 1.0 else a
        j = (i // 3) * 4
        if a <= 0.0:
            continue
        inv = 255.0 * (1.0 - a)
        rgba[j] = min(255, max(0, round((r - inv) / a)))
        rgba[j + 1] = min(255, max(0, round((g - inv) / a)))
        rgba[j + 2] = min(255, max(0, round((b - inv) / a)))
        rgba[j + 3] = round(a * 255)
    return rgba


def write_png_rgba(path, width, height, rgba):
    stride = width * 4
    raw = bytearray()
    prev = bytearray(stride)
    for row in range(height):
        line = rgba[row * stride : (row + 1) * stride]
        # Adaptive filtering: try None/Sub/Up/Paeth, keep the cheapest row.
        best, best_type = None, 0
        for ftype in (0, 1, 2, 4):
            cand = bytearray(stride)
            for i in range(stride):
                cur = line[i]
                if ftype == 0:
                    cand[i] = cur
                elif ftype == 1:
                    cand[i] = (cur - (line[i - 4] if i >= 4 else 0)) & 0xFF
                elif ftype == 2:
                    cand[i] = (cur - prev[i]) & 0xFF
                else:
                    a = line[i - 4] if i >= 4 else 0
                    b = prev[i]
                    c = prev[i - 4] if i >= 4 else 0
                    p = a + b - c
                    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                    pred = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                    cand[i] = (cur - pred) & 0xFF
            score = sum(v if v < 128 else 256 - v for v in cand)
            if best is None or score < best[0]:
                best, best_type = (score, cand), ftype
        raw.append(best_type)
        raw += best[1]
        prev = line

    def chunk(kind, body):
        return (
            struct.pack(">I", len(body))
            + kind
            + body
            + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)
        )

    path.write_bytes(
        PNG_SIG
        + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


def main():
    width, height, pixels = read_png_rgb(SRC)
    ink = estimate_ink(pixels)
    rgba = knockout(width, height, pixels, ink)

    # Report the ink bounding box so the CSS can size the emblem exactly.
    min_x, min_y, max_x, max_y = width, height, -1, -1
    opaque = 0
    for idx in range(0, len(rgba), 4):
        if rgba[idx + 3] > 8:
            opaque += 1
            p = idx // 4
            x, y = p % width, p // width
            min_x, max_x = min(min_x, x), max(max_x, x)
            min_y, max_y = min(min_y, y), max(max_y, y)

    write_png_rgba(DST, width, height, rgba)
    print(f"source ink colour : rgb{ink}")
    print(f"canvas            : {width}x{height} (unchanged)")
    print(f"ink bounding box  : x {min_x}-{max_x} ({max_x - min_x + 1}px), "
          f"y {min_y}-{max_y} ({max_y - min_y + 1}px)")
    print(f"ink inset         : x {min_x / width:.4f}-{(width - 1 - max_x) / width:.4f}, "
          f"y {min_y / height:.4f}-{(height - 1 - max_y) / height:.4f}")
    print(f"ink pixels kept   : {opaque}")
    print(f"written           : {DST.relative_to(ROOT)} "
          f"({DST.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    sys.exit(main())
