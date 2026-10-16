"""Assemble a training-video deck: one full-bleed, auto-playing video per slide plus speaker notes.

Usage:
    python tools/build_deck.py <notes.json> <clips_dir> <posters_dir> <clip_prefix> <output.pptx> [title]

- notes.json   list of {"n": slide number, "title": ..., "notes": ...} (made from scripts/<deck-id>.md)
- clips_dir    rendered Remotion clips named <clip_prefix>-NN-*.mp4
- posters_dir  full-resolution final-frame PNGs named <clip_prefix>-NN-*.png (used as the poster
               frame, so a static export of the slide shows the finished diagram)
"""

import glob
import json
import os
import sys

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.util import Inches

NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main"}

# Auto-play the movie when the slide starts (python-pptx's default timing is click-to-play).
AUTOPLAY_TIMING = """<p:timing xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>
    <p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>
      <p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>
        <p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>
          <p:par><p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="afterEffect">
            <p:stCondLst><p:cond delay="0"/></p:stCondLst>
            <p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="{dur}" fill="hold"/><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:cmd></p:childTnLst>
          </p:cTn></p:par>
        </p:childTnLst></p:cTn></p:par>
      </p:childTnLst></p:cTn></p:par>
    </p:childTnLst></p:cTn>
    <p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>
    <p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>
    </p:seq>
    <p:video><p:cMediaNode vol="80000"><p:cTn id="7" fill="hold" display="0"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cMediaNode></p:video>
  </p:childTnLst></p:cTn></p:par></p:tnLst>
</p:timing>"""


def one(pattern: str) -> str:
    hits = sorted(glob.glob(pattern))
    if len(hits) != 1:
        raise SystemExit(f"expected exactly one match for {pattern}, got {hits}")
    return hits[0]


def mp4_duration_ms(path: str) -> int:
    """Read the movie duration from the mp4 'mvhd' box (no ffprobe needed)."""
    with open(path, "rb") as f:
        data = f.read()
    i = data.find(b"mvhd")
    version = data[i + 4]
    if version == 1:
        timescale = int.from_bytes(data[i + 24 : i + 28], "big")
        duration = int.from_bytes(data[i + 28 : i + 36], "big")
    else:
        timescale = int.from_bytes(data[i + 16 : i + 20], "big")
        duration = int.from_bytes(data[i + 20 : i + 24], "big")
    return round(duration * 1000 / timescale)


def main() -> None:
    notes_json, clips_dir, posters_dir, prefix, out_path = sys.argv[1:6]
    deck_title = sys.argv[6] if len(sys.argv) > 6 else ""
    slides = json.load(open(notes_json, encoding="utf-8"))

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    if deck_title:
        prs.core_properties.title = deck_title
    layout = prs.slide_layouts[5]  # "Title Only": keeps a real title for outline/accessibility

    for s in slides:
        n = s["n"]
        clip = one(os.path.join(clips_dir, f"{prefix}-{n:02d}-*.mp4"))
        poster = one(os.path.join(posters_dir, f"{prefix}-{n:02d}-*.png"))

        slide = prs.slides.add_slide(layout)
        bg = slide.background.fill
        bg.solid()
        bg.fore_color.rgb = RGBColor(0x0A, 0x0F, 0x1E)

        # Title lives just off the slide: present in outline view and for screen readers,
        # never rendered on top of the video.
        title = slide.shapes.title
        title.text = s["title"]
        title.left, title.top = prs.slide_width + Inches(0.5), Inches(0)
        title.width, title.height = Inches(6), Inches(1)

        movie = slide.shapes.add_movie(
            clip,
            0,
            0,
            prs.slide_width,
            prs.slide_height,
            poster_frame_image=poster,
            mime_type="video/mp4",
        )
        movie.name = f"Clip {n:02d}"

        # Replace click-to-play timing with auto-play.
        sld = slide.element
        for t in sld.findall("p:timing", NS):
            sld.remove(t)
        timing = etree.fromstring(
            AUTOPLAY_TIMING.format(dur=mp4_duration_ms(clip), spid=movie.shape_id)
        )
        ext = sld.find("p:extLst", NS)  # schema order: cSld, clrMapOvr, transition, timing, extLst
        if ext is not None:
            ext.addprevious(timing)
        else:
            sld.append(timing)

        slide.notes_slide.notes_text_frame.text = s["notes"]

    prs.save(out_path)
    print(f"saved {out_path} with {len(slides)} slides")


if __name__ == "__main__":
    main()
