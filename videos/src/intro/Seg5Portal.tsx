import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import {
  Appear,
  Code,
  Draw,
  Gear,
  Heading,
  IconName,
  Pill,
  Stage,
  Svg,
  Tile,
  useT,
} from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Slide 21 — Identity configuration
export const S21IdentityConfig: React.FC = () => (
  <Stage>
    <Heading kicker="A tour of the Canvas" title="Identity configuration" color={C.identity} />
    <Appear at={2.4} from="left" style={{ left: 120, top: 260 }}>
      <Code
        at={2.6}
        perLine={0.15}
        fontSize={24}
        width={620}
        title="IdentityConfig"
        focus={null}
        lines={[
          { text: "kind: IdentityConfig", color: C.muted },
          { text: "spec:" },
          { text: "canvasSystemRole: CanvasRole", indent: 1, color: C.identity },
          { text: "componentRole:", indent: 1 },
          { text: "- name: pcadmin", indent: 1 },
          { text: "- name: cat1owner", indent: 1 },
          { text: "- name: cat2owner", indent: 1 },
        ]}
      />
    </Appear>
    <Appear at={7.2} from="up" style={{ left: 120, top: 700 }}>
      <Pill color={C.identity} fontSize={28}>
        or dynamic · TMF672 roles &amp; permissions API
      </Pill>
    </Appear>
    <Svg>
      <Draw d="M 760 450 L 860 450" at={10.6} color={C.identity} arrow />
      <Draw d="M 1080 420 C 1160 420, 1160 330, 1250 330" at={12.2} color={C.identity} arrow />
      <Draw d="M 1080 480 C 1160 480, 1160 560, 1250 560" at={13.2} color={C.identity} arrow />
      <Draw d="M 970 560 C 970 680, 860 700, 820 790" at={15.6} color={C.secrets} arrow />
      <Draw d="M 970 560 C 970 680, 1300 700, 1340 790" at={18.0} color={C.api} arrow />
    </Svg>
    <Appear at={10.8} from="pop" style={{ left: 875, top: 345 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <Gear size={180} color={C.identity} />
        <div style={{ fontSize: 26, fontWeight: 800, color: C.identity }}>Identity Config operator</div>
      </div>
    </Appear>
    <Appear at={12.4} from="right" style={{ left: 1260, top: 280 }}>
      <Tile label="Keycloak" color={C.identity} icon="shield" w={520} h={100} fontSize={34} />
    </Appear>
    <Appear at={13.4} from="right" style={{ left: 1260, top: 510 }}>
      <Tile label="Microsoft Entra ID" color={C.identity} icon="shield" w={520} h={100} fontSize={34} />
    </Appear>
    <Appear at={15.8} from="up" style={{ left: 470, top: 800 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Gear size={84} color={C.secrets} spin={70} />
        <div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Credentials Management</div>
          <div style={{ fontSize: 26, color: C.muted }}>client ID + secret → Kubernetes Secret</div>
        </div>
      </div>
    </Appear>
    <Appear at={18.2} from="up" style={{ left: 1150, top: 800 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Gear size={84} color={C.api} spin={70} />
        <div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Dependency Management</div>
          <div style={{ fontSize: 26, color: C.muted }}>connects APIs once access is granted</div>
        </div>
      </div>
    </Appear>
  </Stage>
);

// Slide 22 — Observability
const STACK: { label: string; icon: IconName; at: number }[] = [
  { label: "Prometheus", icon: "chart", at: 16.0 },
  { label: "Grafana", icon: "layers", at: 16.8 },
  { label: "Jaeger", icon: "trace", at: 17.6 },
  { label: "OpenTelemetry Collector", icon: "gear", at: 18.4 },
];

export const S22Observability: React.FC = () => {
  const t = useT();
  const count = 41 + (t > 27.4 ? 1 : 0) + (t > 28.6 ? 1 : 0);
  const bump = interpolate(t, [27.4, 27.8, 28.6, 29.0], [0, 1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage>
      <Heading kicker="A tour of the Canvas" title="Observability" color={C.observability} />
      <Appear at={0.8} from="up" style={{ left: 110, top: 290 }}>
        <OdaComponent size={300} labels={false} highlight={t >= 3.4 && t < 10 ? "management" : null} dim={0.45} />
      </Appear>
      <Appear at={3.4} from="left" style={{ left: 120, top: 600 }}>
        <Pill color={C.observability} fontSize={26}>metrics · OpenMetrics</Pill>
      </Appear>
      <Appear at={6.2} from="left" style={{ left: 120, top: 670 }}>
        <Pill color={C.observability} fontSize={26}>traces · OpenTelemetry</Pill>
      </Appear>
      <Svg>
        <Draw d="M 440 420 L 640 420" at={11.0} color={C.api} arrow />
        {STACK.map((s, i) => (
          <Draw key={s.label} d={`M 900 420 C 1000 420, 1000 ${300 + i * 118}, 1120 ${300 + i * 118}`} at={s.at - 0.3} dur={0.5} color={C.observability} width={3} arrow />
        ))}
        <Draw d="M 770 590 L 770 705" at={20.4} color={C.muted} width={3} dash />
      </Svg>
      <Appear at={11.2} from="pop" style={{ left: 650, top: 320 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Gear size={170} color={C.api} />
          <div style={{ fontSize: 26, fontWeight: 800, color: C.api, width: 260, textAlign: "center" }}>
            API operator sets up scraping
          </div>
        </div>
      </Appear>
      <Appear at={15.4} from="right" style={{ left: 1130, top: 196 }}>
        <div style={{ fontSize: 24, color: C.muted, fontWeight: 700, letterSpacing: 3 }}>REFERENCE STACK</div>
      </Appear>
      {STACK.map((s, i) => (
        <Appear key={s.label} at={s.at} from="right" style={{ left: 1130, top: 255 + i * 118 }}>
          <Tile label={s.label} color={C.observability} icon={s.icon} w={600} h={92} fontSize={32} />
        </Appear>
      ))}
      <Appear at={20.6} from="up" style={{ left: 560, top: 720 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <Pill color={C.muted} fontSize={26}>Managed Prometheus</Pill>
          <Pill color={C.muted} fontSize={26}>Datadog</Pill>
        </div>
      </Appear>
      <Appear at={24.0} from="up" style={{ left: 1130, top: 760 }}>
        <div
          style={{
            width: 600,
            padding: "22px 28px",
            borderRadius: 20,
            background: C.panel,
            border: `3px solid ${C.tmf}`,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 24, color: C.tmf, fontWeight: 800, letterSpacing: 2 }}>BUSINESS METRIC</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>products_created_total</div>
            <div style={{ fontSize: 56, fontWeight: 800, scale: String(1 + bump * 0.15), color: bump > 0.5 ? C.ok : C.text }}>
              {count}
            </div>
          </div>
        </div>
      </Appear>
    </Stage>
  );
};

