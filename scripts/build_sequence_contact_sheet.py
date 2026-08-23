"""Create a compact visual QA sheet from a numbered frame sequence."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np


def read_image(path: Path) -> np.ndarray:
    image = cv2.imdecode(np.frombuffer(path.read_bytes(), dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError(f"Could not decode {path}")
    return image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("sequence", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--columns", type=int, default=5)
    parser.add_argument("--samples", type=int, default=20)
    args = parser.parse_args()

    frames = sorted(args.sequence.glob("f*.jpg"))
    if not frames:
        raise RuntimeError(f"No frames in {args.sequence}")
    picks = [round(index * (len(frames) - 1) / (args.samples - 1)) for index in range(args.samples)]
    tiles: list[np.ndarray] = []
    tile_width, tile_height = 320, 180
    for frame_index in picks:
        source = read_image(frames[frame_index])
        source_h, source_w = source.shape[:2]
        scale = min(tile_width / source_w, tile_height / source_h)
        resized = cv2.resize(source, (round(source_w * scale), round(source_h * scale)), interpolation=cv2.INTER_AREA)
        tile = np.zeros((tile_height, tile_width, 3), dtype=np.uint8)
        x = (tile_width - resized.shape[1]) // 2
        y = (tile_height - resized.shape[0]) // 2
        tile[y : y + resized.shape[0], x : x + resized.shape[1]] = resized
        cv2.putText(tile, f"f{frame_index:03d}", (8, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (247, 247, 247), 1, cv2.LINE_AA)
        tiles.append(tile)

    rows = []
    for start in range(0, len(tiles), args.columns):
        row = tiles[start : start + args.columns]
        while len(row) < args.columns:
            row.append(np.zeros_like(tiles[0]))
        rows.append(np.hstack(row))
    sheet = np.vstack(rows)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    ok, encoded = cv2.imencode(".jpg", sheet, [cv2.IMWRITE_JPEG_QUALITY, 88])
    if not ok:
        raise RuntimeError(f"Could not encode {args.output}")
    args.output.write_bytes(encoded.tobytes())
    print(args.output)


if __name__ == "__main__":
    main()
