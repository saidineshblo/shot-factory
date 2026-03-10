#!/usr/bin/env python3
"""
Validate a user-uploaded reference image before using it in the pipeline.

Checks file existence, image integrity, dimensions, and file size.
Returns warnings (not errors) for size issues since the pipeline
auto-resizes via label_reference.py.

Usage:
    python validate_reference.py image.png
"""
import json
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

MIN_DIMENSION = 256    # px — below this, image may produce poor results
MAX_DIMENSION = 2048   # px — above this, label_reference.py will resize
MAX_FILE_SIZE  = 10_000_000  # 10 MB


def validate_reference_image(path):
    """Validate a reference image file.

    Returns:
        dict with keys:
          valid (bool), errors (list[str]), warnings (list[str]),
          width (int), height (int), mode (str), file_size_bytes (int)

    Raises:
        FileNotFoundError: if path does not exist.
    """
    if not os.path.exists(path):
        raise FileNotFoundError(f"Image not found: {path}")

    errors = []
    warnings = []
    width = height = 0
    mode = ""
    file_size = os.path.getsize(path)

    try:
        img = Image.open(path)
        img.verify()          # catches truncated/corrupt files
        img = Image.open(path)  # re-open after verify (verify closes the file)
        width, height = img.size
        mode = img.mode
    except Exception as e:
        errors.append(f"Could not read image: {e}")
        return {
            "valid": False,
            "errors": errors,
            "warnings": warnings,
            "width": 0,
            "height": 0,
            "mode": "",
            "file_size_bytes": file_size,
        }

    if min(width, height) < MIN_DIMENSION:
        warnings.append(
            f"Image is small ({width}x{height}). "
            f"Results may be low quality. Minimum recommended: {MIN_DIMENSION}x{MIN_DIMENSION}."
        )

    if max(width, height) > MAX_DIMENSION:
        warnings.append(
            f"Image is large ({width}x{height}). "
            f"label_reference.py will auto-resize to {MAX_DIMENSION}px on longest side."
        )

    if file_size > MAX_FILE_SIZE:
        warnings.append(
            f"File is large ({file_size / 1_000_000:.1f}MB). "
            f"Upload may be slow. Consider compressing below 10MB."
        )

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "width": width,
        "height": height,
        "mode": mode,
        "file_size_bytes": file_size,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_reference.py <image>")
        sys.exit(1)

    path = sys.argv[1]
    try:
        result = validate_reference_image(path)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(result, indent=2))
    sys.exit(0 if result["valid"] else 1)


if __name__ == "__main__":
    main()
