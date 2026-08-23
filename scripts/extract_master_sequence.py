"""Build verified desktop/mobile canvas sequences from one continuous master film."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def cover(frame: np.ndarray, width: int, height: int, center_x: float = 0.5) -> np.ndarray:
    source_h, source_w = frame.shape[:2]
    scale = max(width / source_w, height / source_h)
    resized_w = max(width, round(source_w * scale))
    resized_h = max(height, round(source_h * scale))
    resized = cv2.resize(frame, (resized_w, resized_h), interpolation=cv2.INTER_AREA)
    max_x = resized_w - width
    x = min(max_x, max(0, round(max_x * center_x)))
    y = max(0, (resized_h - height) // 2)
    return resized[y : y + height, x : x + width]


def write_jpeg(path: Path, frame: np.ndarray, quality: int) -> None:
    ok, encoded = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
    if not ok:
        raise RuntimeError(f"Could not encode {path}")
    path.write_bytes(encoded.tobytes())


def clear_jpegs(directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    for path in directory.glob("f*.jpg"):
        path.unlink()


def sample_indices(total: int, count: int) -> list[int]:
    return [round(index * (total - 1) / (count - 1)) for index in range(count)]


def mobile_center(progress: float) -> float:
    """Keep the main aisle/machinery centered through each part of the supplied film."""
    if progress < 0.20:
        return 0.50
    if progress < 0.31:
        return 0.48
    if progress < 0.63:
        return 0.52
    if progress < 0.79:
        return 0.55
    return 0.50


def extract(master: Path, project_root: Path, desktop_count: int, mobile_count: int) -> dict[str, object]:
    capture = cv2.VideoCapture(str(master))
    total = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = float(capture.get(cv2.CAP_PROP_FPS))
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if total <= 0 or fps <= 0:
        raise RuntimeError(f"Could not inspect {master}")

    assets = project_root / "public" / "assets"
    desktop = assets / "sequence-desktop"
    mobile = assets / "sequence-mobile"
    fallbacks = assets / "fallbacks"
    clear_jpegs(desktop)
    clear_jpegs(mobile)
    fallbacks.mkdir(parents=True, exist_ok=True)

    desktop_picks = sample_indices(total, desktop_count)
    mobile_picks = sample_indices(total, mobile_count)
    chapter_picks = sample_indices(total, 10)
    desktop_lookup = {frame: index for index, frame in enumerate(desktop_picks)}
    mobile_lookup = {frame: index for index, frame in enumerate(mobile_picks)}
    chapter_lookup = {frame: index for index, frame in enumerate(chapter_picks)}
    wanted = set(desktop_picks) | set(mobile_picks) | set(chapter_picks)

    decoded = 0
    source_index = 0
    while True:
        ok, frame = capture.read()
        if not ok or frame is None:
            break
        if source_index in wanted:
            decoded += 1
        if source_index in desktop_lookup:
            index = desktop_lookup[source_index]
            write_jpeg(desktop / f"f{index:03d}.jpg", cover(frame, 1280, 720), 80)
        if source_index in mobile_lookup:
            index = mobile_lookup[source_index]
            progress = source_index / max(1, total - 1)
            write_jpeg(mobile / f"f{index:03d}.jpg", cover(frame, 720, 1280, mobile_center(progress)), 76)
        if source_index in chapter_lookup:
            chapter = chapter_lookup[source_index] + 1
            name = [
                "exterior", "entry", "receiving", "lab", "dyeing",
                "stenter", "finishing", "quality", "warehouse", "exit",
            ][chapter - 1]
            write_jpeg(fallbacks / f"{chapter:02d}-{name}.jpg", cover(frame, 1280, 720), 84)
        source_index += 1
    capture.release()

    desktop_files = sorted(desktop.glob("f*.jpg"))
    mobile_files = sorted(mobile.glob("f*.jpg"))
    if len(desktop_files) != desktop_count or len(mobile_files) != mobile_count:
        raise RuntimeError(
            f"Output verification failed: desktop={len(desktop_files)}, mobile={len(mobile_files)}"
        )
    for path in desktop_files + mobile_files:
        check = cv2.imdecode(np.frombuffer(path.read_bytes(), dtype=np.uint8), cv2.IMREAD_COLOR)
        if check is None or check.size == 0:
            raise RuntimeError(f"Generated frame does not open: {path}")

    return {
        "source_master": {
            "source": str(master),
            "bytes": master.stat().st_size,
            "sha256": sha256(master),
            "width": width,
            "height": height,
            "fps": fps,
            "source_frames": total,
            "duration_seconds": total / fps,
        },
        "desktop": {
            "count": desktop_count,
            "width": 1280,
            "height": 720,
            "quality": 80,
            "bytes": sum(path.stat().st_size for path in desktop_files),
        },
        "mobile": {
            "count": mobile_count,
            "width": 720,
            "height": 1280,
            "quality": 76,
            "bytes": sum(path.stat().st_size for path in mobile_files),
        },
        "chapter_fallbacks": 10,
        "sampling": "even sampling across the continuous 45-second source, including first and last frames",
        "verification": "all expected outputs exist and decode successfully",
        "decoded_source_samples": decoded,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("master", type=Path)
    parser.add_argument("project_root", type=Path)
    parser.add_argument("--desktop-count", type=int, default=225)
    parser.add_argument("--mobile-count", type=int, default=113)
    args = parser.parse_args()
    if not args.master.is_file():
        raise FileNotFoundError(args.master)

    record = extract(args.master, args.project_root, args.desktop_count, args.mobile_count)
    record_path = args.project_root / "public" / "assets" / "generation-records" / "supplied-master-sequence.json"
    record_path.parent.mkdir(parents=True, exist_ok=True)
    record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(record, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    main()
