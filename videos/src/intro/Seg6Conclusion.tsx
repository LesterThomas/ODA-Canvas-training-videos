import React from "react";
import { C } from "../theme";
import { Appear, Draw, Heading, Icon, IconName, Pill, Stage, Svg } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";
import { Plate } from "./Seg1Intro";

const ROLES: { label: string; icon: IconName; color: string; x: number; y: number }[] = [
  { label: "Communication service providers", icon: "globe", color: C.tmf, x: 120, y: 220 },
  { label: "Cloud providers", icon: "cloud", color: C.canvas, x: 1400, y: 220 },
  { label: "Software vendors", icon: "cube", color: C.component, x: 120, y: 540 },
  { label: "Systems integrators", icon: "handshake", color: C.operator, x: 1400, y: 540 },
];

// Slide 25 — Built together
export const S25Together: React.FC = () => {
  return (
    <Stage>
      <Heading kicker="Conclusion" title="Built together" />
      <Svg>
        {ROLES.map((r, i) => {
          const sx = r.x < 960 ? r.x + 280 : r.x + 120;
          const sy = r.y + 70;
          const ex = r.x < 960 ? 610 : 1310;
          return <Draw key={r.label} d={`M ${sx} ${sy} C ${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} 500, ${ex} 500`} at={5.0 + i * 0.3} color={r.color} width={3} arrow />;
        })}
      </Svg>
      {ROLES.map((r, i) => (
        <Appear key={r.label} at={1.2 + i * 0.6} from="pop" style={{ left: r.x, top: r.y }}>
          <div
            style={{
              width: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                border: `4px solid ${r.color}`,
                background: `${r.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name={r.icon} size={80} color={r.color} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, textAlign: "center" }}>{r.label}</div>
          </div>
        </Appear>
      ))}
      <Appear at={6.0} from="up" style={{ left: 610, top: 410 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: -22 }}>
            <OdaComponent size={190} labels={false} />
            <OdaComponent size={190} mono={C.agent} />
            <OdaComponent size={190} labels={false} />
          </div>
          <Plate w={700} />
        </div>
      </Appear>
      <Appear at={9.6} from="up" style={{ left: 0, top: 820, width: 1920 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, color: C.tmf, fontWeight: 800, letterSpacing: 4 }}>ODA MANIFESTO</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 8 }}>
            A standard execution environment for ODA Components
          </div>
        </div>
      </Appear>
      <Appear at={15.5} from="up" style={{ left: 0, top: 960, width: 1920 }}>
        <div style={{ textAlign: "center", fontSize: 32, color: C.ai, fontWeight: 600 }}>
          Adopting new capabilities — including AI — faster, together
        </div>
      </Appear>
    </Stage>
  );
};

const NEXT: { label: string; icon: IconName; color: string }[] = [
  { label: "How do I buy or build an ODA Canvas?", icon: "layers", color: C.canvas },
  { label: "Authentication & authorization", icon: "shield", color: C.identity },
  { label: "AI-Native ODA Canvas", icon: "spark", color: C.ai },
  { label: "Carbon-aware software", icon: "leaf", color: C.carbon },
];

// Slide 26 — What's next
export const S26Next: React.FC = () => (
  <Stage glow="#1B2550">
    <Heading kicker="Coming up in the series" title="What's next" />
    {NEXT.map((n, i) => (
      <Appear key={n.label} at={2.4 + i * 1.6} from="up" style={{ left: 120 + i * 430, top: 300 }}>
        <div
          style={{
            width: 400,
            height: 330,
            borderRadius: 26,
            background: C.panel,
            border: `3px solid ${n.color}`,
            padding: 34,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 24, color: C.muted, fontWeight: 700 }}>PART {i + 2}</div>
          <Icon name={n.icon} size={84} color={n.color} />
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15 }}>{n.label}</div>
        </div>
      </Appear>
    ))}
    <Appear at={10.5} from="up" style={{ left: 120, top: 740 }}>
      <div style={{ fontSize: 30, color: C.muted, marginBottom: 20 }}>Reference implementation, docs and use-case library</div>
      <div style={{ display: "flex", gap: 24 }}>
        <Pill color={C.tmf} fontSize={36}>
          <Icon name="globe" size={38} color={C.tmf} /> github.com/tmforum-oda/oda-canvas
        </Pill>
        <Pill color={C.component} fontSize={36}>
          <OdaComponent size={34} crop /> tmforum.org/oda/directory
        </Pill>
      </div>
    </Appear>
    <Appear at={15.0} from="up" style={{ left: 120, top: 940 }}>
      <div style={{ fontSize: 40, fontWeight: 800, color: C.operator }}>Contributions welcome.</div>
    </Appear>
  </Stage>
);
