"""Extract optimized desktop/mobile canvas sequences from supplied Concept B clips."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np


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


def read_frame(capture: cv2.VideoCapture, frame_index: int) -> np.ndarray:
    capture.set(cv2.CAP_PROP_POS_FRAMES, frame_index)
    ok, frame = capture.read()
    if not ok or frame is None:
        raise RuntimeError(f"Could not decode frame {frame_index}")
    return frame


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def extract_both(clips: list[Path], desktop: Path, mobile: Path) -> tuple[int, int]:
    desktop.mkdir(parents=True, exist_ok=True)
    mobile.mkdir(parents=True, exist_ok=True)
    desktop_index = 0
    mobile_index = 0
    mobile_centers = [0.5, 0.54, 0.50, 0.56]
    for clip_index, clip in enumerate(clips):
        capture = cv2.VideoCapture(str(clip))
        total = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        if total <= 0:
            raise RuntimeError(f"No frames found in {clip}")
        desktop_picks = [round(i * (total - 1) / 47) for i in range(48)]
        mobile_picks = [round(i * (total - 1) / 23) for i in range(24)]
        if clip_index:
            desktop_picks = desktop_picks[1:]
            mobile_picks = mobile_picks[1:]
        desktop_set = set(desktop_picks)
        mobile_set = set(mobile_picks)
        source_index = 0
        while True:
            ok, frame = capture.read()
            if not ok or frame is None:
                break
            if source_index in desktop_set:
                write_jpeg(desktop / f"f{desktop_index:03d}.jpg", cover(frame, 1280, 720), 80)
                desktop_index += 1
            if source_index in mobile_set:
                write_jpeg(mobile / f"f{mobile_index:03d}.jpg", cover(frame, 720, 1280, mobile_centers[clip_index]), 76)
                mobile_index += 1
            source_index += 1
        capture.release()
    return desktop_index, mobile_index


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_root", type=Path)
    parser.add_argument("project_root", type=Path)
    args = parser.parse_args()
    clips = [args.source_root / f"{index}.mp4" for index in range(1, 5)]
    for clip in clips:
        if not clip.is_file():
            raise FileNotFoundError(clip)

    metadata: list[dict[str, object]] = []
    boundaries: list[dict[str, object]] = []
    first_frames: list[np.ndarray] = []
    last_frames: list[np.ndarray] = []
    for index, clip in enumerate(clips, 1):
        capture = cv2.VideoCapture(str(clip))
        frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = float(capture.get(cv2.CAP_PROP_FPS))
        width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        first_frames.append(read_frame(capture, 0))
        last_frames.append(read_frame(capture, frames - 1))
        capture.release()
        metadata.append({
            "clip": index,
            "source": str(clip),
            "bytes": clip.stat().st_size,
            "sha256": sha256(clip),
            "width": width,
            "height": height,
            "fps": fps,
            "source_frames": frames,
            "duration_seconds": frames / fps if fps else 0,
        })

    for index in range(len(clips) - 1):
        a = cover(last_frames[index], 640, 360)
        b = cover(first_frames[index + 1], 640, 360)
        mae = float(np.mean(np.abs(a.astype(np.float32) - b.astype(np.float32))))
        boundaries.append({
            "from_clip": index + 1,
            "to_clip": index + 2,
            "mean_absolute_pixel_difference": round(mae, 3),
            "assessment": "matched" if mae < 12 else "visually_related",
        })

    public = args.project_root / "public" / "assets"
    desktop_count, mobile_count = extract_both(
        clips,
        public / "sequence-desktop",
        public / "sequence-mobile",
    )
    record = {
        "source_clips": metadata,
        "boundaries": boundaries,
        "desktop": {"count": desktop_count, "width": 1280, "height": 720, "quality": 80},
        "mobile": {"count": mobile_count, "width": 720, "height": 1280, "quality": 76},
        "duplicate_boundary_policy": "first sampled frame removed from clips 2-4",
    }
    record_path = public / "generation-records" / "supplied-clips-sequence.json"
    record_path.parent.mkdir(parents=True, exist_ok=True)
    record_path.write_text(json.dumps(record, indent=2), encoding="utf-8")
    print(json.dumps(record, indent=2))


if __name__ == "__main__":
    main()
