import React from "react";
import { interpolate } from "remotion";
import { C, MONO } from "../theme";
import {
  Appear,
  Caption,
  Draw,
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
import { Plate } from "../lib/Plate";
import { OdaComponent, OdaSegment } from "../lib/OdaComponent";

// Slide 7 — What is an ODA Component?
const NEEDS: { label: string; icon: IconName; color: string; at: number }[] = [
  { label: "APIs it exposes", icon: "gateway", color: C.api, at: 9.0 },
  { label: "APIs it depends on", icon: "link", color: C.api, at: 10.2 },
  { label: "Events it publishes", icon: "bell", color: C.events, at: 11.2 },
  { label: "Security roles", icon: "shield", color: C.identity, at: 12.2 },
  { label: "Observability", icon: "chart", color: C.observability, at: 13.4 },
];

// Which segment glows while the narration names it (seconds → segment).
const S07_FOCUS: [number, OdaSegment | null][] = [
  [3.0, "core"],
  [7.0, null],
  [11.2, "notification"],
  [12.2, "security"],
  [13.4, "management"],
  [15.5, null],
];

export const S07Component: React.FC = () => {
  const lift = useProg(0.6, 1.2);
  const build = useProg(0.6, 1.8);
  const ifaces = useProg(8.8, 1.8);
  const t = useT();
  const focus = S07_FOCUS.reduce<OdaSegment | null>((acc, [at, seg]) => (t >= at ? seg : acc), null);
  return (
    <Stage>
      <Heading kicker="Components and Canvas" title="What is an ODA Component?" color={C.component} />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 236,
          opacity: lift,
          translate: `0px ${interpolate(lift, [0, 1], [80, 0])}px`,
        }}
      >
        <OdaComponent size={660} build={build} interfaces={ifaces} highlight={focus} dim={0.55} />
      </div>
      <Appear at={1.4} from="up" style={{ left: 300, top: 852 }}>
        <Pill color={C.component} fontSize={28}>independently deployable</Pill>
      </Appear>
      <Appear at={7.0} from="right" style={{ left: 1060, top: 268 }}>
        <div style={{ fontSize: 30, color: C.muted, fontWeight: 600, letterSpacing: 2 }}>
          DECLARES ITS NON-FUNCTIONAL NEEDS
        </div>
      </Appear>
      <Svg>
        {NEEDS.map((n, i) => (
          <Draw
            key={n.label}
            d={`M 790 ${470 + i * 26} C 920 ${470 + i * 26}, 940 ${355 + i * 108}, 1050 ${355 + i * 108}`}
            at={n.at - 0.3}
            dur={0.5}
            color={n.color}
            width={3}
          />
        ))}
      </Svg>
      {NEEDS.map((n, i) => (
        <Appear key={n.label} at={n.at} from="right" style={{ left: 1060, top: 310 + i * 108 }}>
          <Tile label={n.label} color={n.color} icon={n.icon} w={560} h={88} fontSize={32} />
        </Appear>
      ))}
      <Appear at={17.5} from="up" style={{ left: 0, top: 955, width: 1920 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 30 }}>
          <Pill color={C.operator} fontSize={34}>Interoperable</Pill>
          <Appear at={19.0} from="up" style={{ position: "relative" }}>
            <Pill color={C.operator} fontSize={34}>Built for end-to-end use cases</Pill>
          </Appear>
          <Appear at={21.5} from="up" style={{ position: "relative" }}>
            <Pill color={C.tmf} fontSize={34}>Portable to any Canvas</Pill>
          </Appear>
        </div>
      </Appear>
    </Stage>
  );
};

// Slide 8 — What is the ODA Canvas?
const SERVICES: { label: string; icon: IconName; color: string; at: number }[] = [
  { label: "API Management", icon: "gateway", color: C.api, at: 8.6 },
  { label: "Identity", icon: "shield", color: C.identity, at: 9.6 },
  { label: "Observability", icon: "chart", color: C.observability, at: 10.4 },
  { label: "Secrets", icon: "lock", color: C.secrets, at: 11.6 },
  { label: "Events", icon: "bell", color: C.events, at: 12.4 },
];

