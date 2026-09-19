"""Generate small questionnaire assets; leave full-size site photographs untouched."""
from pathlib import Path
import re
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = (root / 'components/campaign/finderPhotos.ts').read_text()
photos = sorted(set(re.findall(r":'([^']+\.webp)'", source)))
before = after = 0
for photo in photos:
    original = root / 'public/images' / photo
    target = root / 'public/images/finder-thumbnails' / photo
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((280, 252), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=76, method=6)
    before += original.stat().st_size
    after += target.stat().st_size
print(f'{len(photos)} thumbnails: {before:,} → {after:,} bytes ({100*(1-after/before):.1f}% smaller)')
