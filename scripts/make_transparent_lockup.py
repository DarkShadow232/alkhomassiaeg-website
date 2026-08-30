"""Extract the exact gold lockup from the supplied hero reference.

The user supplied matching composite and clean-background PNGs. Comparing the
two preserves the original lettering while producing a transparent overlay
that can move independently above the single photographic hero image.
"""

from pathlib import Path

from make_transparent_logo import read_png_rgb, write_png_rgba


ROOT = Path(__file__).resolve().parents[1]
COMPOSITE = ROOT / "assets/references/hero-composite-reference.png"
BACKGROUND = ROOT / "public/assets/hero/hero-factory-blur.png"
DST = ROOT / "public/assets/brand/logo-arabic-lockup-transparent.png"


def median(values):
    values = sorted(values)
    return values[len(values) // 2]


def estimate_ink(composite, background):
    core = []
    for i in range(0, len(composite), 3):
        colour = tuple(composite[i : i + 3])
        base = tuple(background[i : i + 3])
        difference = sum(abs(colour[channel] - base[channel]) for channel in range(3))
        r, g, b = colour
        if difference > 145 and r > g > b and b < 115:
            core.append(colour)
    if not core:
        raise SystemExit("no opaque gold pixels found")
    return tuple(median([pixel[channel] for pixel in core]) for channel in range(3))


def extract(width, height, composite, background, ink):
    rgba = bytearray(width * height * 4)
    for i in range(0, len(composite), 3):
        colour = [composite[i], composite[i + 1], composite[i + 2]]
        base = [background[i], background[i + 1], background[i + 2]]
        difference = sum(abs(colour[channel] - base[channel]) for channel in range(3))
        if difference < 4:
            continue

        candidates = []
        for channel in range(3):
            denominator = ink[channel] - base[channel]
            if abs(denominator) < 22:
                continue
            alpha = (colour[channel] - base[channel]) / denominator
            if -.03 <= alpha <= 1.08:
                candidates.append(alpha)
        if not candidates:
            continue

        alpha = median(candidates)
        alpha = min(1.0, max(0.0, alpha))
        if alpha < 0.018:
            continue

        j = (i // 3) * 4
        rgba[j : j + 3] = bytes(ink)
        rgba[j + 3] = round(alpha * 255)
    return rgba


def crop_to_artwork(width, height, rgba, padding=8):
    min_x, min_y, max_x, max_y = width, height, -1, -1
    for index in range(0, len(rgba), 4):
        if rgba[index + 3] <= 4:
            continue
        pixel = index // 4
        x, y = pixel % width, pixel // width
        min_x, min_y = min(min_x, x), min(min_y, y)
        max_x, max_y = max(max_x, x), max(max_y, y)
    if max_x < min_x or max_y < min_y:
        raise SystemExit("transparent extraction produced no artwork")

    min_x, min_y = max(0, min_x - padding), max(0, min_y - padding)
    max_x, max_y = min(width - 1, max_x + padding), min(height - 1, max_y + padding)
    cropped_width, cropped_height = max_x - min_x + 1, max_y - min_y + 1
    cropped = bytearray(cropped_width * cropped_height * 4)
    for row in range(cropped_height):
        source_start = ((min_y + row) * width + min_x) * 4
        source_end = source_start + cropped_width * 4
        target_start = row * cropped_width * 4
        cropped[target_start : target_start + cropped_width * 4] = rgba[source_start:source_end]
    return cropped_width, cropped_height, cropped


def main():
    width, height, composite = read_png_rgb(COMPOSITE)
    bg_width, bg_height, background = read_png_rgb(BACKGROUND)
    if (width, height) != (bg_width, bg_height):
        raise SystemExit("hero reference and background dimensions do not match")
    ink = estimate_ink(composite, background)
    rgba = extract(width, height, composite, background, ink)
    out_width, out_height, rgba = crop_to_artwork(width, height, rgba)
    write_png_rgba(DST, out_width, out_height, rgba)
    print(f"ink={ink} size={out_width}x{out_height} written={DST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
