"""Prepare the user-supplied 3D gold hero lockup without redrawing it."""

from pathlib import Path

from make_transparent_lockup import crop_to_artwork
from make_transparent_logo import (
    estimate_ink,
    knockout,
    read_png_rgb,
    write_png_rgba,
)


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "references" / "hero-lockup-gold-3d.png"
DST = ROOT / "public" / "assets" / "brand" / "hero-lockup-gold-3d-transparent.png"


def main() -> None:
    width, height, pixels = read_png_rgb(SRC)
    ink = estimate_ink(pixels)
    rgba = knockout(width, height, pixels, ink)
    out_width, out_height, cropped = crop_to_artwork(width, height, rgba, padding=18)
    write_png_rgba(DST, out_width, out_height, cropped)
    print(f"source={width}x{height} output={out_width}x{out_height} written={DST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
