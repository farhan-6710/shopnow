"""Builds the favicon set from the ShopNow logo mark (the amber "SN" running shoe).

Only one colourway of the mark exists (amber on transparent, readable on light and dark
browser chrome), so the light and dark favicons are the same artwork.

Outputs:
  public/brand/favicon-light.png  192x192, transparent, for light browser UI
  public/brand/favicon-dark.png   192x192, transparent, for dark browser UI
  public/favicon.ico              16/32/48 fallback for crawlers and old browsers
  public/brand/apple-icon.png     180x180, opaque, mark on charcoal (iOS home screen)
Run through scripts/share-card/render.sh or: python3 scripts/share-card/icons.py
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
BRAND = PUBLIC / "brand"
SOURCE = PUBLIC / "images" / "brand" / "shoe-logo.png"
FAVICON_SIZE = 192
APPLE_SIZE = 180
FAVICON_PADDING = 0.02
APPLE_PADDING = 0.11
CHARCOAL = (18, 18, 18, 255)


def mark() -> Image.Image:
    """Loads the shoe mark and trims transparent edges."""
    image = Image.open(SOURCE).convert("RGBA")
    return image.crop(image.getchannel("A").getbbox())


def square(source: Image.Image, size: int, padding: float, background=(0, 0, 0, 0)) -> Image.Image:
    """Centres the mark on a square canvas with even padding."""
    canvas = Image.new("RGBA", (size, size), background)
    inner = int(size * (1 - 2 * padding))
    scale = inner / max(source.width, source.height)
    resized = source.resize((round(source.width * scale), round(source.height * scale)), Image.LANCZOS)
    canvas.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    return canvas


BRAND.mkdir(parents=True, exist_ok=True)
shoe = mark()
favicon = square(shoe, FAVICON_SIZE, FAVICON_PADDING)
favicon.save(BRAND / "favicon-light.png", optimize=True)
favicon.save(BRAND / "favicon-dark.png", optimize=True)
square(shoe, 256, FAVICON_PADDING).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
square(shoe, APPLE_SIZE, APPLE_PADDING, CHARCOAL).convert("RGB").save(BRAND / "apple-icon.png", optimize=True)

print("Wrote favicon-light.png, favicon-dark.png, public/favicon.ico, apple-icon.png")
