# Review, narration and the final video (presentation-generator)

`D:\Dev\lesterthomas\presentation-generator` (separate repo, `uv`, Windows + PowerPoint) turns a
finished deck into the narrated `.mp4`. Its README is the full manual. This file covers how the skill
uses it.

## What it does

1. **review**: exports each slide as a 1920×1080 still and a *silent PowerPoint render* (so the
   native entrances and the embedded Remotion clips can be checked). Then it serves a review page at
   http://localhost:8765, where the user approves slides or requests changes, one slide at a time.
2. **Approve → generate, automatically.** Each slide has an **Approved / Draft** toggle. As soon as
   a slide is approved, the review server's background generator works on it, one slide at a time:
   - it synthesises the narration from the speaker notes in the user's cloned voice (csm-voice),
   - PowerPoint renders the slide on its own (`CreateVideo`, 1080p),
   - FFmpeg aligns the animation with the narration (below) and adds the narration.

   Once every visible slide is approved and rendered, the generator rebuilds the final video and its
   chapter list. `presgen.py generate` is the same pipeline from the command line.

The deck is never modified. presentation-generator renders from a copy in `<deck>/.work/`.

Because PowerPoint does the rendering, **animations and embedded clips play in the final video.** The
poster frame and native final state still matter: they are the review stills and the
`--renderer still` fallback.

## Approve, then validate

Each slide has two toggles on the review page. **Approved** means the slide's content is right, and
starts narration and rendering. **Narration validated** means the user has listened to the narrated
clip and accepts it. The final video is built automatically only when every visible slide is both.
Validation is tied to the exact clip, so any rebuild (new notes, re-voice, recording, slide change)
clears it. Never validate on the user's behalf.

The user can also **record** a slide's narration on the page. The recording is matched to the
generated voice (EQ towards its spectrum, then one fixed gain to its loudness; no compression or
noise reduction, which the user rejected) and used in place of the voice; `presgen.py rematch`
re-processes recordings after the matching changes. A clip is rebuilt whenever its narration file
is newer than the clip.

### Presenter videos (the user on camera)

