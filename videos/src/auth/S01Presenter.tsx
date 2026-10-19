import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Appear, Icon, Pill } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Deck 03, slide 1 — the presenter's own introduction (decks/03-.../Intro-video.mp4, 58.5 s, 1280×720),
// with overlays in the left and right thirds and a lower third, clear of the presenter in the centre.
// Times follow the recording (Whisper segments): "Traditionally" at 9.0 s, "An ODA component is
// different" at 21.0, "declares the roles" at 27.1, "one shared identity platform" at 29.9, "Keycloak,
// Microsoft Entra ID…" at 34.0, then the agenda from 40.0.
// The clip is silent: the recording's audio (EQ-matched) is slide 1's narration, kept in sync.
export const AUTH_PRESENTER_SECS = 58.47;

const AGENDA: { label: string; at: number }[] = [
  { label: "Declaring security needs in the component YAML", at: 43.0 },
  { label: "Clients and roles, set up by the Canvas", at: 46.4 },
  { label: "A complete example with three components", at: 49.6 },
  { label: "A role grant that connects two components", at: 53.4 },
];

const panel: React.CSSProperties = {
  background: "rgba(10, 15, 30, 0.86)",
  border: "2px solid rgba(255,255,255,0.12)",
  borderRadius: 22,
  boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
};

const APPS = ["Billing app", "Ordering app", "CRM app"];
const ROLES = ["pcadmin", "cat1owner"];  // the static-roles test component, as on slides 6 and 11

export const S01AuthPresenter: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <Video src={staticFile("captures/auth-presenter.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />

    {/* Lower-third title: fades in at the start, no movement (house style) */}
    <Appear at={0.3} from="none" out={8.8} style={{ left: 70, top: 800 }}>
      <div style={{ ...panel, padding: "26px 40px", width: 1180, boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>TRAINING SERIES · PART 3</div>
        <div style={{ fontSize: 58, fontWeight: 800, color: C.text, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ color: C.identity }}>Authentication</span> and <span style={{ color: C.identity }}>Authorization</span>
        </div>
      </div>
    </Appear>

    {/* "Traditionally, every application ships with its own identity management…" */}
    <Appear at={9.2} from="right" out={20.8} style={{ left: 1300, top: 300 }}>
      <div style={{ ...panel, width: 580, padding: "28px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.muted }}>TRADITIONALLY</div>
        {APPS.map((a, i) => (
          <Appear key={a} at={10.0 + i * 0.6} from="up" dist={20} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "12px 18px", borderRadius: 14, border: `2px solid ${C.panelEdge}` }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.text }}>{a}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: C.danger, fontWeight: 600 }}>
                <Icon name="lock" size={26} color={C.danger} /> own users &amp; roles
              </span>
            </div>
          </Appear>
        ))}
        <Appear at={15.0} from="up" dist={20} style={{ position: "relative" }}>
          <div style={{ marginTop: 18, fontSize: 24, color: C.muted, fontWeight: 600 }}>Integrated one by one · managed in many places</div>
        </Appear>
      </div>
    </Appear>

    {/* "An ODA component is different… declares the roles it supports… one shared identity platform" */}
    <Appear at={21.2} from="right" out={39.8} style={{ left: 1290, top: 230 }}>
      <div style={{ ...panel, width: 600, height: 720, position: "relative" }}>
        <div style={{ position: "absolute", left: 30, top: 24, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: C.component }}>AN ODA COMPONENT</div>
        <div style={{ position: "absolute", left: 30, top: 70 }}>
          <OdaComponent size={150} labels={false} />
        </div>
        <Appear at={23.6} from="none" style={{ left: 200, top: 92 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.text, width: 370, lineHeight: 1.3 }}>No identity management of its own</div>
        </Appear>
        <Appear at={27.3} from="up" dist={20} style={{ left: 30, top: 250 }}>
          <div style={{ fontFamily: MONO, fontSize: 21, color: C.text, background: "#0D1426", border: `2px solid ${C.panelEdge}`, borderRadius: 12, padding: "12px 16px", width: 540, boxSizing: "border-box" }}>
            <div style={{ color: C.muted }}>securityFunction:</div>
            <div style={{ paddingLeft: 26, color: C.identity }}>componentRole:</div>
            {ROLES.map((r) => (
              <div key={r} style={{ paddingLeft: 26 }}>- name: {r}</div>
            ))}
          </div>
        </Appear>
        <Appear at={30.2} from="up" dist={20} style={{ left: 30, top: 430 }}>
          <div style={{ width: 540, padding: "18px 20px", borderRadius: 16, background: `${C.identity}1F`, border: `3px solid ${C.identity}`, boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 800, color: C.text }}>
              <Icon name="shield" size={34} color={C.identity} /> One shared identity platform
            </div>
            <div style={{ fontSize: 22, color: C.muted, marginTop: 6 }}>configured by the Canvas</div>
          </div>
        </Appear>
        <Appear at={34.3} from="up" dist={20} style={{ left: 30, top: 580 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, width: 540 }}>
            <Pill color={C.identity} fontSize={22}>Keycloak</Pill>
            <Pill color={C.identity} fontSize={22}>Microsoft Entra ID</Pill>
            <Pill color={C.muted} fontSize={22}>or another identity platform</Pill>
          </div>
        </Appear>
      </div>
    </Appear>

    {/* Running agenda: each topic appears as it is named */}
    <Appear at={40.2} from="left" style={{ left: 50, top: 220 }}>
      <div style={{ ...panel, width: 590, height: 620, padding: "30px 30px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 5, color: C.tmf }}>IN THIS VIDEO</div>
      </div>
    </Appear>
    {AGENDA.map((a, i) => (
      <Appear key={a.label} at={a.at} from="left" style={{ left: 80, top: 305 + i * 128 }}>
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
