import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { Appear, Gear, Pill } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Deck 02, slide 1 — the presenter's own introduction (decks/02-.../Intro-video.mp4, 58.4 s, 1280×720),
// with overlays in the left and right thirds and a lower third, clear of the presenter in the centre.
// Times follow the recording (Whisper segments and pauses): the question at 7.0 s, "traditional
// application" at 13.0, "The ODA Canvas separates those" at 25.0, "Components declare" at 28.0,
// "modular platform" at 34.0, then the agenda from 40.0.
// The clip is silent: the recording's audio (EQ-matched) is slide 1's narration, kept in sync.
export const BUY_PRESENTER_SECS = 58.43;

const AGENDA: { label: string; at: number }[] = [
  { label: "Three ways to get a Canvas", at: 41.0 },
  { label: "Checking a Canvas provides its services", at: 44.6 },
  { label: "Operator types, with examples", at: 49.8 },
  { label: "The Canvas on a real cluster", at: 53.2 },
  { label: "What's coming next", at: 56.2 },
];

const panel: React.CSSProperties = {
  background: "rgba(10, 15, 30, 0.86)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

const BUNDLE = ["its own API gateway", "its own identity management", "its own monitoring"];

export const S01BuyPresenter: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Video src={staticFile("captures/buy-presenter.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />

    {/* Lower-third title: fades in at the start and stays through the question (house style: no movement) */}
    <Appear at={0.3} from="none" out={12.6} style={{ left: 70, top: 800 }}>
      <div style={{ ...panel, padding: "26px 40px", width: 1180, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>TRAINING SERIES · PART 2</div>
        <div style={{ fontSize: 54, fontWeight: 800, color: C.text, marginTop: 6, whiteSpace: "nowrap" }}>
          How do I <span style={{ color: C.canvas }}>buy</span> or <span style={{ color: C.operator }}>build</span> an ODA Canvas?
        </div>
      </div>
    </Appear>

    {/* "With a traditional application…": one vendor bundle, app and platform together */}
    <Appear at={13.2} from="right" out={24.8} style={{ left: 1300, top: 300 }}>
      <div style={{ ...panel, width: 580, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.muted }}>TRADITIONAL APPLICATION</div>
        <div style={{ marginTop: 18, borderRadius: 16, border: `3px dashed ${C.danger}`, padding: 18 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.text, marginBottom: 12 }}>Vendor's software</div>
          {BUNDLE.map((b, i) => (
            <Appear key={b} at={19.4 + i * 0.9} from="up" dist={20} style={{ position: "relative" }}>
              <div style={{ fontSize: 26, fontWeight: 600, color: C.text, padding: "10px 16px", marginTop: 10, borderRadius: 12, background: `${C.danger}22` }}>
                + {b}
              </div>
            </Appear>
          ))}
        </div>
      </div>
    </Appear>

    {/* "The ODA Canvas separates those. Components declare what they need…" */}
    <Appear at={25.2} from="right" out={33.8} style={{ left: 1290, top: 290 }}>
      <div style={{ ...panel, width: 600, height: 620, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.canvas }}>THE ODA CANVAS</div>
        <div style={{ position: "absolute", left: 215, top: 64 }}>
          <OdaComponent size={170} labels={false} />
        </div>
        <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ position: "absolute", left: 25, top: 350, width: 550 }} />
        <Appear at={28.3} from="up" dist={20} style={{ left: 30, top: 240 }}>
          <Pill color={C.component} fontSize={22}>declares what it needs</Pill>
        </Appear>
        <Appear at={31.0} from="up" dist={20} style={{ left: 30, top: 292 }}>
          <Pill color={C.canvas} fontSize={22}>platform services you choose</Pill>
        </Appear>
      </div>
    </Appear>

    {/* "So the Canvas isn't one product. It's a modular platform, built from Canvas operators." */}
    <Appear at={34.2} from="right" out={40.6} style={{ left: 1300, top: 360 }}>
      <div style={{ ...panel, width: 580, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.operator }}>NOT ONE PRODUCT</div>
        <div style={{ fontSize: 38, fontWeight: 800, color: C.text, marginTop: 10, lineHeight: 1.15 }}>A modular platform, built from Canvas operators</div>
        <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
          {[C.operator, C.api, C.identity, C.secrets, C.ai].map((c, i) => (
            <Appear key={c} at={36.4 + i * 0.25} from="pop" style={{ position: "relative" }}>
              <Gear size={74} color={c} />
            </Appear>
          ))}
        </div>
      </div>
    </Appear>

    {/* Running agenda: each topic appears as it is named */}
    <Appear at={40.4} from="left" style={{ left: 50, top: 200 }}>
      <div style={{ ...panel, width: 590, height: 690, padding: "30px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>IN THIS VIDEO</div>
      </div>
    </Appear>
    {AGENDA.map((a, i) => (
      <Appear key={a.label} at={a.at} from="left" style={{ left: 80, top: 285 + i * 118 }}>
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
