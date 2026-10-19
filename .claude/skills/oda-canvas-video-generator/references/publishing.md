# Publishing: the overview page and YouTube

## The overview page (every deck in one place)

```bash
cd D:\Dev\lesterthomas\presentation-generator
uv run --native-tls presgen.py hub "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks"    # http://localhost:8760/
```

It lists every `decks/*.pptx`, newest decks included automatically, with:
- the slide review status (the same statuses the review page shows, including "changed");
- whether the final video exists and is up to date, with its length and a Watch link;
- the YouTube link and visibility, once `decks/<deck-id>.youtube.json` exists;
- **Start review / Open review**. Each deck's review page is its own `presgen serve` (it owns a voice
  worker and drives PowerPoint). The hub reuses a running server (each server records itself in
  `decks/<deck-id>/server.json`) or starts one on the next free port from 8765, then opens it.

Run it in the background, and point the user at it whenever they ask what state the videos are in.
Servers that the hub starts stop with it when its process tree is stopped. Use "Open review" again to
restart them.

## YouTube

Publish a deck only when the user asks, at the visibility they ask for (start **unlisted** unless told
otherwise). Publishing is outward-facing: confirm the deck, the visibility and any disclosure answers
before saving. The final video must be built and current (every slide approved; the hub shows
"Final video ready").

### 1. The script's `## YouTube` section

Add it to `scripts/<deck-id>.md` after the last slide (extract_notes stops at `## `, so it never
becomes narration). Write it for viewers: what the video covers, and what comes next in the series.

```markdown
## YouTube
- **Title:** Introduction to the ODA Canvas | ODA Canvas training, part 1      (≤ 100 characters)
- **Chapters:** 1=Introduction; 16=Live: the ODA Component Directory           (optional title overrides)
- **Description:**
> First paragraph…
>
> Second paragraph…
- **Links:**
> ODA Canvas reference implementation: https://github.com/tmforum-oda/oda-canvas
```

No `<` or `>` in the description (YouTube rejects them). Slide 1 is usually titled "Title card", so
override it ("1=Introduction").

### 2. Package it

```bash
python .claude/skills/oda-canvas-video-generator/scripts/youtube_package.py <deck-id>
```

Writes `decks/<deck-id>/youtube/`:
- `title.txt` and `description.txt`. The description ends with **Chapters**, one line per slide title
  at its start time in the final video. YouTube makes chapters from that list (first at 0:00, at least
  three, each at least 10 s; the script merges or drops any that break those rules).
- `captions.srt`: the **speaker notes** as captions, one sentence per cue, split into balanced cues of
  at most two 42-character lines. Cues are timed to the actual voice: `asr_words.py` (run with
  csm-lester-voice's Python, which has distil-whisper) transcribes the final video in 28 s pieces, and the
  notes are aligned to the transcript. Deck 01 matched 160 of 160 sentences. Sentences that don't match
  are spread over their slide's narration by word count, and `--no-asr` does that for every sentence.
- `package.json`: everything above, plus the video path.

Read `description.txt` and the start of `captions.srt` before uploading.

### 3. Upload with Claude in Chrome (the user's signed-in Chrome)

Load the `chrome-browser` skill. Then, in a new tab on `https://studio.youtube.com`:

1. **Check the channel.** It must be the one with the existing ODA Canvas videos ("Systems
   Architecture", `UCmVRZcgf2-gY_HR2lKAHhhw`).
2. **Get the video into the page.** `file_upload` takes at most 10 MB per call. Studio's security
   policy blocks fetching from localhost, so instead:
   - split the MP4 into 9.5 MB parts (`decks/<deck-id>/youtube/parts/`);
   - open the upload dialog (the upload icon, top right);
   - with `javascript_tool`, add a temporary `<input type=file id="__oda_part">` that pushes each chosen
     file into `window.__odaParts`;
   - `file_upload` each part into it, then join them: `new File(parts sorted by name, "<deck-id>.mp4",
     {type: "video/mp4"})`;
   - **check the size and SHA-256 against the local file**;
   - set it on Studio's own file input (`DataTransfer`, then a `change` event). It can take a few
     seconds to react, so don't fire a second upload. Remove the temporary input.
3. **Details.** Type the title (select all first). Insert the description with
   `document.execCommand("insertText", …)` into the focused description box, which keeps the line
   breaks. Audience: "No, it's not made for kids". Show advanced settings:
   - **AI use**: ask the user every time. For deck 01 they answered **No** (2026-10-19).
   - **Video language**: English (United Kingdom).
4. **Video elements → Subtitles → Add → Upload file → With timing.** Don't click Continue (it opens a
   native file picker). Use `file_upload` on the hidden `#captions-file-loader` input with
   `captions.srt`, check the cues and timings in the editor, then click **Done** ("subtitles published").
5. **Visibility.** Choose as asked (check `aria-checked` on the UNLISTED radio), then **Save**.
6. **Keep the tab open until the upload finishes.** Closing it cancels the upload. Studio shows
   "Uploading N% … M minutes left".
7. **Record it** in `decks/<deck-id>.youtube.json` (url, video_id, visibility, channel, title,
   duration, chapters, captions, disclosure answers, video SHA-256). This file is committed, and the
   hub shows the link from it.
8. Close the tabs you opened, and give the user the link.

When the user later makes it public, update `visibility` in the `.youtube.json`.
