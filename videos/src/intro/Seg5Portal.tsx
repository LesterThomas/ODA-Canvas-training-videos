import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { C, FONT } from "../theme";
import {
  Appear,
  BrowserFrame,
  Caption,
  Code,
  Draw,
  EASE_IN_OUT,
  Gear,
  Heading,
  Icon,
  IconName,
  Pill,
  Stage,
  Svg,
  Tile,
  useProg,
  useT,
} from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// ---------- Portal "demo" helpers (screenshots are 1920×1080) ----------

const FRAME_W = 1500;
const S = FRAME_W / 1920; // screenshot → frame scale

type Box = { x: number; y: number; w: number; h: number };
const sb = (b: Box): React.CSSProperties => ({
  position: "absolute",
  left: b.x * S,
  top: b.y * S,
  width: b.w * S,
  height: b.h * S,
});

/** Highlight rectangle over a screenshot region, in screenshot pixel coordinates. */
const Highlight: React.FC<{ box: Box; at: number; out?: number; color?: string; shade?: boolean }> = ({ box, at, out = 1e6, color = C.tmf, shade = true }) => {
  const t = useT();
  const p = interpolate(t, [at, at + 0.4, out, out + 0.4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        ...sb(box),
        border: `4px solid ${color}`,
        borderRadius: 12,
        boxShadow: shade ? `0 0 0 9999px rgba(10,15,30,${0.35 * p}), 0 0 30px ${color}` : `0 0 30px ${color}`,
        opacity: p,
        scale: String(interpolate(p, [0, 1], [1.08, 1])),
      }}
    />
  );
};

/** Animated mouse pointer moving between waypoints (screenshot coords), with click ripples. */
const Cursor: React.FC<{ path: { at: number; x: number; y: number; click?: boolean }[] }> = ({ path }) => {
  const t = useT();
  const times = path.map((p) => p.at);
  const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: EASE_IN_OUT };
  const x = interpolate(t, times, path.map((p) => p.x), ease);
  const y = interpolate(t, times, path.map((p) => p.y), ease);
  return (
    <>
      {path
        .filter((p) => p.click)
        .map((p) => {
          const r = interpolate(t, [p.at, p.at + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={p.at}
              style={{
                position: "absolute",
                left: p.x * S,
                top: p.y * S,
                width: 90 * r,
                height: 90 * r,
                translate: "-50% -50%",
                borderRadius: "50%",
                border: `4px solid ${C.tmf}`,
                opacity: r > 0 && r < 1 ? 1 - r : 0,
              }}
            />
          );
        })}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", left: x * S - 6, top: y * S - 4 }}>
        <path d="M4 2l14 10-6.5 1.5L15 21l-3 1.5-3.5-7.5L4 19z" fill="#fff" stroke="#111" strokeWidth={1.4} />
      </svg>
    </>
  );
};

/** Text typed into a form field over the screenshot. */
const Typed: React.FC<{ box: Box; text: string; at: number; cps?: number; cover?: boolean }> = ({ box, text, at, cps = 14, cover = true }) => {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps)));
  if (t < at - 0.05) return null;
  return (
    <div
      style={{
        ...sb(box),
        background: cover ? "#fff" : "transparent",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        paddingLeft: 14 * S,
        fontFamily: FONT,
        fontSize: 18 * S * 1.0 + 2,
        color: "#111827",
        boxSizing: "border-box",
        border: `2px solid #1677ff`,
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: Math.floor(t * 2) % 2 === 0 ? 1 : 0, marginLeft: 2 }}>|</span>
    </div>
  );
};

/** Screenshot inside a browser frame with a slow camera move towards `focus` (screenshot coords). */
const PortalShot: React.FC<{
  src: string;
  url: string;
  zoomAt: number;
  zoomDur: number;
  zoom: number;
  focus: { x: number; y: number };
  children?: React.ReactNode;
}> = ({ src, url, zoomAt, zoomDur, zoom, focus, children }) => {
  const z = useProg(zoomAt, zoomDur, EASE_IN_OUT);
  const enter = useProg(0.2, 1.0);
  return (
    <div style={{ opacity: enter, translate: `0px ${(1 - enter) * 60}px` }}>
      <BrowserFrame url={url} style={{ left: (1920 - FRAME_W) / 2, top: 44, width: FRAME_W }}>
        <div
          style={{
            position: "relative",
            width: FRAME_W,
            height: 1080 * S,
            transformOrigin: `${focus.x * S}px ${focus.y * S}px`,
            scale: String(1 + (zoom - 1) * z),
          }}
        >
          <Img src={staticFile(src)} style={{ width: FRAME_W, display: "block" }} />
          {children}
        </div>
      </BrowserFrame>
    </div>
  );
};

