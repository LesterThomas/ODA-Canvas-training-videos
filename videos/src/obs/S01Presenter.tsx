import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Appear, Icon, Pill } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Deck 05, slide 1 — the presenter's own introduction (decks/05-observability/Intro-video.mp4, 54.6 s, 1280×720),
// with overlays in the left and right thirds and a lower third, clear of the presenter in the centre.
// Times follow the recording (Whisper segments): "Traditionally" at 6.0 s, "An ODA component is different" at
// 17.0, "It declares its metrics APIs" at 19.3, "The Canvas reads that declaration" at 23.0, "open standards" at
// 29.8, "OpenMetrics… OpenTelemetry" at 31.8, "any compliant platform" at 36.2, then the agenda at 39.2, 43.9 and 47.6.
// The clip is silent: the recording's audio (EQ-matched) is slide 1's narration, kept in sync.
export const OBS_PRESENTER_SECS = 54.6;

const AGENDA: { label: string; at: number }[] = [
  { label: "Three kinds of observability", at: 39.8 },
  { label: "How a component's metrics are wired up", at: 44.0 },
  { label: "Live: Prometheus, Grafana and Jaeger", at: 47.8 },
];

const panel: React.CSSProperties = {
  background: "rgba(10, 15, 30, 0.86)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

const APPS = ["Billing app", "Ordering app", "CRM app"];
const SPEC = [
  { text: "managementFunction:", indent: 0, color: C.observability },
  { text: "exposedAPIs:", indent: 1 },
  { text: "- name: metrics", indent: 1 },
  { text: "apiType: openmetrics", indent: 2, color: C.observability },
];

export const S01ObsPresenter: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Video src={staticFile("captures/obs-presenter.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />

    {/* Lower-third title: fades in at the start, no movement (house style) */}
    <Appear at={0.3} from="none" out={5.8} style={{ left: 70, top: 800 }}>
      <div style={{ ...panel, padding: "26px 40px", width: 1080, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>TRAINING SERIES · PART 5</div>
        <div style={{ fontSize: 58, fontWeight: 800, color: C.text, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ color: C.observability }}>Observability</span> in the ODA Canvas
        </div>
      </div>
    </Appear>

    {/* "Traditionally, every application arrives with its own monitoring agents and its own dashboards…" */}
    <Appear at={6.2} from="right" out={16.8} style={{ left: 1300, top: 300 }}>
      <div style={{ ...panel, width: 580, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.muted }}>TRADITIONALLY</div>
        {APPS.map((a, i) => (
          <Appear key={a} at={7.2 + i * 0.6} from="up" dist={20} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "12px 18px", borderRadius: 14, border: `2px solid ${C.panelEdge}` }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{a}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 21, color: C.danger, fontWeight: 600 }}>
                <Icon name="chart" size={26} color={C.danger} /> own agent &amp; dashboards
              </span>
            </div>
          </Appear>
        ))}
        <Appear at={12.2} from="up" dist={20} style={{ position: "relative" }}>
          <div style={{ marginTop: 18, fontSize: 24, color: C.muted, fontWeight: 600 }}>Wired into operations tools, one by one</div>
        </Appear>
      </div>
    </Appear>

    {/* "An ODA component is different. It declares its metrics APIs… The Canvas… configures the observability platform" */}
    <Appear at={17.2} from="right" out={29.6} style={{ left: 1290, top: 230 }}>
      <div style={{ ...panel, width: 600, height: 660, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.component }}>AN ODA COMPONENT</div>
        <div style={{ position: "absolute", left: 30, top: 70 }}>
          <OdaComponent size={150} labels={false} highlight="management" dim={0.4} />
        </div>
        <Appear at={19.5} from="up" dist={20} style={{ left: 30, top: 250 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.text, background: "#0D1426", border: `2px solid ${C.panelEdge}`, borderRadius: 12, padding: "12px 16px", width: 540, boxSizing: "border-box" }}>
            {SPEC.map((l) => (
              <div key={l.text} style={{ paddingLeft: l.indent * 26, color: l.color ?? C.text }}>{l.text}</div>
            ))}
          </div>
        </Appear>
        <Appear at={23.4} from="up" dist={20} style={{ left: 30, top: 440 }}>
          <div style={{ width: 540, padding: "18px 20px", borderRadius: 16, background: `${C.observability}1F`, border: `3px solid ${C.observability}`, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 27, fontWeight: 800, color: C.text }}>
              <Icon name="chart" size={34} color={C.observability} /> The Canvas configures the platform
            </div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 6 }}>automatically, from the declaration</div>
          </div>
        </Appear>
      </div>
    </Appear>

    {/* "It uses open standards, OpenMetrics for metrics and OpenTelemetry for traces, so any compliant platform can be used." */}
    <Appear at={30.0} from="right" out={39.0} style={{ left: 1300, top: 300 }}>
      <div style={{ ...panel, width: 580, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.observability }}>OPEN STANDARDS</div>
        {[
          { name: "OpenMetrics", what: "metrics", icon: "chart" as const, at: 31.9 },
          { name: "OpenTelemetry", what: "traces", icon: "trace" as const, at: 33.6 },
        ].map((s) => (
          <Appear key={s.name} at={s.at} from="up" dist={20} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, padding: "14px 18px", borderRadius: 14, border: `2px solid ${C.observability}`, background: `${C.observability}14` }}>
              <Icon name={s.icon} size={36} color={C.observability} />
              <span style={{ fontSize: 32, fontWeight: 800, color: C.text }}>{s.name}</span>
              <span style={{ fontSize: 24, color: C.muted }}>{s.what}</span>
            </div>
          </Appear>
        ))}
        <Appear at={36.4} from="up" dist={20} style={{ position: "relative", marginTop: 20 }}>
          <Pill color={C.ok} fontSize={24}>Any compliant platform can be used</Pill>
        </Appear>
      </div>
    </Appear>

    {/* Running agenda: each topic appears as it is named */}
    <Appear at={39.2} from="left" style={{ left: 50, top: 260 }}>
      <div style={{ ...panel, width: 590, height: 520, padding: "30px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>IN THIS VIDEO</div>
      </div>
    </Appear>
    {AGENDA.map((a, i) => (
      <Appear key={a.label} at={a.at} from="left" style={{ left: 80, top: 350 + i * 135 }}>
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
