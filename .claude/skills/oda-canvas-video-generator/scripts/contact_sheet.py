"""Tile review stills into 2x2 contact sheets so a whole deck can be checked in a few images.

Usage: python contact_sheet.py <stills_dir> "<glob>"      e.g.  out/stills "Intro-*@100.png"
Writes <stills_dir>/sheet_1.png, sheet_2.png, ... (1920x1080, each tile labelled with its file name).
"""

import glob
import os
import sys

from PIL import Image, ImageDraw


def main() -> None:
    folder, pattern = sys.argv[1], sys.argv[2]
    files = sorted(glob.glob(os.path.join(folder, pattern)))
    if not files:
        raise SystemExit(f"no stills match {pattern} in {folder}")
    sheets = 0
    for k in range(0, len(files), 4):
        sheet = Image.new("RGB", (1920, 1080), "white")
        draw = ImageDraw.Draw(sheet)
        for j, f in enumerate(files[k : k + 4]):
            x, y = (j % 2) * 962, (j // 2) * 542
            sheet.paste(Image.open(f).convert("RGB").resize((958, 538)), (x, y))
            draw.text((x + 8, y + 4), os.path.basename(f), fill="yellow")
        sheets += 1
        sheet.save(os.path.join(folder, f"sheet_{sheets}.png"))
    print(f"{len(files)} stills -> {sheets} sheets in {folder}")


if __name__ == "__main__":
    main()