When the user records themselves presenting a slide (e.g. `decks/<deck-id>/Intro-video.mp4` for
deck 01's slide 1), use it as that slide's clip and its sound as the narration:

1. Copy the video to `videos/public/captures/` and build a Remotion composition that plays it
   full-frame and **muted**, with overlays in the left and right thirds and a lower third, clear of the
   presenter. Time each overlay to the recording's pauses (`ffmpeg -af silencedetect=n=-35dB:d=0.4`),
   not to a words-per-second estimate. If -35 dB finds no pauses, try -30 dB, or time to Whisper segments
   (`scripts/asr_words.py` with csm-voice's Python), which also give the words as spoken for the notes.
   Examples: `videos/src/intro/S01Presenter.tsx`, `videos/src/buy/S01Presenter.tsx`.
2. Make the slide a clip slide (remove it from the native `BUILDERS`), set the script's Visual tag,
   and keep the speaker notes as the words actually spoken. Rebuild with `rebuild_deck.sh`.
3. After the refresh, use its sound with
   `presgen.py use-recording "<deck>.pptx" <slide> "<video>" --sync`. It gets the same voice-matching
   EQ and gain as a page recording, but is **not trimmed**, and the slide's timing is **never
   stretched**, so the lips stay in step with the voice. `rematch` keeps it in sync.
   The sound is also delayed 0.1 s, because PowerPoint starts an embedded video about 0.1 s after
   the slide. To check sync, compare the clip with the source: the picture's offset (frame matching)
   and the sound's offset (envelope correlation) should agree within about 0.03 s.
4. The slide is never voiced: the review page offers no Re-voice or Record for it, and approving it
   only renders the clip with the video's sound. It still needs approving and validating like any other.

## Files

| Path | What | Git |
|---|---|---|
| `decks/<deck-id>.review.json` | approvals, comments and history per slide (keyed by PowerPoint SlideID) | **commit** with the deck |
| `decks/<deck-id>/` | stills, notes text, `audio_NN.wav`, `previews/`, `clips/`, the final `<deck-id>_video.mp4`, `<deck-id>_chapters.txt`, `presgen.log` | ignored (`decks/*/`) |

Each approval stores the slide's fingerprint: its still, notes, embedded media and animation timings.
Rebuilding the deck in a way that changes a slide (`build_deck.py`, `animate_deck.ps1`, a notes edit)
marks that slide **changed since approval**, and it needs approving again. Rebuilding without changes
keeps approvals, because the stills are byte-identical between PowerPoint runs.

## Commands (run from the presentation-generator folder)

```bash
cd D:/Dev/lesterthomas/presentation-generator
uv run --native-tls presgen.py review   "D:/Dev/lesterthomas/ODA-Canvas-training-videos/decks/<deck-id>.pptx"   # background: it serves until stopped
uv run --native-tls presgen.py status   "<deck>.pptx" --json
uv run --native-tls presgen.py approve  "<deck>.pptx" 1-4,7          # only when the user said so
uv run --native-tls presgen.py changes  "<deck>.pptx" 5 -m "comment"
uv run --native-tls presgen.py generate "<deck>.pptx"                 # batch alternative to the page (not while the page's server runs)
uv run --native-tls presgen.py generate "<deck>.pptx" --redo-audio 5  # re-voice one slide
```

`--native-tls` is needed on this machine because Norton intercepts TLS. `review` opens the page in the
user's default browser, and its server does the generation. Run it with `run_in_background`, because
it serves until stopped. Restart it after changing presentation-generator's code, because a running
server keeps the old code.

## Live fixes: act on change requests straight away

While a review page is open, keep a watch on it so every **Request changes** is handled at once,
instead of waiting for the user to mention it in chat:

1. **Arm the watch** with the Monitor tool (maximum timeout, re-arm on every expiry for as long as the
   review server runs):
   `bash .claude/skills/oda-canvas-video-generator/scripts/watch_review.sh "<abs path>/decks/<deck-id>.pptx"`.
   It prints one JSON line per change request, with the slide numbers, titles and comment. On start
   it first prints every request that still has no reply from Claude, so a request made while the
   watch was down (it expires every 30 minutes) is never missed. Re-arm it as soon as it expires.
2. **On each event**, give the user a moment (a few seconds) and re-read `status --json`, so
   requests made close together become one rebuild. Then post
   `presgen.py reply ... -m "Working on it" --by claude` so the page shows the request was seen.
3. **Fix through the Feedback loop** (SKILL.md): change the script, scene or builder, and rebuild only
   what changed:
   - Notes or native slide: `extract_notes.py` → `build_deck.py` → `animate_deck.ps1`.
   - A clip: re-render **only that composition** and its poster first. Re-rendering an unchanged clip
     can change its bytes, which clears that slide's approval.
4. **`presgen.py refresh`** the deck. The open page updates by itself, and the slide shows as
   **Updated: review again**. When the user switches it to Approved, it is narrated and rendered
   straight away.
5. **`presgen.py reply`** on each slide, in one or two sentences: what changed, and whether it became
   a skill rule. Then add one line in chat. The user approves or asks again on the page.

Things to watch:

- If the deck is open in PowerPoint, `build_deck.py` stops with "close it there". Reply on the page
  asking the user to close it, and retry once they say so (or on their next request).
- **Review the built deck itself** (`decks/<deck-id>.pptx`), never a hand-made copy. Every fix
  rebuilds that file (`build_deck.py` → `animate_deck.ps1`), so `refresh` shows the fix on the page
  straight away. Unchanged slides keep their approvals, because SlideIDs stay stable while the slide
  order is unchanged. (`tools/subset_deck.py` can still cut a short copy for a quick experiment, keeping
  SlideIDs. Don't use one for the real review: fixes don't reach it unless you recut it.)
- A request you can't act on safely (unclear, a factual claim to verify, a change to a shared
  asset that needs the user's approval): reply on the page with the question, and ask in chat too.
- The watch only runs while this Claude session is open. If the session ends, the requests wait in
  `review.json` and are picked up from `status --json` next time.

## Narration check: speech-to-text on every take

csm-voice transcribes every take with Whisper (`distil-whisper/distil-large-v3`, on the GPU beside the
voice) and compares it with the sentence. A take passes when no more than 15% of the words are missing,
no two missing words are next to each other (a dropped phrase), and it adds no more than three words.
Near-misses such as "carbonware" for "carbon aware" count as heard. Takes that pass win over takes that
don't. Length only decides between takes that pass equally well.

- **Retries:** if no take of a sentence passes, the voice tries up to two more batches of three, with new
  seeds. Cached takes are checked too, and regenerated if they fail.
- **A sentence that still fails** is not cached, and no clip is rendered for the slide.
  presentation-generator posts a change request by **"narration check"** on the review page, quoting
  each failed sentence and what the voice actually said. The watch picks it up like any other request.
- **Handling it:** reword the failing sentence in the script (short sentences, each ending on a plain
  word; spell out hyphenated terms, numbers and identifiers the way they are spoken). Rebuild, then
  reply on the page with the new wording. The user approves the slide again to re-voice it.
- **The record:** every checked sentence is appended to `tts-log.jsonl` in the csm-lester-voice folder,
  with the deck, slide, verdict, transcript and missing words. `python tts_report.py` there summarises
  it: failure and retry rates by sentence feature, then each failed sentence with what came next for the
  same slide (usually its rewording). Review it after each deck, and turn clear patterns into narration
  rules and `extract_notes.py` checks.
- **Turning it off:** pass `--no-check` in the TTS command (for example to compare against the old
  behaviour).

## Rules

- **Approval is the user's call.** Never approve a slide on your own initiative, not even one you
  just fixed. Record approvals only when the user gives them in chat ("approve 1–4"), and tell them
  that the page does the same.
- **Comments on the review page are feedback.** Act on them straight away (see **Live fixes**),
  through the skill's **Feedback loop**, so the deck is fixed and the rule is considered for the
  skill.
- **Narration problems are notes problems.** Mispronunciations, odd pauses and wrong emphasis are fixed
  in the script's speaker notes, then `extract_notes.py` → `build_deck.py` → `animate_deck.ps1`.
  - Use phonetic spelling, such as "O-D-A", only when the voice gets a term wrong.
  - Add `[pause]` for a one-second pause.
  - Don't use version numbers with full stops, because csm-voice splits sentences at every `.`.

  Use `--redo-audio` only when the text is right and the voice simply produced a bad take.
- **Final video only from a fully approved deck.** `--partial` is for previews. Say so if you use it.
- **Check the result before reporting it.** Look at the log summary, and sample a few frames of the
  final video, at least one native slide mid-build and one clip slide, with FFmpeg
  (`imageio_ffmpeg.get_ffmpeg_exe()` in presentation-generator's venv).

## Timing: animation is matched to the real narration

Builds are planned at 2.5 words per second, counted from the start of the narration. The real voice
ran at about 2.3–2.4 on deck 01 (25 words → 11.1 s, 67 words → 28.1 s). Once a slide's narration
exists, presentation-generator re-checks its timing:

- **planned** = words ÷ 2.5, **voice** = the WAV's length, **factor** = voice ÷ planned.
- The slide's PowerPoint render starts with the narration, 1 s in, and is stretched by the factor.
  So a build planned at *t* lands at 1 + *t* × factor, on its words.
- The factor is clamped at ×1.25 / ÷1.25. A clamped slide is logged ("CLAMPED") and flagged on the
  review page. Retime that slide at source: adjust the `k.anim` times or the Remotion `at` values,
  or rewrite the notes so the words and the builds match again.
- Each clip's timing is stored in `decks/<deck-id>/render.json` (`timing`: planned, voice, factor,
  clamped). Check it with the user when they say a slide feels out of step.

This only works if builds really are planned from the narration's word positions (SKILL.md Step 4),
so keep planning that way.