export const S08Canvas: React.FC = () => {
  const drop = useProg(4.6, 1.2);
  const scan = useProg(6.0, 1.4);
  return (
    <Stage>
      <Heading kicker="Components and Canvas" title="What is the ODA Canvas?" color={C.canvas} />
      <div
        style={{
          position: "absolute",
          left: 780,
          top: interpolate(drop, [0, 1], [130, 292]),
        }}
      >
        <Appear at={0.4} from="pop" style={{ position: "relative" }}>
          <OdaComponent size={360} labels={false} />
        </Appear>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 50 + scan * 250,
            width: 280,
            height: 6,
            background: C.operator,
            boxShadow: `0 0 30px ${C.operator}`,
            opacity: scan > 0 && scan < 1 ? 1 : 0,
          }}
        />
      </div>
      <Appear at={1.5} from="up" dist={80} style={{ left: 410, top: 576 }}>
        <Plate w={1100} fontSize={40} label="ODA Canvas · cloud-native execution environment" />
      </Appear>
      <Appear at={6.4} from="left" style={{ left: 1270, top: 410 }}>
        <Pill color={C.operator} fontSize={28}>reads declared requirements</Pill>
      </Appear>
      {SERVICES.map((s, i) => (
        <Appear key={s.label} at={s.at} from="up" style={{ left: 190 + i * 310, top: 780 }}>
          <Tile label={s.label} color={s.color} icon={s.icon} w={290} h={96} fontSize={27} />
        </Appear>
      ))}
      <Appear at={14.5} from="left" style={{ left: 120, top: 330 }}>
        <div style={{ fontSize: 30, color: C.component, fontWeight: 700, width: 520 }}>
          Developers focus on business functionality
        </div>
      </Appear>
      <Appear at={16.5} from="up" style={{ left: 0, top: 940, width: 1920 }}>
        <div style={{ textAlign: "center", fontSize: 34, color: C.canvas, fontWeight: 700 }}>
          The Canvas handles security · monitoring · scaling
        </div>
      </Appear>
    </Stage>
  );
};

// ---------- Layered capability map used by slides 9 and 10 ----------

type Item = { label: string; color: string; brick?: boolean; ai?: boolean };

const BAND_Y = [250, 450, 640, 830];
const BAND_H = 150;