// Slide 19 — Live demo: the component inventory
export const S19Inventory: React.FC = () => (
  <Stage>
    <PortalShot
      src="portal/inventory.png"
      url="canvas-portal  ·  Components › Inventory"
      zoomAt={9.0}
      zoomDur={3.0}
      zoom={1.45}
      focus={{ x: 1300, y: 300 }}
    >
      <Highlight box={{ x: 12, y: 212, w: 292, h: 48 }} at={3.4} out={5.6} />
      <Highlight box={{ x: 352, y: 102, w: 1520, h: 522 }} at={6.0} out={9.0} color={C.component} />
      <Highlight box={{ x: 352, y: 654, w: 1520, h: 420 }} at={7.3} out={9.0} color={C.canvas} shade={false} />
      <Highlight box={{ x: 1490, y: 170, w: 358, h: 100 }} at={10.2} color={C.ok} />
      <Highlight box={{ x: 749, y: 285, w: 357, h: 100 }} at={10.5} color={C.ok} shade={false} />
      <Highlight box={{ x: 1120, y: 285, w: 357, h: 100 }} at={10.8} color={C.ok} shade={false} />
      <Cursor
        path={[
          { at: 0, x: 900, y: 700 },
          { at: 3.2, x: 110, y: 236, click: true },
          { at: 5.8, x: 1110, y: 136 },
          { at: 8.2, x: 1110, y: 690 },
          { at: 10.0, x: 1700, y: 220 },
          { at: 12, x: 1640, y: 230 },
        ]}
      />
    </PortalShot>
    <Appear at={0.8} from="left" style={{ left: 210, top: 985 }}>
      <Pill color={C.tmf} fontSize={30}>
        <Icon name="globe" size={32} color={C.tmf} /> Canvas Portal · component inventory
      </Pill>
    </Appear>
    <Appear at={6.4} from="right" style={{ left: 1290, top: 985 }}>
      <Pill color={C.component} fontSize={30}>Grouped by business domain</Pill>
    </Appear>
  </Stage>
);

