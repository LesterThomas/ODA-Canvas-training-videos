"""Write a review copy holding only some slides of a built deck, through PowerPoint.

Usage: python subset_deck.py decks/<deck-id>.pptx "decks/<deck-id> - final.pptx" 1-4

Deleting slides in PowerPoint keeps the remaining slides' SlideIDs, so presentation-generator
approvals on the copy carry over for slides that did not change. Run it with a Python that has
comtypes (e.g. presentation-generator's .venv).
"""

import os
import shutil
import sys

import comtypes.client


def main() -> None:
    src, dst, spec = sys.argv[1], sys.argv[2], sys.argv[3]
    a, _, b = spec.partition("-")
    keep = set(range(int(a), int(b or a) + 1))
    dst = os.path.abspath(dst)
    if os.path.exists(os.path.join(os.path.dirname(dst), "~$" + os.path.basename(dst))):
        sys.exit(f"{dst} is open in PowerPoint: close it there, then try again")
    tmp = dst + ".tmp.pptx"
    shutil.copy2(src, tmp)
    app = comtypes.client.CreateObject("PowerPoint.Application")
    pres = app.Presentations.Open(tmp, ReadOnly=False, Untitled=False, WithWindow=False)
    try:
        for i in range(pres.Slides.Count, 0, -1):
            if i not in keep:
                pres.Slides(i).Delete()
        pres.Save()
        count = pres.Slides.Count
    finally:
        pres.Close()
        if app.Presentations.Count == 0:
            app.Quit()
    os.replace(tmp, dst)
    print(f"saved {dst} with {count} slides")


if __name__ == "__main__":
    main()