const Band: React.FC<{
  y: number;
  label: string;
  altLabel?: string;
  morph?: number;
  color: string;
  items: Item[];
  at: number;
  aiAt: number;
}> = ({ y, label, altLabel, morph = 0, color, items, at, aiAt }) => {
  const t = useT();
  const p = interpolate(t, [at, at + 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aiP = interpolate(t, [aiAt, aiAt + 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const base = items.filter((i) => !i.ai);
  const extra = items.filter((i) => i.ai);
  const n = base.length + extra.length * aiP;
  const gap = 16;
  const areaW = 1330;
  const w = (areaW - gap * (n - 1)) / n;
  let x = 0;
  return (
    <div style={{ position: "absolute", left: 100, top: y, opacity: p, translate: `0px ${(1 - p) * 30}px` }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1720,
          height: BAND_H,
          borderRadius: 20,
          background: `${color}12`,
          border: `2px solid ${color}55`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 0,
          height: BAND_H,
          width: 330,
          display: "flex",
          alignItems: "center",
          fontSize: 34,
          fontWeight: 800,
          color,
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ opacity: 1 - morph }}>{label}</div>
          {altLabel ? (
            <div style={{ position: "absolute", top: 0, left: 0, opacity: morph, color: C.ai, width: 330 }}>
              {altLabel}
            </div>
          ) : null}
        </div>
      </div>
      {items.map((it, idx) => {
        const k = it.ai ? aiP : 1;
        const left = 370 + x;
        const ww = w * k;
        x += (w + gap) * k;
        if (k <= 0.001) return null;
        return (
          <div
            key={`${it.label}-${idx}`}
            style={{
              position: "absolute",
              left,
              top: it.brick ? 22 : 30,
              width: ww,
              height: it.brick ? 106 : 90,
              borderRadius: it.brick ? 12 : 14,
              background: `${it.color}24`,
              border: `2px solid ${it.color}`,
              boxShadow: it.ai ? `0 0 ${30 * aiP}px ${it.color}` : "none",
              color: C.text,
              gap: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 23,
              fontWeight: 700,
              lineHeight: 1.15,
              padding: "0 8px",
              boxSizing: "border-box",
              opacity: k,
              overflow: "hidden",
            }}
          >
            {it.brick ? <OdaComponent size={44} crop mono={it.ai ? C.agent : undefined} style={{ flexShrink: 0 }} /> : null}
            <span style={{ textAlign: it.brick ? "left" : "center" }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const LayerMap: React.FC<{ ai: boolean; times: { use: number; comp: number; canvas: number; found: number }; aiTimes?: { label: number; agents: number; ops: number; found: number; iface: number } }> = ({
  ai,
  times,
  aiTimes = { label: 1e6, agents: 1e6, ops: 1e6, found: 1e6, iface: 1e6 },
}) => {
  const t = useT();
  const morph = ai ? interpolate(t, [aiTimes.label, aiTimes.label + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const iface = ai ? interpolate(t, [aiTimes.iface, aiTimes.iface + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <>
      <Band
        y={BAND_Y[0]}
        label="Use cases"
        color={C.tmf}
        at={times.use}
        aiAt={1e6}
        items={[
          { label: "Order-to-fulfilment", color: C.tmf },
          { label: "Fault management", color: C.tmf },
          { label: "Member case studies", color: C.tmf },
          { label: "…", color: C.tmf },
        ]}
      />
      <Band
        y={BAND_Y[1]}
        label="ODA Components"
        altLabel="Components & Agents"
        morph={ai ? interpolate(t, [aiTimes.agents, aiTimes.agents + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0}
        color={C.component}
        at={times.comp}
        aiAt={aiTimes.agents}
        items={[
          { label: "Product Catalog", color: C.component, brick: true },
          { label: "Product Order", color: C.component, brick: true },
          { label: "Product Inventory", color: C.component, brick: true },
          { label: "Agentic component", color: C.agent, brick: true, ai: true },
          { label: "Billing", color: C.component, brick: true },
          { label: "Trouble Ticket", color: C.component, brick: true },
          { label: "Agentic component", color: C.agent, brick: true, ai: true },
        ]}
      />
      <Band
        y={BAND_Y[2]}
        label="ODA Canvas"
        altLabel="AI-Native Canvas"
        morph={morph}
        color={C.operator}
        at={times.canvas}
        aiAt={aiTimes.ops}
        items={[
          { label: "Component Mgmt", color: C.operator },
          { label: "API Mgmt", color: C.api },
          { label: "Observability", color: C.observability },
          { label: "Identity & Credentials", color: C.identity },
          { label: "Cost", color: C.cost },
          { label: "Carbon", color: C.carbon },
          { label: "Model Operator", color: C.ai, ai: true },
          { label: "Data Operator", color: C.ai, ai: true },
        ]}
      />
      <Band
        y={BAND_Y[3]}
        label="IT foundations"
        color={C.canvas}
        at={times.found}
        aiAt={aiTimes.found}
        items={[
          { label: "API Gateway", color: C.canvas },
          { label: "Service Mesh", color: C.canvas },
          { label: "Identity & Access", color: C.canvas },
          { label: "Observability", color: C.canvas },
          { label: "AI Gateway", color: C.ai, ai: true },
          { label: "LLMs", color: C.ai, ai: true },
          { label: "Data Products", color: C.ai, ai: true },
        ]}
      />
      <div
        style={{
          position: "absolute",
          right: 100,
          top: BAND_Y[1] - 42,
          display: "flex",
          gap: 10,
          opacity: interpolate(t, [times.comp, times.comp + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Pill color={C.api} fontSize={22}>Open APIs</Pill>
        <div style={{ opacity: iface, display: "flex", gap: 10 }}>
          <Pill color={C.ai} fontSize={22}>MCP</Pill>
          <Pill color={C.ai} fontSize={22}>A2A</Pill>
        </div>
      </div>
    </>
  );
};

// Slide 9 — Composable IT with ODA
export const S09ComposableIT: React.FC = () => (
  <Stage>
    <Heading kicker="Components and Canvas" title="Composable IT with ODA" />
    <LayerMap ai={false} times={{ use: 3.2, comp: 5.2, canvas: 8.4, found: 11.5 }} />
    <Svg>
      <Draw d="M 1840 400 L 1840 450" at={5.4} color={C.muted} arrow />
      <Draw d="M 1840 600 L 1840 640" at={8.6} color={C.muted} arrow />
      <Draw d="M 1840 790 L 1840 830" at={11.7} color={C.muted} arrow />
    </Svg>
    <Caption at={20.5} bottom={22} color={C.tmf}>
      New business need? Assemble existing building blocks.
    </Caption>
  </Stage>
);

// Slide 10 — Composable AI with Agentic ODA
export const S10ComposableAI: React.FC = () => (
  <Stage glow="#2A1534">
    <Heading kicker="Components and Canvas" title="Composable AI with Agentic ODA" color={C.ai} />
    <LayerMap
      ai
      times={{ use: 0, comp: 0, canvas: 0, found: 0 }}
      aiTimes={{ label: 2.2, agents: 6.5, ops: 23.5, found: 25.0, iface: 13.5 }}
    />
    <Appear at={27.5} from="up" style={{ left: 0, top: 1000, width: 1920 }}>
      <div style={{ textAlign: "center", fontSize: 32, color: C.ai, fontWeight: 700 }}>
        Governed · observed · cost-managed — consistently, across vendors
      </div>
    </Appear>
  </Stage>
);

// Slide 11 — Identity is declared, not implemented
const APPS = [360, 860, 1360];

export const S11Identity: React.FC = () => {
  const t = useT();
  const oda = interpolate(t, [10.5, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const merge = interpolate(t, [13, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Stage>
      <Heading kicker="Example" title="Identity: declared, not implemented" color={C.identity} />
      {APPS.map((x, i) => (
        <React.Fragment key={x}>
          <Appear at={2.6 + i * 0.4} from="up" style={{ left: x, top: 300 }}>
            <div style={{ position: "relative", width: 300, height: 170 }}>
              <div style={{ position: "absolute", opacity: 1 - oda }}>
                <Tile label={`Application ${i + 1}`} color={C.muted} icon="server" w={340} h={110} fontSize={30} />
              </div>
              <div style={{ position: "absolute", left: 80, top: -30, opacity: oda }}>
                <OdaComponent size={180} labels={false} highlight={merge > 0 ? "security" : null} dim={0.35 * merge} />
              </div>
            </div>
          </Appear>
          <Appear at={3.8 + i * 0.4} from="pop" style={{ left: x + 50, top: 470 }}>
            <div
              style={{
                translate: `${interpolate(merge, [0, 1], [0, 860 - x + 40])}px ${interpolate(merge, [0, 1], [0, 250])}px`,
                opacity: 1 - merge,
                scale: String(1 - merge * 0.4),
              }}
            >
              <Tile label="Own IdM" color={C.identity} icon="database" w={200} h={80} fontSize={26} />
            </div>
          </Appear>
          <Appear at={14.6 + i * 0.3} from="up" style={{ left: x + 40, top: 520 }}>
            <Pill color={C.identity} fontSize={24}>
              roles: admin, owner…
            </Pill>
          </Appear>
        </React.Fragment>
      ))}
      <Svg>
        {APPS.map((x, i) => (
          <Draw key={x} d={`M ${x + 150} 575 L ${860 + 150 + (i - 1) * 120} 720`} at={15.2 + i * 0.3} color={C.identity} width={3} arrow />
        ))}
        {APPS.map((x, i) => (
          <Draw key={`m${x}`} d={`M ${x + 150} 560 C ${x + 150} 700, 960 700, 960 820`} at={6.5 + i * 0.3} color={C.faint} width={3} dash opacity={1 - oda} />
        ))}
      </Svg>
      <Appear at={7.2} from="up" out={11} style={{ left: 760, top: 830 }}>
        <Pill color={C.danger} fontSize={30}>
          <Icon name="people" size={34} color={C.danger} /> Ops teams integrate each one
        </Pill>
      </Appear>
      <Appear at={15.0} from="pop" style={{ left: 610, top: 730 }}>
        <Tile
          label="Canvas identity service"
          sub="Keycloak · Microsoft Entra ID"
          color={C.identity}
          icon="shield"
          w={700}
          h={130}
          fontSize={38}
          glow={0.5}
        />
      </Appear>
      <Caption at={21} bottom={50} color={C.identity}>
        Identities managed once — consistently, across every application
      </Caption>
    </Stage>
  );
};

// Slide 12 — Secrets without bootstrap credentials
export const S12Secrets: React.FC = () => {
  const t = useT();
  const fly = interpolate(t, [11.0, 13.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const open = interpolate(t, [13.2, 14.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strike = useProg(16.5, 0.8);
  return (
    <Stage>
      <Heading kicker="Example" title="Secrets without bootstrap credentials" color={C.secrets} />
      <Appear at={0.8} from="up" style={{ left: 170, top: 200 }}>
        <OdaComponent size={460} highlight={t >= 3.0 ? "security" : null} dim={0.35} />
      </Appear>
      <Appear at={3.0} from="up" style={{ left: 200, top: 650 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 26,
            padding: "16px 22px",
            borderRadius: 12,
            background: "#0D1426",
            border: `2px solid ${C.panelEdge}`,
            lineHeight: 1.5,
          }}
        >
          <div style={{ color: C.muted }}>securityFunction:</div>
          <div style={{ paddingLeft: 30, color: C.secrets }}>secretsManagement: …</div>
        </div>
      </Appear>
      <Appear at={6.0} from="pop" style={{ left: 1260, top: 330 }}>
        <div
          style={{
            width: 440,
            height: 360,
            borderRadius: 30,
            background: C.panel,
            border: `4px solid ${C.secrets}`,
            boxShadow: `0 0 ${20 + 60 * open}px ${C.secrets}66`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <Icon name="lock" size={150} color={open > 0.5 ? C.ok : C.secrets} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 800 }}>Private vault</div>
          <Appear at={8.6} from="up" style={{ position: "relative" }}>
            <div style={{ fontSize: 28, color: C.muted }}>HashiCorp Vault</div>
          </Appear>
        </div>
      </Appear>
      <div
        style={{
          position: "absolute",
          left: interpolate(fly, [0, 1], [460, 1180]),
          top: interpolate(fly, [0, 1], [300, 260]) - Math.sin(fly * Math.PI) * 80,
          opacity: interpolate(t, [10.6, 11.0, 13.6, 14.2], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Pill color={C.operator} fontSize={28}>
          <Icon name="key" size={30} color={C.operator} /> Kubernetes workload identity (JWT)
        </Pill>
      </div>
      <Appear at={14.2} from="up" style={{ left: 1300, top: 720 }}>
        <Pill color={C.ok} fontSize={30}>
          <Icon name="check" size={32} color={C.ok} /> Access granted
        </Pill>
      </Appear>
      <Appear at={15.6} from="up" style={{ left: 700, top: 820 }}>
        <div style={{ position: "relative", fontFamily: MONO, fontSize: 40, color: C.muted, padding: "10px 20px" }}>
          bootstrapPassword: ••••••••
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              height: 6,
              width: `${strike * 100}%`,
              background: C.danger,
              borderRadius: 3,
            }}
          />
        </div>
      </Appear>
    </Stage>
  );
};
