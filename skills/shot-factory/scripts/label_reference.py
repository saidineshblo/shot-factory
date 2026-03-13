#!/usr/bin/env python3
"""
Add a color-coded reference label banner to images before passing to Replicate.

The label is burned into the image so the model knows what each reference
represents — character name, location, shot ID, etc.

Auto-resizes images to MAX_DIMENSION before labelling.
Compresses output to MAX_FILE_SIZE if needed.

Usage:
    python label_reference.py --type character --name "Khan" \
        --output characters/Khan/sheet_labelled.png \
        characters/Khan/sheet.png
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

MAX_DIMENSION   = 2048
MAX_FILE_SIZE   = 4_500_000   # 4.5 MB
MAX_CONTEXT_LEN = 72

LABEL_CONFIG = {
    "character": {
        "bg":     (30, 30, 30, 220),
        "text":   (255, 255, 255),
        "accent": (255, 200, 50),
        "prefix": "CHARACTER REF",
        "h_ratio": 0.09,
    },
    "location": {
        "bg":     (20, 40, 70, 220),
        "text":   (255, 255, 255),
        "accent": (100, 180, 255),
        "prefix": "LOCATION REF",
        "h_ratio": 0.09,
    },
    "shot": {
        "bg":     (50, 20, 20, 220),
        "text":   (255, 255, 255),
        "accent": (255, 100, 100),
        "prefix": "PREVIOUS SHOT",
        "h_ratio": 0.09,
    },
    "style": {
        "bg":     (30, 50, 30, 220),
        "text":   (255, 255, 255),
        "accent": (100, 220, 100),
        "prefix": "STYLE REF",
        "h_ratio": 0.09,
    },
}

_BUNDLED_FONT = os.path.join(os.path.dirname(__file__), "fonts", "DejaVuSans-Bold.ttf")

_FONT_PATHS = [
    _BUNDLED_FONT,
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]


def _load_fonts(banner_h):
    sz_l = max(16, int(banner_h * 0.42))
    sz_s = max(12, int(banner_h * 0.28))
    for fp in _FONT_PATHS:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, sz_l), ImageFont.truetype(fp, sz_s)
            except Exception:
                continue
    d = ImageFont.load_default()
    return d, d


def resize_if_needed(img, max_dim=MAX_DIMENSION):
    w, h = img.size
    longest = max(w, h)
    if longest <= max_dim:
        return img, False
    scale = max_dim / longest
    new_size = (int(w * scale), int(h * scale))
    resized = img.resize(new_size, Image.LANCZOS)
    print(f"  Resized: {w}x{h} -> {new_size[0]}x{new_size[1]}")
    return resized, True


def ensure_file_size(output_path, max_bytes=MAX_FILE_SIZE):
    """Re-save as JPEG if file exceeds max_bytes. Returns final path."""
    if os.path.getsize(output_path) <= max_bytes:
        return output_path
    img = Image.open(output_path).convert("RGB")
    jpg_path = os.path.splitext(output_path)[0] + ".jpg"
    for q in [92, 85, 78, 70]:
        img.save(jpg_path, format="JPEG", quality=q, optimize=True)
        if os.path.getsize(jpg_path) <= max_bytes:
            if jpg_path != output_path:
                os.remove(output_path)
            return jpg_path
    if jpg_path != output_path:
        os.remove(output_path)
    return jpg_path


def resize_only(input_path, output_path, max_dim=MAX_DIMENSION):
    """Resize without label. Preserves alpha channel."""
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input not found: {input_path}")
    img = Image.open(input_path)
    img, _ = resize_if_needed(img, max_dim)
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    ext = os.path.splitext(output_path)[1].lower()
    if ext in (".jpg", ".jpeg"):
        img.convert("RGB").save(output_path, format="JPEG", quality=92)
    else:
        img.save(output_path, format="PNG", optimize=True)
    return ensure_file_size(output_path)


def add_label(input_path, output_path, ref_type, name,
              context=None, max_dim=MAX_DIMENSION):
    """Add color-coded label banner to image. Returns final output path."""
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input not found: {input_path}")
    if ref_type not in LABEL_CONFIG:
        raise ValueError(f"Unknown ref_type '{ref_type}'. "
                         f"Must be one of: {list(LABEL_CONFIG)}")

    cfg = LABEL_CONFIG[ref_type]
    img = Image.open(input_path).convert("RGBA")
    img, _ = resize_if_needed(img, max_dim)
    w, h = img.size

    bh = max(48, int(h * cfg["h_ratio"]))
    fl, fs = _load_fonts(bh)

    if context and len(context) > MAX_CONTEXT_LEN:
        context = context[:MAX_CONTEXT_LEN - 1] + "..."

    banner = Image.new("RGBA", (w, bh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(banner)
    draw.rectangle([(0, 0), (w, bh)], fill=cfg["bg"])
    aw = max(6, int(w * 0.008))
    draw.rectangle([(0, 0), (aw, bh)], fill=cfg["accent"])
    pad = aw + max(10, int(w * 0.015))
    draw.text((pad, int(bh * 0.08)), cfg["prefix"], font=fs, fill=cfg["accent"])
    draw.text((pad, int(bh * 0.38)), name.upper(),   font=fl, fill=cfg["text"])
    if context:
        draw.text((pad, int(bh * 0.72)), context, font=fs, fill=(200, 200, 200, 255))

    result = Image.new("RGBA", (w, h + bh), (0, 0, 0, 255))
    result.paste(banner, (0, 0))
    result.paste(img,    (0, bh))

    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    result.convert("RGB").save(output_path, format="PNG", optimize=True)
    final = ensure_file_size(output_path)
    print(f"Labelled ({ref_type}: {name}): {input_path} -> {final}")
    return final


def main():
    parser = argparse.ArgumentParser(
        description="Add reference label to image for Replicate image_input")
    parser.add_argument("input")
    parser.add_argument("--type", choices=list(LABEL_CONFIG))
    parser.add_argument("--name")
    parser.add_argument("--context", default=None)
    parser.add_argument("--output", required=True)
    parser.add_argument("--max-size", type=int, default=MAX_DIMENSION)
    parser.add_argument("--resize-only", action="store_true")
    args = parser.parse_args()

    try:
        if args.resize_only:
            resize_only(args.input, args.output, max_dim=args.max_size)
        else:
            if not args.type or not args.name:
                parser.error("--type and --name required without --resize-only")
            add_label(args.input, args.output,
                      ref_type=args.type, name=args.name,
                      context=args.context, max_dim=args.max_size)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
