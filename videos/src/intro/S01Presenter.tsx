import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { Appear } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Slide 1 — the presenter's own introduction (decks/01-.../Intro-video.mp4, 55.3 s), with overlays
// in the left and right thirds and a lower third, clear of the presenter in the centre. Times follow
// the recording: speech starts at 2.5 s, and its pauses mark the script's sentences.
// The clip is silent: the recording's audio (EQ-matched) is slide 1's narration, kept in sync.
export const PRESENTER_SECS = 55.33;

const AGENDA: { label: string; at: number }[] = [
  { label: "A short history · frameworks to Open APIs", at: 15.5 },
  { label: "Why the Component and Canvas standards", at: 25.9 },
  { label: "What a Component is · Canvas services", at: 29.2 },
  { label: "Business benefits", at: 38.8 },
  { label: "A tour of the Canvas and its Portal", at: 41.8 },
  { label: "A live deploy, configured automatically", at: 45.7 },
  { label: "Available · experimental · planned", at: 50.5 },
];

const panel: React.CSSProperties = {
  background: "rgba(10, 15, 30, 0.86)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

export const S01Presenter: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Video src={staticFile("captures/intro-presenter.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />

    {/* Lower-third title: fades in at the start, no movement (house style) */}
    <Appear at={0.3} from="none" out={7.4} style={{ left: 70, top: 800 }}>
      <div style={{ ...panel, padding: "26px 40px", width: 1060, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>TRAINING SERIES · PART 1</div>
        <div style={{ fontSize: 58, fontWeight: 800, color: C.text, marginTop: 6, whiteSpace: "nowrap" }}>
          Introduction to the ODA <span style={{ color: C.tmf }}>Canvas</span>
        </div>
      </div>
    </Appear>

    {/* "…the execution platform for ODA Components": the ODA Canvas picture, a component above it */}
    <Appear at={7.8} from="right" out={15.0} style={{ left: 1250, top: 420 }}>
      <div style={{ ...panel, width: 620, height: 470, position: "relative" }}>
        <div style={{ position: "absolute", left: 225, top: 28 }}>
          <OdaComponent size={170} labels={false} />
        </div>
        <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ position: "absolute", left: 30, top: 215, width: 560 }} />
      </div>
    </Appear>

    {/* Running agenda: each topic appears as it is named */}
    <Appear at={15.2} from="left" style={{ left: 50, top: 120 }}>
      <div style={{ ...panel, width: 590, height: 860, padding: "30px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>IN THIS VIDEO</div>
      </div>
    </Appear>
    {AGENDA.map((a, i) => (
      <Appear key={a.label} at={a.at} from="left" style={{ left: 80, top: 205 + i * 108 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, width: 530 }}>
          <div
            style={{
              flex: "none",
              width: 52,
              height: 52,
              borderRadius: 26,
              border: `3px solid ${C.tmf}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              color: C.text,
            }}
          >
            {i + 1}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{a.label}</div>
        </div>
      </Appear>
    ))}
  </AbsoluteFill>
);