// Slide 20 — Live demo: deploying a component
export const S20Deploy: React.FC = () => {
  const dim = useProg(10.6, 0.8);
  return (
    <Stage>
      <div style={{ opacity: 1 - dim * 0.82 }}>
        <PortalShot
          src="portal/deploy.png"
          url="canvas-portal  ·  Components › Deploy › Install Helm Chart"
          zoomAt={1.0}
          zoomDur={2.0}
          zoom={1.25}
          focus={{ x: 955, y: 1060 }}
        >
          <Highlight box={{ x: 575, y: 252, w: 760, h: 80 }} at={1.2} out={2.8} color={C.canvas} />
          <Typed box={{ x: 575, y: 570, w: 759, h: 37 }} text="productcatalog-v1" at={3.6} />
          <Typed box={{ x: 575, y: 813, w: 759, h: 38 }} text="r1" at={6.4} cps={6} />
          <Highlight box={{ x: 1071, y: 983, w: 265, h: 41 }} at={8.6} color={C.tmf} />
          <Cursor
            path={[
              { at: 0, x: 1500, y: 300 },
              { at: 3.2, x: 900, y: 588, click: true },
              { at: 6.0, x: 900, y: 832, click: true },
              { at: 8.6, x: 1200, y: 1003 },
              { at: 10, x: 1210, y: 1005 },
            ]}
          />
        </PortalShot>
      </div>
      <Appear at={0.6} from="left" style={{ left: 210, top: 985 }}>
        <Pill color={C.tmf} fontSize={30}>
          <OdaComponent size={30} crop /> Components are packaged as Helm charts
        </Pill>
      </Appear>
      {[
        { label: "API operator", sub: "exposes its APIs", color: C.api, icon: "gateway" as IconName, at: 11.0 },
        { label: "Identity operator", sub: "registers its roles", color: C.identity, icon: "shield" as IconName, at: 12.0 },
        { label: "Observability", sub: "monitoring configured", color: C.observability, icon: "chart" as IconName, at: 13.0 },
      ].map((o, i) => (
        <Appear key={o.label} at={o.at} from="pop" style={{ left: 195 + i * 520, top: 470 }}>
          <div
            style={{
              width: 490,
              padding: "30px 30px",
              borderRadius: 24,
              background: C.panel,
              border: `3px solid ${o.color}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${o.color}55`,
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <Gear size={90} color={o.color} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{o.label}</div>
              <div style={{ fontSize: 28, color: C.muted }}>{o.sub}</div>
            </div>
          </div>
        </Appear>
      ))}
      <Appear at={10.8} from="up" style={{ left: 0, top: 330, width: 1920 }}>
        <div style={{ textAlign: "center", fontSize: 54, fontWeight: 800 }}>…then the operators take over</div>
      </Appear>
    </Stage>
  );
};

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

// Slide 23 — Available today, experimental, planned
type St = { label: string; at: number; color: string; note?: string };
const AVAILABLE: St[] = [
  { label: "Component Management", at: 2.6, color: C.operator },
  { label: "API Management", at: 3.4, color: C.api },
  { label: "Identity Config", at: 4.0, color: C.identity },
  { label: "Credentials Management", at: 4.6, color: C.identity },
  { label: "Dependency Management", at: 5.2, color: C.api },
  { label: "Secrets Management", at: 5.8, color: C.secrets },
  { label: "Disruption Budget", at: 6.8, color: C.canvas },
  { label: "Carbon Management", at: 8.2, color: C.carbon },
  { label: "OAuth2 Config", at: 10.4, color: C.identity, note: "prototype" },
];
const EXPERIMENTAL: St[] = [{ label: "AI-Native Canvas", at: 13.6, color: C.ai, note: "Model Gateway · MCP" }];
const PLANNED: St[] = [
  { label: "Event Management", at: 16.2, color: C.muted },
  { label: "Model-as-a-Service", at: 17.0, color: C.muted },
  { label: "Cost Control", at: 18.0, color: C.muted },
  { label: "Database Management", at: 18.8, color: C.muted },
];

const Column: React.FC<{ x: number; title: string; color: string; icon: IconName; items: St[]; at: number }> = ({ x, title, color, icon, items, at }) => (
  <>
    <Appear at={at} from="up" style={{ left: x, top: 240 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800, color }}>
        <Icon name={icon} size={40} color={color} /> {title}
      </div>
    </Appear>
    {items.map((it, i) => (
      <Appear key={it.label} at={it.at} from="pop" style={{ left: x, top: 310 + i * 72 }}>
        <div
          style={{
            width: 540,
            height: 60,
            borderRadius: 12,
            background: `${it.color}22`,
            borderLeft: `8px solid ${it.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            boxSizing: "border-box",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {it.label}
          {it.note ? <span style={{ fontSize: 22, color: C.muted, fontWeight: 600 }}>{it.note}</span> : null}
        </div>
      </Appear>
    ))}
  </>
);

export const S23Status: React.FC = () => (
  <Stage>
    <Heading kicker="Where things stand" title="Available · experimental · planned" />
    <Column x={120} title="Available today" color={C.ok} icon="check" items={AVAILABLE} at={2.2} />
    <Column x={690} title="Experimental" color={C.ai} icon="flask" items={EXPERIMENTAL} at={13.2} />
    <Column x={1260} title="Planned" color={C.muted} icon="rocket" items={PLANNED} at={15.8} />
    <Appear at={21.0} from="up" style={{ left: 690, top: 680 }}>
      <div
        style={{
          width: 1110,
          borderRadius: 24,
          border: `3px solid ${C.ok}`,
          background: `${C.ok}14`,
          padding: "28px 36px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 800 }}>
          <Icon name="check" size={40} color={C.ok} /> Generally available · regular releases
        </div>
        <Appear at={24.4} from="up" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600, color: C.muted }}>
            <Icon name="flask" size={36} color={C.ok} /> Every change tested by a BDD suite on a real Kubernetes cluster
          </div>
        </Appear>
      </div>
    </Appear>
  </Stage>
);

// Slide 24 — Measuring Canvas adoption
const LIGHTS = [
  { label: "API exposure", at: 9.8 },
  { label: "Observability", at: 10.8 },
  { label: "Identity", at: 11.6 },
  { label: "Secrets", at: 12.2 },
  { label: "Responsible AI", at: 14.2 },
  { label: "Cost", at: 15.0 },
  { label: "Carbon", at: 15.6 },
];

export const S24Adoption: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="A tour of the Canvas" title="How do you measure Canvas adoption?" />
      <Appear at={2.4} from="up" style={{ left: 0, top: 290, width: 1920 }}>
        <div style={{ textAlign: "center", fontSize: 44, fontWeight: 700 }}>
          Outcome: <span style={{ color: C.ok }}>automated component deployment &amp; lifecycle management</span>
        </div>
      </Appear>
      {LIGHTS.map((l, i) => {
        const on = interpolate(t, [l.at, l.at + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <Appear key={l.label} at={6.5 + i * 0.15} from="up" style={{ left: 150 + i * 240, top: 470 }}>
            <div style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  background: on > 0.5 ? C.ok : C.panel,
                  border: `5px solid ${on > 0.5 ? C.ok : C.panelEdge}`,
                  boxShadow: `0 0 ${80 * on}px ${C.ok}`,
                  scale: String(1 + 0.12 * Math.sin(on * Math.PI)),
                }}
              />
              <div style={{ fontSize: 30, fontWeight: 700, textAlign: "center", color: on > 0.5 ? C.text : C.muted }}>
                {l.label}
              </div>
            </div>
          </Appear>
        );
      })}
      <Caption at={16.2} bottom={110} color={C.muted}>
        …and future automations
      </Caption>
    </Stage>
  );
};
