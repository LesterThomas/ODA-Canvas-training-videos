"""Approximate word timestamps for a narration track, with Whisper (run with csm-lester-voice's Python, which has the model).

Usage: <csm venv python> asr_words.py AUDIO.wav OUT.json [--model distil-whisper/distil-large-v3]

Writes [{"w": word, "start": s, "end": s}, …]. youtube_package.py uses it to time captions to the real
voice. The model must already be in the Hugging Face cache (csm-voice's narration check downloads it).
"""
import argparse
import json
import os

os.environ.setdefault("HF_HUB_OFFLINE", "1")

import torch  # noqa: E402
from transformers import pipeline  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("out")
    ap.add_argument("--model", default="distil-whisper/distil-large-v3")
    a = ap.parse_args()
    cuda = torch.cuda.is_available()
    asr = pipeline("automatic-speech-recognition", model=a.model, device=0 if cuda else -1,
                   torch_dtype=torch.float16 if cuda else torch.float32)
    import soundfile as sf  # the pipeline would need ffmpeg on PATH to read a file itself

    audio, sr = sf.read(a.audio, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    # The pipeline's own long-form chunking breaks with word timestamps on distil-whisper, so transcribe
    # fixed 28 s pieces (Whisper's window is 30 s) and offset their timestamps.
    step = int(28 * sr)
    words = []
    for off in range(0, len(audio), step):
        piece = audio[off:off + step]
        if len(piece) < sr // 2:
            continue
        # Word-level timestamps fail on distil-whisper (its two decoder layers have no usable alignment
        # heads), so take segment timestamps and spread each segment's words over it by length.
        r = asr({"raw": piece, "sampling_rate": sr}, return_timestamps=True,
                generate_kwargs={"language": "en", "task": "transcribe"})
        t0 = off / sr
        for c in r.get("chunks", []):
            st, en = c["timestamp"]
            ws = c["text"].split()
            if not ws or st is None:
                continue
            en = en if en is not None else min(len(piece) / sr, st + 0.35 * len(ws))
            total = sum(len(w) + 1 for w in ws)
            acc = 0
            for w in ws:
                w0 = st + (en - st) * acc / total
                acc += len(w) + 1
                words.append({"w": w, "start": round(t0 + w0, 3), "end": round(t0 + st + (en - st) * acc / total, 3)})
    with open(a.out, "w", encoding="utf-8") as f:
        json.dump(words, f)
    print(f"{len(words)} words")


if __name__ == "__main__":
    main()
