#!/usr/bin/env python3
"""
Split a grid image into individual panels.

Usage:
    python split_grid.py <grid_image> <output_dir> [options]

Options:
    --rows N        Number of rows (default: 2)
    --cols N        Number of columns (default: 2)
    --prefix STR    Filename prefix (default: SC)
    --start N       Starting number (default: 1)
    --names a,b,c   Comma-separated panel names (overrides prefix/start)
"""
import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install with: pip install Pillow")
    sys.exit(1)


def split_grid(grid_path, output_dir, rows=2, cols=2,
               names=None, prefix="SC", start=1):
    """Split a grid image into individual panels.

    Returns:
        list of dicts: [{"name": str, "path": str, "size": "WxH"}, ...]

    Raises:
        FileNotFoundError: if grid_path does not exist.
        ValueError: if rows or cols < 1.
    """
    if not os.path.exists(grid_path):
        raise FileNotFoundError(f"Grid image not found: {grid_path}")
    if rows < 1:
        raise ValueError(f"rows must be >= 1, got {rows}")
    if cols < 1:
        raise ValueError(f"cols must be >= 1, got {cols}")

    img = Image.open(grid_path)
    w, h = img.size
    col_w, row_h = w // cols, h // rows
    total = rows * cols

    if names is None:
        panel_names = [f"{prefix}{start + i}" for i in range(total)]
    else:
        panel_names = list(names[:total])
        for i in range(len(panel_names), total):
            panel_names.append(f"panel_{i + 1}")

    os.makedirs(output_dir, exist_ok=True)
    results = []

    for idx in range(total):
        row, col = idx // cols, idx % cols
        box = (col * col_w, row * row_h,
               col * col_w + col_w, row * row_h + row_h)
        panel = img.crop(box)
        out_path = os.path.join(output_dir, f"{panel_names[idx]}.png")
        panel.save(out_path)
        pw, ph = panel.size
        results.append({"name": panel_names[idx], "path": out_path,
                        "size": f"{pw}x{ph}"})
        print(f"  Saved {panel_names[idx]}.png ({pw}x{ph})")

    print(f"\nDone: {total} panels -> {output_dir}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Split grid image into panels")
    parser.add_argument("grid_image")
    parser.add_argument("output_dir")
    parser.add_argument("--rows", type=int, default=2)
    parser.add_argument("--cols", type=int, default=2)
    parser.add_argument("--prefix", default="SC")
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--names")
    args = parser.parse_args()

    try:
        split_grid(
            args.grid_image, args.output_dir,
            rows=args.rows, cols=args.cols,
            names=args.names.split(",") if args.names else None,
            prefix=args.prefix, start=args.start,
        )
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
