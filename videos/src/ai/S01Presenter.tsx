import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { Appear, Draw, Icon, Pill } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Deck 04, slide 1 — the presenter's own introduction (decks/04-.../Intro-video.mp4, 77.1 s, 1280×720),
// with overlays in the left and right thirds and a lower third, clear of the presenter in the centre.
// Times follow the recording (Whisper segments and pauses): "AI agents are quickly becoming" at 8.0 s,
// "a few pilots" at 15.0, "wired its agents directly" at 19.0, "lock-in, hidden costs…" at 25.7, "The
// AI-Native Canvas" at 32.4, "declare the tools and models" at 39.2, then the agenda at the pauses
// 47.0, 54.3, 59.0, 66.8 and 70.7.
// The clip is silent: the recording's audio (EQ-matched) is slide 1's narration, kept in sync.
export const AI_PRESENTER_SECS = 77.13;

const AGENDA: { label: string; at: number }[] = [
  { label: "Components as tools for agents", at: 47.2 },
  { label: "Agents as modular components", at: 54.4 },
  { label: "Model as a service and the model gateway", at: 59.1 },
  { label: "Services to run AI at scale", at: 66.9 },
  { label: "How AI helps build the Canvas", at: 70.8 },
];

const panel: React.CSSProperties = {
  background: "rgba(10, 15, 30, 0.86)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

const PROVIDERS = ["Provider A", "Provider B", "Provider C"];
const PROBLEMS = [
  { label: "Lock-in", at: 27.6 },
  { label: "Hidden costs", at: 28.6 },
  { label: "Inconsistent guardrails", at: 29.8 },
];
// Wires drawn inside the "pilots" panel (panel coordinates): agent i → provider j
const WIRES = [[0, 0], [0, 2], [1, 1], [1, 0], [2, 2], [2, 1]];

export const S01AiPresenter: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Video src={staticFile("captures/ai-presenter.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />

    {/* Lower-third title: fades in at the start, no movement (house style) */}
    <Appear at={0.3} from="none" out={7.8} style={{ left: 70, top: 800 }}>
      <div style={{ ...panel, padding: "26px 40px", width: 1060, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>TRAINING SERIES · PART 4</div>
        <div style={{ fontSize: 58, fontWeight: 800, color: C.text, marginTop: 6, whiteSpace: "nowrap" }}>
          The <span style={{ color: C.ai }}>AI-Native</span> ODA Canvas
        </div>
      </div>
    </Appear>

    {/* "AI agents are quickly becoming the way service providers deliver intelligent, autonomous services." */}
    <Appear at={8.2} from="right" out={14.8} style={{ left: 1320, top: 360 }}>
      <div style={{ ...panel, width: 560, padding: "28px 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24 }}>
        <OdaComponent size={130} labels={false} agent crop />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.ai }}>AI AGENTS</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.text, marginTop: 6, lineHeight: 1.2 }}>Intelligent, autonomous services</div>
        </div>
      </div>
    </Appear>

    {/* "Most organisations started with a few pilots. Each team wired its agents directly…" */}
    <Appear at={15.2} from="right" out={32.2} style={{ left: 1290, top: 250 }}>
      <div style={{ ...panel, width: 600, height: 640, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.muted }}>TODAY · PILOTS</div>
        {[0, 1, 2].map((i) => (
          <Appear key={i} at={15.6 + i * 0.4} from="pop" style={{ left: 40, top: 90 + i * 130 }}>
            <OdaComponent size={90} labels={false} agent crop />
          </Appear>
        ))}
        {PROVIDERS.map((p, i) => (
          <Appear key={p} at={19.2 + i * 0.3} from="left" style={{ left: 330, top: 108 + i * 130 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, width: 240, padding: "12px 14px", borderRadius: 12, border: `2px solid ${C.muted}`, fontSize: 21, fontWeight: 700, color: C.text, boxSizing: "border-box" }}>
              <Icon name="cloud" size={26} color={C.muted} /> {p}
            </div>
          </Appear>
        ))}
        <svg width={600} height={640} style={{ position: "absolute", left: 0, top: 0 }}>
          {WIRES.map(([a, b], i) => (
            <Draw key={i} d={`M 140 ${135 + a * 130} C 230 ${135 + a * 130}, 250 ${135 + b * 130}, 328 ${135 + b * 130}`} at={20.0 + i * 0.35} dur={0.5} color={C.danger} width={3} />
          ))}
        </svg>
        <Appear at={24.2} from="up" dist={20} style={{ left: 30, top: 470 }}>
          <div style={{ fontSize: 24, color: C.muted, fontWeight: 600 }}>Fine for a demo. At enterprise scale:</div>
        </Appear>
        <div style={{ position: "absolute", left: 30, top: 518, display: "flex", flexWrap: "wrap", gap: 10, width: 550 }}>
          {PROBLEMS.map((p) => (
            <Appear key={p.label} at={p.at} from="pop" style={{ position: "relative" }}>
              <Pill color={C.danger} fontSize={22}>{p.label}</Pill>
            </Appear>
          ))}
        </div>
      </div>
    </Appear>

    {/* "The AI-Native Canvas takes a different approach. Agents are packaged as ODA Components…" */}
    <Appear at={32.6} from="right" out={45.6} style={{ left: 1290, top: 260 }}>
      <div style={{ ...panel, width: 600, height: 620, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.ai }}>THE AI-NATIVE CANVAS</div>
        <Appear at={36.6} from="pop" style={{ left: 215, top: 70 }}>
          <OdaComponent size={170} labels={false} agent />
        </Appear>
        <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ position: "absolute", left: 25, top: 350, width: 550 }} />
        <Appear at={39.6} from="up" dist={20} style={{ left: 30, top: 252 }}>
          <Pill color={C.ai} fontSize={22}>declares the tools and models it needs</Pill>
        </Appear>
        <Appear at={43.4} from="up" dist={20} style={{ left: 30, top: 300 }}>
          <Pill color={C.canvas} fontSize={22}>the Canvas grants governed access</Pill>
        </Appear>
      </div>
    </Appear>

    {/* Running agenda: each topic appears as it is named */}
    <Appear at={46.2} from="left" style={{ left: 50, top: 190 }}>
      <div style={{ ...panel, width: 590, height: 720, padding: "30px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>IN THIS VIDEO</div>
      </div>
    </Appear>
    {AGENDA.map((a, i) => (
      <Appear key={a.label} at={a.at} from="left" style={{ left: 80, top: 275 + i * 122 }}>
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
