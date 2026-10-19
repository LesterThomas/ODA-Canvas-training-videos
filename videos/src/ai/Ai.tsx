import React from "react";
import { interpolate } from "remotion";
import { C, MONO } from "../theme";
import { Appear, Caption, Draw, Gear, Heading, Icon, IconName, Pill, Stage, Svg, Tile, useProg, useT } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";
import { canvasModule, CanvasPicture, Glow, MODULES, OpGear } from "../lib/CanvasPicture";
import { CaptureClip, CaptureSegment } from "../lib/CaptureClip";

// Deck 04 — The AI-Native ODA Canvas (scripts/04-ai-native-oda-canvas.md).
// Timings are seconds from slide start ≈ words before the mention ÷ 2.5. Captures were recorded by
// demos/ai/record-demo.mjs; segment times are capture seconds from their marks.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const AI_STAGE = "#2A1534";

/** A YAML panel whose lines each appear at their own time (Code reveals lines strictly in order). */
type YLine = { text: string; indent?: number; color?: string; at: number; hi?: number };
const Yaml: React.FC<{ lines: YLine[]; title: string; width: number; fontSize?: number; hiColor?: string }> = ({
  lines,
  title,
  width,
  fontSize = 24,
  hiColor = C.ai,
}) => {
  const t = useT();
  const lh = fontSize * 1.5;
  return (
    <div style={{ width, background: "#0D1426", border: `2px solid ${C.panelEdge}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ padding: "12px 20px", borderBottom: `2px solid ${C.panelEdge}`, fontFamily: MONO, fontSize: 20, color: C.muted }}>{title}</div>
      <div style={{ padding: "12px 0" }}>
        {lines.map((l, i) => {
          const p = interpolate(t, [l.at, l.at + 0.35], [0, 1], clamp);
          const hi = l.hi !== undefined ? interpolate(t, [l.hi, l.hi + 0.4], [0, 1], clamp) : 0;
          return (
            <div
              key={i}
              style={{
                fontFamily: MONO,
                fontSize,
                height: lh,
                lineHeight: `${lh}px`,
                paddingLeft: 24 + (l.indent ?? 0) * fontSize * 1.2,
                color: l.color ?? C.text,
                opacity: p,
                whiteSpace: "pre",
                background: hi ? `${hiColor}${Math.round(hi * 0x30).toString(16).padStart(2, "0")}` : undefined,
                borderLeft: `6px solid ${hi ? hiColor : "transparent"}`,
              }}
            >
              {l.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Small round badge with a tick or a cross. */
const Mark: React.FC<{ ok: boolean; size?: number }> = ({ ok, size = 64 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: ok ? C.ok : C.danger, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.6, fontWeight: 800, color: C.bg }}>
    {ok ? "✓" : "✕"}
  </div>
);


// ---------------------------------------------------------------------------------------------
// Slide 4 — MCP is one more exposed API
const MCP_YAML: YLine[] = [
  { text: "coreFunction:", at: 0.6, color: C.muted },
  { text: "exposedAPIs:", indent: 1, at: 0.7, color: C.muted },
  { text: "- name: productcatalogmanagement", indent: 1, at: 0.9 },
  { text: "  apiType: openapi", indent: 1, at: 1.0, color: C.api },
  { text: "- name: productcatalogmcp", indent: 1, at: 8.0, hi: 8.2 },
  { text: "  apiType: mcp", indent: 1, at: 8.2, color: C.ai, hi: 8.2 },
  { text: "  path: …/mcp", indent: 1, at: 8.4, hi: 8.2 },
  { text: "managementFunction:", at: 2.8, color: C.muted },
  { text: "exposedAPIs:", indent: 1, at: 2.9, color: C.muted },
  { text: "- name: metrics", indent: 1, at: 3.0 },
  { text: "  apiType: prometheus   # OpenMetrics", indent: 1, at: 3.1, color: C.observability },
];
const API_PILLS = [
  { label: "Open API", color: C.api, at: 1.0 },
  { label: "OpenMetrics", color: C.observability, at: 3.1 },
  { label: "MCP", color: C.ai, at: 8.2 },
];

export const S04Mcp: React.FC = () => {
  const t = useT();
  const rest = interpolate(t, [15.6, 16.0, 17.4, 17.8], [0, 1, 1, 0], clamp);
  const pulse = 0.6 + 0.4 * Math.sin(t * 4);
  return (
    <Stage glow={AI_STAGE}>
      <Heading kicker="AI-native components" title="MCP is one more exposed API" color={C.ai} />
      <Appear at={0.3} from="pop" style={{ left: 120, top: 290 }}>
        <OdaComponent size={240} labels={false} />
      </Appear>
      {API_PILLS.map((p, i) => (
        <Appear key={p.label} at={p.at} from="left" style={{ left: 130, top: 560 + i * 74 }}>
          <Pill color={p.color} fontSize={26}>{p.label}</Pill>
        </Appear>
      ))}
      <Appear at={0.5} from="up" style={{ left: 450, top: 260 }}>
        <Yaml lines={MCP_YAML} title="component-productcatalog.yaml (test component)" width={780} fontSize={23} />
      </Appear>
      {/* Right: agent ↔ gateway ↔ component */}
      <Appear at={15.4} from="pop" style={{ left: 1500, top: 230 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <OdaComponent size={120} labels={false} agent crop />
          <div style={{ fontSize: 24, fontWeight: 700 }}>AI agent</div>
        </div>
      </Appear>
      <Appear at={15.4} from="up" style={{ left: 1380, top: 540 }}>
        <Tile label="API gateway" icon="gateway" color={C.api} w={360} h={110} fontSize={30} />
      </Appear>
      <Appear at={15.4} from="up" style={{ left: 1440, top: 830 }}>
        <Tile label="Component" color={C.component} iconNode={<OdaComponent size={52} crop />} w={260} h={90} fontSize={26} />
      </Appear>
      <Svg>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={1520 + i * 40} y1={440} x2={1520 + i * 40} y2={530} stroke={C.muted} strokeWidth={5} strokeDasharray="14 12" opacity={rest} />
        ))}
        <Draw d="M 1560 440 L 1560 530" at={17.6} color={C.ai} width={10 * pulse + 4} />
        <Draw d="M 1560 650 L 1560 820" at={17.9} color={C.ai} width={10 * pulse + 4} />
      </Svg>
      <Appear at={15.6} from="none" out={17.6} style={{ left: 1640, top: 450 }}>
        <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>REST · short calls</div>
      </Appear>
      <Appear at={17.8} from="left" style={{ left: 1590, top: 450 }}>
        <div style={{ fontSize: 22, color: C.ai, fontWeight: 800 }}>long-lived connection</div>
      </Appear>
      <Appear at={19.6} from="pop" style={{ left: 1262, top: 545 }}>
        <Gear size={100} color={C.operator} />
      </Appear>
      <Appear at={20.4} from="up" style={{ left: 450, top: 900 }}>
        <Pill color={C.operator} fontSize={26}>The API operator configures the gateway for MCP, automatically</Pill>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 5 — Descriptions are written for agents
const MCP_TOOL: YLine[] = [
  { text: "tool: list_product_offerings", at: 0.8, color: C.ai },
  { text: "description: Lists the product offerings", at: 1.2 },
  { text: "  in the catalogue. Use it to find offers", at: 1.4 },
  { text: "  by name, status or price.", at: 1.6 },
  { text: "arguments:", at: 10.4, color: C.muted },
  { text: "  filter: A TMF filter expression that", at: 10.6 },
  { text: "    narrows the results.", at: 10.8 },
  { text: "    Example:", at: 14.4, hi: 14.4, color: C.ok },
  { text: "    lifecycleStatus=Active&name=Gold*", at: 14.6, hi: 14.4, color: C.ok },
];

export const S05Descriptions: React.FC = () => (
  <Stage glow={AI_STAGE}>
    <Heading kicker="AI-native components" title="Descriptions are written for agents" color={C.ai} />
    <Appear at={6.4} from="up" style={{ left: 120, top: 280 }}>
      <div style={{ width: 720, padding: 30, borderRadius: 22, background: C.panel, border: `2px solid ${C.panelEdge}`, boxSizing: "border-box" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.muted, marginBottom: 16 }}>Swagger · written for API experts</div>
        <div style={{ fontFamily: MONO, fontSize: 26, lineHeight: 1.6 }}>
          <div>parameter: <span style={{ color: C.api }}>filter</span></div>
          <div>type: string</div>
          <div>description: "Filter expression"</div>
        </div>
      </div>
    </Appear>
    <Appear at={0.6} from="up" style={{ left: 940, top: 280 }}>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ai, marginBottom: 14 }}>MCP tool · written for agents</div>
        <Yaml lines={MCP_TOOL} title="mcp tool description" width={860} fontSize={24} hiColor={C.ok} />
      </div>
    </Appear>
    <Appear at={9.4} from="pop" style={{ left: 300, top: 600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <OdaComponent size={110} labels={false} agent crop />
        <div style={{ fontSize: 28, fontWeight: 700 }}>Agent needs more</div>
      </div>
    </Appear>
    <Appear at={12.0} from="pop" style={{ left: 700, top: 300 }}>
      <Mark ok={false} />
    </Appear>
    <Appear at={15.4} from="pop" style={{ left: 1720, top: 760 }}>
      <Mark ok />
    </Appear>
    <Appear at={15.6} from="up" style={{ left: 940, top: 860 }}>
      <div style={{ fontSize: 26, color: C.ok, fontWeight: 700 }}>An example made the agent use the filter correctly</div>
    </Appear>
    <Caption at={19.6} bottom={110} color={C.api}>
      TM Forum Open APIs v5 · JSON request and response examples, in the specification
    </Caption>
    <Caption at={28.8} bottom={50} color={C.ai}>
      → MCP servers generated automatically
    </Caption>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 7 — Dependent AI models: an experimental sub-resource first, the Component spec later
const SUBRES = [
  { kind: "ExposedAPI", color: C.api, at: 1.2, y: 300 },
  { kind: "DependentAPI", color: C.api, at: 3.2, y: 420 },
  { kind: "DependentAIModel", color: C.ai, at: 6.8, y: 560 },
];
const DAM_YAML: YLine[] = [
  { text: "kind: DependentAIModel", at: 7.0, color: C.ai },
  { text: "spec:", at: 7.3, color: C.muted },
  { text: "models:", indent: 1, at: 7.6, color: C.muted },
  { text: "- name: primary-chat-model", indent: 1, at: 8.4 },
  { text: "  priority: 1", indent: 1, at: 8.6, color: C.ai },
  { text: "- name: fallback-open-model", indent: 1, at: 9.4 },
  { text: "  priority: 2", indent: 1, at: 9.6, color: C.ai },
  { text: "useCase: Answers product questions", indent: 1, at: 12.0 },
  { text: "guardrails:", indent: 1, at: 13.6, color: C.muted },
  { text: "piiRedaction: true", indent: 2, at: 13.8 },
  { text: "maxToxicity: 0.2", indent: 2, at: 14.0 },
];
const APPROVED = [
  { name: "primary-chat-model", ok: true },
  { name: "fallback-open-model", ok: false },
];

export const S07DependentAIModels: React.FC = () => {
  const t = useT();
  return (
    <Stage glow={AI_STAGE}>
      <Heading kicker="Agentic components" title="Dependent AI models" color={C.ai} />
      <Appear at={0.3} from="up" style={{ left: 110, top: 420 }}>
        <Tile label="Component" sub="agentic" color={C.agent} iconNode={<OdaComponent size={70} agent crop />} w={300} h={130} fontSize={32} />
      </Appear>
      <Svg>
        {SUBRES.map((s) => (
          <Draw key={s.kind} d={`M 415 485 C 450 485, 450 ${s.y + 40}, 490 ${s.y + 40}`} at={s.at - 0.3} dur={0.5} color={s.color} width={3} arrow />
        ))}
        <Draw d="M 560 660 C 480 760, 300 720, 260 560" at={26.4} color={C.ai} width={3} dash arrow />
      </Svg>
      {SUBRES.map((s) => (
        <Appear key={s.kind} at={s.at} from="left" style={{ left: 500, top: s.y }}>
          <div style={{ fontFamily: MONO, fontSize: 25, width: 400, padding: "16px 20px", borderRadius: 14, background: `${s.color}1F`, border: `2px solid ${s.color}`, boxSizing: "border-box" }}>
            kind: {s.kind}
          </div>
        </Appear>
      ))}
      <Appear at={21.2} from="pop" style={{ left: 640, top: 640 }}>
        <Pill color={C.ai} fontSize={22}>experimental</Pill>
      </Appear>
      <Appear at={26.4} from="up" style={{ left: 150, top: 760 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.ai, width: 420 }}>later: part of the Component specification</div>
      </Appear>
      <Appear at={6.8} from="up" style={{ left: 980, top: 250 }}>
        <Yaml lines={DAM_YAML} title="dependentaimodel.yaml (illustrative)" width={820} fontSize={23} />
      </Appear>
      <Appear at={16.4} from="up" style={{ left: 980, top: 760 }}>
        <div style={{ width: 820, padding: "18px 24px", borderRadius: 18, background: C.panel, border: `2px solid ${C.ok}`, boxSizing: "border-box" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.ok, marginBottom: 10 }}>Approved models on this Canvas</div>
          {APPROVED.map((a, i) => {
            const p = interpolate(t, [17.2 + i * 0.8, 17.6 + i * 0.8], [0, 1], clamp);
            return (
              <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 24, height: 40, opacity: 0.4 + 0.6 * p }}>
                <span style={{ color: a.ok ? C.ok : C.danger, fontWeight: 800, width: 28 }}>{p > 0.5 ? (a.ok ? "✓" : "✕") : ""}</span>
                {a.name}
                <span style={{ fontFamily: "inherit", color: C.muted, fontSize: 20 }}>{p > 0.5 ? (a.ok ? "granted" : "not on the approved list") : ""}</span>
              </div>
            );
          })}
        </div>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 8 — Training builds intelligence, inference builds cost (GB1085 problem statement)
const AGENTS_Y = [330, 440, 550, 660, 770];
const PROVIDERS: { label: string; icon: IconName; y: number }[] = [
  { label: "External model API", icon: "cloud", y: 330 },
  { label: "Hyperscaler AI service", icon: "cloud", y: 470 },
  { label: "Self-hosted open model", icon: "server", y: 610 },
  { label: "Internal model", icon: "database", y: 750 },
];
const WIRES = [[0, 0], [0, 1], [1, 1], [1, 2], [2, 0], [2, 3], [3, 1], [3, 2], [4, 3], [4, 0]];
const PROBLEMS = [
  { label: "Lock-in", at: 11.6, x: 760, y: 360 },
  { label: "Hidden cost", at: 12.6, x: 980, y: 520 },
  { label: "Duplicate plumbing", at: 15.2, x: 760, y: 700 },
];

export const S08Inference: React.FC = () => {
  const t = useT();
  const fix = interpolate(t, [17.6, 18.6], [0, 1], clamp);
  return (
    <Stage glow={AI_STAGE}>
      <Heading kicker="Model as a Service" title="Inference builds cost" color={C.ai} />
      {AGENTS_Y.map((y, i) => (
        <Appear key={i} at={7.6 + i * 0.15} from="left" style={{ left: 180, top: y - 45 }}>
          <OdaComponent size={90} labels={false} agent crop />
        </Appear>
      ))}
      {PROVIDERS.map((p, i) => (
        <Appear key={p.label} at={7.8 + i * 0.2} from="right" style={{ left: 1380, top: p.y - 50 }}>
          <Tile label={p.label} icon={p.icon} color={C.muted} w={420} h={100} fontSize={26} />
        </Appear>
      ))}
      <Svg>
        <g opacity={1 - fix}>
          {WIRES.map(([a, b], i) => (
            <Draw key={i} d={`M 290 ${AGENTS_Y[a]} C 800 ${AGENTS_Y[a] + (i % 2 ? 160 : -140)}, 900 ${PROVIDERS[b].y + (i % 3 ? -120 : 140)}, 1370 ${PROVIDERS[b].y}`} at={8.4 + i * 0.25} dur={0.6} color={C.danger} width={3} opacity={0.7} />
          ))}
        </g>
        {AGENTS_Y.map((y, i) => (
          <Draw key={`a${i}`} d={`M 290 ${y} C 560 ${y}, 600 550, 840 550`} at={18.4 + i * 0.1} dur={0.6} color={C.ai} width={4} />
        ))}
        {PROVIDERS.map((p, i) => (
          <Draw key={`p${i}`} d={`M 1080 550 C 1260 550, 1220 ${p.y}, 1370 ${p.y}`} at={19.0 + i * 0.1} dur={0.6} color={C.ai} width={4} arrow />
        ))}
      </Svg>
      {PROBLEMS.map((p) => (
        <Appear key={p.label} at={p.at} from="pop" out={17.6} style={{ left: p.x, top: p.y }}>
          <Pill color={C.danger} fontSize={26}>{p.label}</Pill>
        </Appear>
      ))}
      <Appear at={17.8} from="pop" style={{ left: 840, top: 420 }}>
        <div style={{ width: 240, height: 260, borderRadius: 24, background: `${C.ai}30`, border: `4px solid ${C.ai}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: `0 0 50px ${C.ai}66` }}>
          <Icon name="gateway" size={70} color={C.ai} />
          <div style={{ fontSize: 28, fontWeight: 800, textAlign: "center", lineHeight: 1.15 }}>Model as<br />a Service</div>
        </div>
      </Appear>
      <Appear at={22.4} from="up" style={{ left: 140, top: 230 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.ai, width: 200, textAlign: "center" }}>Demand</div>
      </Appear>
      <Appear at={22.8} from="up" style={{ left: 1380, top: 230 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: C.ai, width: 420, textAlign: "center" }}>Supply</div>
      </Appear>
      <Caption at={4.8} bottom={70} color={C.text}>
        “Training builds intelligence. Inference builds cost.”<span style={{ fontSize: 24, color: C.muted }}>  · TM Forum GB1085</span>
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 11 — The model gateway in the Canvas
const C11 = { left: 460, top: 690, w: 1000 };
const M11 = canvasModule(C11);
const BADGES = [
  { label: "Guardrails", icon: "shield" as IconName, at: 20.4 },
  { label: "Audit", icon: "doc" as IconName, at: 21.4 },
  { label: "Observability", icon: "trace" as IconName, at: 22.2 },
  { label: "Token cost", icon: "coin" as IconName, at: 23.0 },
];
const STEP = (n: number, at: number, left: number, top: number) => (
  <Appear key={n} at={at} from="pop" style={{ left, top }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: C.ai, color: C.bg, fontSize: 30, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
  </Appear>
);

export const S11Gateway: React.FC = () => {
  const t = useT();
  const fly = interpolate(t, [12.6, 14.0], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <Stage glow={AI_STAGE}>
      <Heading kicker="Model as a Service" title="The model gateway in the Canvas" color={C.ai} />
      <Appear at={0.4} from="up" style={{ left: 120, top: 300 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 260 }}>
          <OdaComponent size={170} labels={false} agent crop />
          <div style={{ fontSize: 26, fontWeight: 800 }}>Agentic component</div>
          <div style={{ fontFamily: MONO, fontSize: 19, color: C.ai }}>DependentAIModel</div>
        </div>
      </Appear>
      <Appear at={0.8} from="pop" style={{ left: 640, top: 250 }}>
        <OpGear label="Model-as-a-Service operator" color={C.ai} size={130} width={340} />
      </Appear>
      <Appear at={5.6} from="pop" style={{ left: 690, top: 452 }}>
        <Pill color={C.ai} fontSize={22}>experimental · TMFOP009</Pill>
      </Appear>
      <Appear at={10.2} from="up" style={{ left: 1150, top: 320 }}>
        <Tile label="Model gateway" icon="gateway" color={C.ai} w={360} h={120} fontSize={32} glow={interpolate(t, [10.4, 11, 12, 13], [0, 1, 1, 0.3], clamp)} />
      </Appear>
      {["primary-chat-model", "fallback-open-model"].map((m, i) => (
        <Appear key={m} at={10.8 + i * 0.3} from="left" style={{ left: 1580, top: 300 + i * 90 }}>
          <Pill color={C.muted} fontSize={21}>{m}</Pill>
        </Appear>
      ))}
      <Svg>
        <Draw d="M 380 360 C 500 360, 560 320, 660 320" at={6.8} color={C.ai} width={3} dash arrow />
        <Draw d="M 980 320 L 1140 370" at={10.4} color={C.ai} width={4} arrow />
        <Draw d="M 380 470 C 700 600, 1000 560, 1200 450" at={16.4} color={C.ai} width={7} arrow />
        <Draw d="M 1510 380 L 1570 330" at={17.4} color={C.ai} width={5} arrow />
      </Svg>
      {STEP(1, 6.8, 470, 280)}
      {STEP(2, 10.4, 1040, 280)}
      {STEP(3, 12.4, 1100, 455)}
      {STEP(4, 16.4, 720, 560)}
      <Appear at={6.8} from="none" style={{ left: 420, top: 230 }}>
        <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>reads</div>
      </Appear>
      <Appear at={10.4} from="none" style={{ left: 1000, top: 380 }}>
        <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>configures</div>
      </Appear>
      {[
        { label: "credential", icon: "key" as IconName, dy: 0 },
        { label: "endpoint", icon: "link" as IconName, dy: 64 },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            position: "absolute",
            left: interpolate(fly, [0, 1], [1200, 360]),
            top: interpolate(fly, [0, 1], [470, 560]) + c.dy,
            opacity: interpolate(t, [12.4, 12.7], [0, 1], clamp),
          }}
        >
          <Pill color={C.secrets} fontSize={22}>
            <Icon name={c.icon} size={26} color={C.secrets} /> {c.label}
          </Pill>
        </div>
      ))}
      {BADGES.map((b, i) => (
        <Appear key={b.label} at={b.at} from="pop" style={{ left: 1190 + (i % 2) * 210, top: 470 + Math.floor(i / 2) * 64 }}>
          <Pill color={C.ai} fontSize={21}>
            <Icon name={b.icon} size={24} color={C.ai} /> {b.label}
          </Pill>
        </Appear>
      ))}
      <CanvasPicture {...C11} at={0.6} />
      <Glow box={M11(...MODULES.model)} color={C.ai} at={10.6} label="Model gateway" labelY={C11.top + 385} />
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 12 — SIMULATED: the Canvas Portal Model Gateway page (ai-gateway capture; marks list 6.2,
// models 13.3, strategy 15.8, endpoint 18.5, test 20.9, token 30.4, listed 33.7, reply 44.8).
const GATEWAY: CaptureSegment[] = [
  { from: 6.9, to: 8.4, rate: 0.31, url: "localhost:8090/model-gateway-services", label: "Canvas Portal · AI › Model Gateway" },
  { from: 8.4, to: 18.9, rate: 1.3, label: "High, medium and fast reasoning · multimodal · primary and open providers" },
  { from: 18.9, to: 24.6, rate: 1, label: "Each model has its own gateway endpoint" },
  { from: 24.6, to: 37.9, rate: 4.4, label: "Test connection · request a token, list the models" },
  { from: 37.9, to: 48.9, rate: 2.4, label: "Send a prompt through the gateway" },
  { from: 48.9, to: 52.9, rate: 1, label: "The reply, through the model gateway" },
];
export const S12GatewayDemo: React.FC = () => (
  <Stage glow={AI_STAGE}>
    <CaptureClip src="captures/ai-gateway.webm" segments={GATEWAY} width={1720} top={36} labelColor={C.ai} />
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 15 — The Canvas with AI and data
const C15 = { left: 460, top: 620, w: 1000 };
const M15 = canvasModule(C15);
const ROW = [false, true, false, true, false, true, false]; // agent?

export const S15WithAI: React.FC = () => (
  <Stage glow={AI_STAGE}>
    <Heading kicker="Running AI at scale" title="The Canvas with AI and data" color={C.ai} />
    <CanvasPicture {...C15} at={0.4} />
    {ROW.map((agent, i) => (
      <Appear key={i} at={agent ? 2.4 + i * 0.2 : 0.6 + i * 0.1} from="pop" style={{ left: 150 + i * 240, top: 270 }}>
        <div style={{ width: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <OdaComponent size={130} labels={false} agent={agent} crop />
        </div>
      </Appear>
    ))}
    {ROW.map((agent, i) =>
      agent ? (
        <Appear key={`c${i}`} at={10.0 + i * 0.2} from="up" style={{ left: 150 + i * 240, top: 440, width: 170, display: "flex", justifyContent: "center" }}>
          <Pill color={C.agent} fontSize={20}>agent card</Pill>
        </Appear>
      ) : (
        <Appear key={`m${i}`} at={5.2 + i * 0.15} from="up" style={{ left: 150 + i * 240, top: 440, width: 170, display: "flex", justifyContent: "center" }}>
          <Pill color={C.ai} fontSize={20}>MCP</Pill>
        </Appear>
      ),
    )}
    <Appear at={2.6} from="up" style={{ left: 120, top: 520 }}>
      <div style={{ display: "flex", gap: 30, fontSize: 22, fontWeight: 700, color: C.muted }}>
        <span><span style={{ color: C.component }}>■</span> standard components · systems of record</span>
        <span><span style={{ color: C.agent }}>■</span> agentic components</span>
      </div>
    </Appear>
    <Appear at={10.4} from="up" style={{ left: 1260, top: 515 }}>
      <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>agent-to-agent (A2A) discovery</div>
    </Appear>
    <Glow box={M15(...MODULES.model)} color={C.ai} at={28.0} label="Model" labelY={C15.top + 380} />
    <Glow box={M15(...MODULES.data)} color={C.ai} at={29.0} label="Data products" labelY={C15.top + 380} />
    <Appear at={29.6} from="pop" style={{ left: 1480, top: 930 }}>
      <Pill color={C.ai} fontSize={24}>both experimental</Pill>
    </Appear>
    <Appear at={19.2} from="up" style={{ left: 120, top: 930 }}>
      <div style={{ width: 330, fontSize: 24, color: C.agent, fontWeight: 700, lineHeight: 1.3 }}>
        White on purpose: agents can differentiate, but follow the component model
      </div>
    </Appear>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 16 — The Canvas describes itself (TMF639 resource inventory, with MCP and Helm tools)
const INV = [
  { label: "Components", icon: "cube" as IconName, color: C.component, y: 300 },
  { label: "APIs", icon: "link" as IconName, color: C.api, y: 450 },
  { label: "Agents", icon: "spark" as IconName, color: C.agent, y: 600 },
];
const ASKS = [
  { q: "What is deployed on this Canvas?", at: 22.4 },
  { q: "Draw the product catalog and its APIs", at: 24.8 },
  { q: "Install a product inventory component", at: 28.4, helm: true },
];

export const S16Registry: React.FC = () => (
  <Stage glow={AI_STAGE}>
    <Heading kicker="Running AI at scale" title="The Canvas describes itself" color={C.ai} />
    {INV.map((it, i) => (
      <Appear key={it.label} at={0.8 + i * 0.6} from="left" style={{ left: 120, top: it.y }}>
        <Tile label={it.label} icon={it.icon} color={it.color} w={330} h={110} fontSize={30} />
      </Appear>
    ))}
    <Svg>
      {INV.map((it, i) => (
        <Draw key={it.label} d={`M 460 ${it.y + 55} C 540 ${it.y + 55}, 540 470, 620 470`} at={11.2 + i * 0.3} dur={0.6} color={it.color} width={3} arrow />
      ))}
      <Draw d="M 1160 470 L 1430 470" at={14.8} color={C.ai} width={6} arrow />
    </Svg>
    <Appear at={4.8} from="up" style={{ left: 630, top: 340 }}>
      <div style={{ width: 520, height: 260, borderRadius: 24, background: C.panel, border: `3px solid ${C.canvas}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Icon name="database" size={70} color={C.canvas} />
        <div style={{ fontSize: 36, fontWeight: 800 }}>Resource inventory</div>
        <div style={{ fontSize: 26, color: C.muted }}>TMF639 Open API</div>
      </div>
    </Appear>
    <Appear at={14.0} from="pop" style={{ left: 1000, top: 560 }}>
      <Pill color={C.ai} fontSize={24}>MCP server</Pill>
    </Appear>
    <Appear at={4.8} from="pop" style={{ left: 640, top: 560 }}>
      <Pill color={C.api} fontSize={24}>Open API</Pill>
    </Appear>
    <Appear at={15.0} from="pop" style={{ left: 1450, top: 380 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <OdaComponent size={140} labels={false} agent crop />
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>Operations<br />agent</div>
      </div>
    </Appear>
    <Appear at={19.6} from="pop" style={{ left: 1450, top: 560 }}>
      <Pill color={C.identity} fontSize={22}>
        <Icon name="key" size={24} color={C.identity} /> if requested · with permission
      </Pill>
    </Appear>
    {ASKS.map((a, i) => (
      <Appear key={a.q} at={a.at} from="up" style={{ left: 960, top: 650 + i * 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ padding: "14px 24px", borderRadius: "22px 22px 22px 4px", background: `${C.ai}22`, border: `2px solid ${C.ai}`, fontSize: 26, fontWeight: 600, whiteSpace: "nowrap" }}>“{a.q}”</div>
          {a.helm ? <Pill color={C.danger} fontSize={20}>Helm · needs approval</Pill> : null}
        </div>
      </Appear>
    ))}
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 17 — Evaluation
const Q_STREAM = ["How do I…?", "What is TMF620?", "Which API…?", "Explain ODA…", "Where is…?", "Compare…"];

export const S17Evaluation: React.FC = () => {
  const t = useT();
  const trend = useProg(16.8, 2.4);
  return (
    <Stage glow={AI_STAGE}>
      <Heading kicker="Running AI at scale" title="Evaluation" color={C.ai} />
      <Svg>
        <Draw d="M 120 860 L 1800 860" at={0.6} color={C.muted} width={4} arrow />
        <Draw d="M 760 300 L 760 900" at={11.6} color={C.panelEdge} width={3} dash />
      </Svg>
      <Appear at={4.4} from="up" style={{ left: 140, top: 880 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.muted }}>Before deployment</div>
      </Appear>
      <Appear at={12.0} from="up" style={{ left: 790, top: 880 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.muted }}>In production</div>
      </Appear>
      <Appear at={4.4} from="up" style={{ left: 140, top: 300 }}>
        <Tile label="Golden set of questions" icon="doc" color={C.ai} w={560} h={120} fontSize={30} />
      </Appear>
      <Appear at={8.4} from="pop" style={{ left: 200, top: 460 }}>
        <div style={{ fontSize: 120, fontWeight: 800, color: C.ai, lineHeight: 1 }}>87</div>
      </Appear>
      <Appear at={8.6} from="up" style={{ left: 360, top: 480 }}>
        <div style={{ fontSize: 26, color: C.muted, width: 330, lineHeight: 1.3 }}>questions for the TM Forum AI assistant</div>
      </Appear>
      <Appear at={6.0} from="pop" style={{ left: 200, top: 680 }}>
        <Pill color={C.ok} fontSize={28}>Baseline score</Pill>
      </Appear>
      {Q_STREAM.map((q, i) => {
        const x = interpolate(t, [12.0 + i * 0.5, 15.5 + i * 0.5], [800, i < 3 ? 1220 : 980], clamp);
        const o = interpolate(t, [12.0 + i * 0.5, 12.4 + i * 0.5], [0, 1], clamp);
        return (
          <div key={q} style={{ position: "absolute", left: x, top: 290 + (i % 3) * 56, opacity: o * 0.9 }}>
            <Pill color={C.muted} fontSize={20}>{q}</Pill>
          </div>
        );
      })}
      <Appear at={16.0} from="up" style={{ left: 800, top: 500 }}>
        <Tile label="Human evaluator" icon="person" color={C.ai} w={420} h={100} fontSize={28} />
      </Appear>
      <Appear at={16.4} from="up" style={{ left: 800, top: 620 }}>
        <Tile label="AI evaluator" icon="spark" color={C.ai} w={420} h={100} fontSize={28} />
      </Appear>
      <Appear at={17.0} from="up" style={{ left: 800, top: 745 }}>
        <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>relevance · accuracy · completeness</div>
      </Appear>
      <Appear at={16.8} from="up" style={{ left: 1300, top: 500 }}>
        <div style={{ width: 480, height: 240, borderRadius: 18, background: C.panel, border: `2px solid ${C.panelEdge}`, position: "relative" }}>
          <div style={{ position: "absolute", left: 20, top: 12, fontSize: 20, color: C.muted, fontWeight: 700 }}>Score over time</div>
          <svg width={480} height={240} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={30} y1={150} x2={460} y2={150} stroke={C.ok} strokeWidth={2} strokeDasharray="8 8" />
            <polyline points="30,190 100,170 170,175 240,150 310,135 380,120 450,95" fill="none" stroke={C.ai} strokeWidth={5} pathLength={1} strokeDasharray={`${trend} 1`} />
          </svg>
        </div>
      </Appear>
      <Appear at={20.4} from="pop" style={{ left: 1300, top: 770 }}>
        <Pill color={C.ok} fontSize={24}>New model · checked against the baseline ✓</Pill>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 18 — AI is an amplifier (DORA 2025)
// The monolith: business modules in one deployable, calling each other directly and sharing one database.
const MONO_BOX = { left: 1060, top: 290, w: 760, h: 470 };
const MONO_MODS = ["Billing", "Orders", "Catalog", "Customer", "Inventory", "Provisioning", "Payments", "Reports", "Network"].map((name, i) => ({
  name,
  x: MONO_BOX.left + 40 + (i % 3) * 240,
  y: MONO_BOX.top + 60 + Math.floor(i / 3) * 95,
}));
const MONO_NEW = [
  { name: "+ feature", x: MONO_BOX.left + 160, y: MONO_BOX.top + 107 },
  { name: "+ feature", x: MONO_BOX.left + 400, y: MONO_BOX.top + 202 },
  { name: "+ feature", x: MONO_BOX.left + 160, y: MONO_BOX.top + 297 },
  { name: "+ feature", x: MONO_BOX.left + 520, y: MONO_BOX.top + 12 },
];
const MOD_W = 200;
const MOD_H = 56;
const centre = (m: { x: number; y: number }) => [m.x + MOD_W / 2, m.y + MOD_H / 2];
const curve = (a: number[], b: number[], bend: number) => {
  const mx = (a[0] + b[0]) / 2 + bend;
  const my = (a[1] + b[1]) / 2 - bend * 0.6;
  return `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
};
// Direct calls between modules (every module reaches into several others).
const CALLS = [[0, 1], [0, 3], [0, 6], [1, 2], [1, 4], [1, 6], [2, 4], [2, 7], [3, 5], [3, 7], [4, 5], [4, 8], [5, 8], [6, 7], [7, 8], [0, 8], [2, 3], [5, 6]];
const MORE_CALLS = [[0, 4], [1, 8], [2, 6], [3, 8], [6, 4], [7, 0], [5, 1], [8, 2], [3, 1], [4, 7]];
const DB = { x: MONO_BOX.left + MONO_BOX.w / 2, y: MONO_BOX.top + 400 };
const GRID = Array.from({ length: 12 }, (_, i) => ({ x: 170 + (i % 4) * 190, y: 330 + Math.floor(i / 4) * 150, late: i >= 6 }));

export const S18Amplifier: React.FC = () => {
  const t = useT();
  const sweep = interpolate(t, [10.8, 13.0], [-200, 2100], clamp);
  const strain = interpolate(t, [14.0, 15.5], [0, 1], clamp);
  return (
    <Stage>
      <Heading kicker="AI building the Canvas" title="AI is an amplifier" color={C.operator} />
      <Svg>
        {GRID.filter((g) => !g.late).map((g, i) =>
          i % 4 !== 3 && i < 5 ? <Draw key={i} d={`M ${g.x + 120} ${g.y + 40} L ${g.x + 170} ${g.y + 40}`} at={1.0} color={C.api} width={3} /> : null,
        )}
      </Svg>
      {GRID.map((g, i) => (
        <Appear key={i} at={g.late ? 11.2 + (i - 6) * 0.35 : 0.6 + i * 0.1} from="pop" style={{ left: g.x, top: g.y }}>
          <OdaComponent size={100} labels={false} crop />
        </Appear>
      ))}
      {/* Right: one tightly coupled monolith */}
      <Appear at={0.6} from="up" style={{ left: MONO_BOX.left, top: MONO_BOX.top }}>
        <div
          style={{
            width: MONO_BOX.w,
            height: MONO_BOX.h,
            borderRadius: 18,
            border: `4px solid ${strain > 0 ? C.danger : C.muted}`,
            background: `${C.danger}${Math.round(8 + strain * 20).toString(16).padStart(2, "0")}`,
            boxShadow: strain > 0 ? `0 0 ${50 * strain}px ${C.danger}88` : "none",
            boxSizing: "border-box",
          }}
        >
          <div style={{ padding: "10px 18px", fontSize: 24, fontWeight: 800, color: C.muted }}>Monolith · one deployable</div>
        </div>
      </Appear>
      <Svg>
        {MONO_MODS.map((m, i) => (
          <Draw key={`db${i}`} d={`M ${centre(m)[0]} ${centre(m)[1]} L ${DB.x} ${DB.y}`} at={1.6 + i * 0.05} dur={0.5} color={C.muted} width={2} opacity={0.5} />
        ))}
        {CALLS.map(([a, b], i) => (
          <Draw key={`c${i}`} d={curve(centre(MONO_MODS[a]), centre(MONO_MODS[b]), (i % 2 ? 1 : -1) * (30 + (i % 4) * 15))} at={2.0 + i * 0.08} dur={0.5} color={C.danger} width={2.5} opacity={0.8} />
        ))}
        {MORE_CALLS.map(([a, b], i) => (
          <Draw key={`m${i}`} d={curve(centre(MONO_MODS[a]), centre(MONO_MODS[b]), (i % 2 ? -1 : 1) * (45 + (i % 3) * 20))} at={14.0 + i * 0.12} dur={0.5} color="#FF2D55" width={3} />
        ))}
      </Svg>
      {MONO_MODS.map((m, i) => (
        <Appear key={m.name} at={1.0 + i * 0.08} from="pop" style={{ left: m.x, top: m.y }}>
          <div style={{ width: MOD_W, height: MOD_H, borderRadius: 8, background: C.panel, border: `2px solid ${C.muted}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, boxSizing: "border-box" }}>{m.name}</div>
        </Appear>
      ))}
      {MONO_NEW.map((m, i) => (
        <Appear key={i} at={14.2 + i * 0.3} from="pop" style={{ left: m.x, top: m.y }}>
          <div style={{ width: 120, height: 40, borderRadius: 8, background: `${C.danger}33`, border: `2px dashed ${C.danger}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, boxSizing: "border-box" }}>{m.name}</div>
        </Appear>
      ))}
      <Appear at={1.6} from="up" style={{ left: DB.x - 130, top: DB.y - 20 }}>
        <div style={{ width: 260, height: 64, borderRadius: 14, background: C.panel, border: `2px solid ${C.muted}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 22, fontWeight: 700 }}>
          <Icon name="database" size={30} color={C.muted} /> Shared database
        </div>
      </Appear>
      <div style={{ position: "absolute", left: sweep, top: 240, width: 260, height: 640, background: `radial-gradient(ellipse at center, ${C.ai}55 0%, transparent 70%)` }} />
      <Appear at={5.2} from="pop" style={{ left: 120, top: 230 }}>
        <Pill color={C.ai} fontSize={26}>DORA 2025 · State of AI-assisted Software Development</Pill>
      </Appear>
      <Appear at={10.8} from="up" style={{ left: 170, top: 800 }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.ok }}>Amplifies strengths</div>
      </Appear>
      <Appear at={14.0} from="up" style={{ left: 1060, top: 800 }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.danger }}>Amplifies dysfunction</div>
      </Appear>
      <Appear at={17.2} from="up" style={{ left: 170, top: 860 }}>
        <div style={{ fontSize: 26, color: C.muted, fontWeight: 700 }}>Modular · loosely coupled · API-first</div>
      </Appear>
      <Appear at={21.6} from="up" style={{ left: 1060, top: 860 }}>
        <div style={{ fontSize: 26, color: C.muted, fontWeight: 700 }}>Tightly coupled monolith · direct calls · one shared database</div>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 20 — Live: AGENTS.md in the oda-canvas repository (ai-github capture; marks agents-root 5.5,
// agents-open 9.9, agents-arch 16.3, agents-do 23.3, operators-agents 25.6, operators-pattern 32.8).
const GH = "github.com/tmforum-oda/oda-canvas";
const AGENTS_MD: CaptureSegment[] = [
  { from: 1.0, to: 5.5, rate: 1, url: GH, label: "The oda-canvas repository on GitHub" },
  { from: 5.5, to: 9.9, rate: 0.8, url: `${GH}/blob/main/AGENTS.md`, label: "AGENTS.md at the root, and in 6 main folders" },
  { from: 9.9, to: 16.3, rate: 1.15, label: "An open format that coding agents read" },
  { from: 16.3, to: 23.3, rate: 1.1, label: "What the project is · how it's structured · do's and don'ts" },
  { from: 25.0, to: 32.6, rate: 1.4, url: `${GH}/blob/main/source/operators/AGENTS.md`, label: "source/operators/AGENTS.md · the operator pattern and conventions" },
];
export const S20AgentsMd: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/ai-github.webm" segments={AGENTS_MD} width={1720} top={36} labelColor={C.operator} />
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 21 — Agent skills: knowledge as a reusable asset
const SKILL_MD: YLine[] = [
  { text: "---", at: 2.6, color: C.muted },
  { text: "name: create-oda-operator", at: 2.8, hi: 10.0 },
  { text: "description: Guide for creating Kubernetes", at: 3.0, hi: 10.0 },
  { text: "  operators for the ODA Canvas … Use this", at: 3.2, hi: 10.0 },
  { text: "  skill whenever you are building or", at: 3.4, hi: 10.0 },
  { text: "  modifying any Canvas operator …", at: 3.6, hi: 10.0 },
  { text: "---", at: 3.8, color: C.muted },
  { text: "# Create ODA Operator", at: 4.2, color: C.operator },
  { text: "## Technology", at: 4.5, color: C.operator },
  { text: "kopf==1.37.2  kubernetes==27.2.0", at: 4.8, color: C.muted },
];
const TREE = [
  { text: "skills/create-oda-operator/", indent: 0, color: C.operator, icon: "layers" as IconName },
  { text: "SKILL.md", indent: 1, color: C.text, icon: "doc" as IconName },
  { text: "references/", indent: 1, color: C.text, icon: "layers" as IconName },
  { text: "kopf-docs.md", indent: 2, color: C.muted, icon: "doc" as IconName },
  { text: "operator-catalog.md", indent: 2, color: C.muted, icon: "doc" as IconName },
];
const TOOLS = [
  { label: "Claude Code", at: 16.0 },
  { label: "GitHub Copilot", at: 16.6 },
  { label: "Codex", at: 17.4 },
  { label: "Google Antigravity", at: 20.4 },
  { label: "Cursor", at: 21.4 },
  { label: "or another agent", at: 21.8 },
];

export const S21Skills: React.FC = () => (
  <Stage>
    <Heading kicker="AI building the Canvas" title="Agent skills: knowledge as a reusable asset" color={C.operator} />
    <Appear at={2.4} from="up" style={{ left: 120, top: 270 }}>
      <div style={{ width: 600, padding: "24px 28px", borderRadius: 20, background: C.panel, border: `2px solid ${C.operator}`, boxSizing: "border-box" }}>
        {TREE.map((n) => (
          <div key={n.text} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 24, height: 48, paddingLeft: n.indent * 34, color: n.color }}>
            <Icon name={n.icon} size={28} color={n.color} /> {n.text}
          </div>
        ))}
      </div>
    </Appear>
    <Appear at={10.0} from="up" style={{ left: 120, top: 560 }}>
      <div style={{ width: 600, fontSize: 26, color: C.operator, fontWeight: 700, lineHeight: 1.3 }}>The description tells the agent when to load the skill</div>
    </Appear>
    <Appear at={2.4} from="up" style={{ left: 800, top: 260 }}>
      <Yaml lines={SKILL_MD} title="SKILL.md" width={1000} fontSize={23} hiColor={C.operator} />
    </Appear>
    <Appear at={13.6} from="pop" style={{ left: 120, top: 680 }}>
      <Pill color={C.operator} fontSize={28}>Agent Skills · an open standard</Pill>
    </Appear>
    {TOOLS.map((tl, i) => (
      <Appear key={tl.label} at={tl.at} from="up" style={{ left: 120 + [0, 230, 500, 660, 990, 1150][i], top: 790 }}>
        <Pill color={i === 5 ? C.muted : C.operator} fontSize={26}>{tl.label}</Pill>
      </Appear>
    ))}
    <Caption at={24.4} bottom={70} color={C.operator}>
      Written once · used by every contributor's agent
    </Caption>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 22 — Live: the create-oda-operator skill (ai-github capture; marks skills 34.8, skill-open 45.8,
// skill-tech 52.8, skill-table 60.5).
const SKILL_SEG: CaptureSegment[] = [
  { from: 33.6, to: 40.0, rate: 0.7, url: `${GH}/tree/main/skills`, label: "skills/ · seven agent skills in the repository" },
  { from: 40.0, to: 45.8, rate: 0.9, url: `${GH}/blob/main/skills/create-oda-operator/SKILL.md`, label: "create-oda-operator · build a new Canvas operator with AI" },
  { from: 45.8, to: 52.8, rate: 1, label: "The framework, and the pinned versions" },
  { from: 52.8, to: 60.5, rate: 1.6, label: "A map of existing operators to copy from" },
  { from: 60.5, to: 61.0, rate: 1 },
];
export const S22SkillDemo: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/ai-github.webm" segments={SKILL_SEG} width={1720} top={36} labelColor={C.operator} />
  </Stage>
);
