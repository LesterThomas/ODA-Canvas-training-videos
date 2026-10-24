import React from "react";
import { interpolate, Sequence, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Appear, BrowserFrame, Caption, Draw, Gear, Heading, Icon, Pill, Stage, Svg, Tile, useProg, useT } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";
import { OpGear } from "../lib/CanvasPicture";
import { CaptureClip, CaptureSegment } from "../lib/CaptureClip";
import { CliSession, Terminal } from "../lib/Terminal";
import stackCli from "../../public/captures/obs-cli-stack.cli.json";
import wiringCli from "../../public/captures/obs-cli-wiring.cli.json";

// Deck 05 — Observability in the ODA Canvas (scripts/05-observability.md).
// Timings are seconds from slide start ≈ words before the mention ÷ 2.5. Live segments were recorded on
// the demo cluster by demos/observability/record-demo.mjs; segment times are capture seconds from its
// marks. Prometheus, Grafana and Jaeger were recorded at 1280×720, so zoom points are capture pixels × 1.5.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (s: unknown) => s as CliSession;
const pick = (session: CliSession, ...i: number[]): CliSession => ({ ...session, steps: i.map((n) => session.steps[n]) });

const Phase: React.FC<{ from?: number; until?: number; children: React.ReactNode }> = ({ from = 0, until, children }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  const p = useProg(from, 0.5);
  const fadeIn = from > 0 ? p : 1;
  const out = until !== undefined ? interpolate(t, [until - 0.4, until], [1, 0], clamp) : 1;
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={until !== undefined ? Math.round((until - from + 0.2) * fps) : undefined} premountFor={fps}>
      <div style={{ position: "absolute", inset: 0, opacity: fadeIn * out }}>{children}</div>
    </Sequence>
  );
};

const TermTitle: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <div style={{ position: "absolute", left: 80, top: 60 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
      <Icon name="chart" size={56} color={C.observability} />
      <div style={{ fontSize: 46, fontWeight: 800 }}>{title}</div>
      {note ? <div style={{ fontSize: 24, color: C.muted, marginLeft: 10 }}>{note}</div> : null}
    </div>
    {children}
  </div>
);

// ---------------------------------------------------------------------------------------------
// Slide 5 — The reference observability stack (helm list, then the pods in `monitoring`)
const STACK = [
  { name: "Prometheus", sub: "collects and stores metrics", at: 12.0 },
  { name: "Grafana", sub: "dashboards", at: 13.6 },
  { name: "Jaeger", sub: "stores and shows traces", at: 14.4 },
  { name: "OpenTelemetry Collector", sub: "receives telemetry, forwards traces", at: 15.6 },
];

export const S05Stack: React.FC = () => (
  <Stage>
    <TermTitle title="The reference observability stack" note="charts/observability-stack · namespace monitoring">
      <Terminal
        session={S(stackCli)}
        starts={[0.5, 5.6]}
        cps={34}
        fontSize={19}
        width={1760}
        height={560}
        highlight={["observability-stack", "grafana", "jaeger", "opentelemetry-collector", "prometheus-observability"]}
      />
    </TermTitle>
    <div style={{ position: "absolute", left: 80, top: 760, display: "flex", gap: 22 }}>
      {STACK.map((s) => (
        <Appear key={s.name} at={s.at} from="up" dist={24} style={{ position: "relative" }}>
          <div style={{ width: s.name.length > 12 ? 520 : 380, boxSizing: "border-box", padding: "18px 22px", borderRadius: 18, border: `3px solid ${C.observability}`, background: `${C.observability}14` }}>
            <div style={{ fontSize: 30, fontWeight: 800, whiteSpace: "nowrap" }}>{s.name}</div>
            <div style={{ fontSize: 23, color: C.muted, marginTop: 4 }}>{s.sub}</div>
          </div>
        </Appear>
      ))}
    </div>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 7 — How the Canvas wires it up: Component → component operator → ExposedAPIs → API operator →
// ServiceMonitor → Prometheus, which scrapes the component's metrics endpoint every 15 s.
const APIS = [
  { label: "productcatalogmanagement", color: C.api, metrics: false },
  { label: "metrics", color: C.observability, metrics: true },
  { label: "userrolesandpermissions", color: C.identity, metrics: false },
];
const Y = 600; // flow centre line

export const S07Wiring: React.FC = () => {
  const t = useT();
  const dimOthers = interpolate(t, [8.6, 9.4], [1, 0.35], clamp);
  return (
    <Stage>
      <Heading kicker="When a component is deployed" title="How the Canvas wires it up" color={C.observability} />
      <Appear at={0.4} from="up" style={{ left: 70, top: Y - 150 }}>
        <OdaComponent size={260} labels={false} highlight="management" dim={0.4} caption="obs-productcatalogmanagement" />
      </Appear>
      <Svg>
        <Draw d={`M 340 ${Y} L 410 ${Y}`} at={1.8} color={C.operator} arrow />
        <Draw d={`M 610 ${Y} C 650 ${Y}, 650 ${Y - 110}, 690 ${Y - 110}`} at={3.6} dur={0.4} color={C.muted} width={3} arrow />
        <Draw d={`M 610 ${Y} L 690 ${Y}`} at={3.8} dur={0.4} color={C.observability} width={4} arrow />
        <Draw d={`M 610 ${Y} C 650 ${Y}, 650 ${Y + 110}, 690 ${Y + 110}`} at={4.0} dur={0.4} color={C.muted} width={3} arrow />
        <Draw d={`M 1070 ${Y} L 1140 ${Y}`} at={8.4} color={C.observability} arrow />
        <Draw d={`M 1350 ${Y} L 1420 ${Y}`} at={16.8} color={C.observability} arrow />
        <Draw d={`M 1640 ${Y - 90} C 1640 ${Y - 260}, 1100 ${Y - 290}, 330 ${Y - 160}`} at={20.2} dur={1.4} color={C.observability} width={4} dash arrow />
      </Svg>
      <Appear at={1.8} from="pop" style={{ left: 400, top: Y - 90 }}>
        <OpGear label="Component operator" color={C.operator} size={110} width={220} />
      </Appear>
      {APIS.map((a, i) => (
        <Appear key={a.label} at={4.0 + i * 0.3} from="right" style={{ left: 700, top: Y - 140 + i * 110, opacity: a.metrics ? 1 : dimOthers }}>
          <div style={{ width: 360, boxSizing: "border-box", padding: "12px 16px", borderRadius: 14, border: `3px solid ${a.color}`, background: `${a.color}1A` }}>
            <div style={{ fontSize: 18, color: C.muted, fontWeight: 700 }}>ExposedAPI</div>
            <div style={{ fontFamily: MONO, fontSize: a.metrics ? 26 : 20, fontWeight: 700 }}>{a.label}</div>
          </div>
        </Appear>
      ))}
      <Appear at={8.8} from="pop" style={{ left: 1130, top: Y - 90 }}>
        <OpGear label="API operator" sub="apiType: openmetrics" color={C.api} size={110} width={230} />
      </Appear>
      <Appear at={17.2} from="pop" style={{ left: 1430, top: Y - 80 }}>
        <div style={{ width: 300, boxSizing: "border-box", padding: "16px 18px", borderRadius: 18, border: `3px solid ${C.observability}`, background: `${C.observability}22`, textAlign: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>ServiceMonitor</div>
          <div style={{ fontSize: 20, color: C.muted }}>created by the Canvas</div>
        </div>
      </Appear>
      <Appear at={19.2} from="up" style={{ left: 1490, top: Y + 80 }}>
        <Tile label="Prometheus" color={C.observability} icon="chart" w={300} h={120} fontSize={30} />
      </Appear>
      <Appear at={21.4} from="pop" style={{ left: 820, top: Y - 325 }}>
        <Pill color={C.observability} fontSize={26}>scrapes /metrics every 15 s</Pill>
      </Appear>
      <Caption at={25.6} bottom={90} color={C.observability}>
        The ServiceMonitor is owned by the ExposedAPI · removed with the component
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 9 — Live: the ExposedAPIs and the ServiceMonitor the Canvas created for release obs
const wiring = S(wiringCli);

export const S09ServiceMonitor: React.FC = () => (
  <Stage>
    <Phase until={12.6}>
      <TermTitle title="The Canvas created the ServiceMonitor" note="release obs · namespace components">
        <Terminal
          session={pick(wiring, 0, 1)}
          starts={[0.4, 8.2]}
          cps={36}
          fontSize={19}
          width={1760}
          height={520}
          highlight={["obs-productcatalogmanagement-metrics"]}
        />
      </TermTitle>
      <Appear at={5.2} from="pop" style={{ left: 1180, top: 640 }}>
        <Pill color={C.observability} fontSize={28}>The metrics API</Pill>
      </Appear>
    </Phase>
    <Phase from={12.4}>
      <TermTitle title="Scrape every 15 s, port 4000" note="kubectl get servicemonitor … -o yaml">
        <Terminal
          session={pick(wiring, 2)}
          starts={[0.2]}
          cps={60}
          fontSize={18}
          width={1100}
          height={920}
          highlight={["kind: ExposedAPI", "interval: 15s", "path: /obs", "targetPort: 4000"]}
        />
      </TermTitle>
      {/* Times inside a Phase are relative to its start (12.4 s). */}
      <Appear at={2.2} from="right" style={{ left: 1240, top: 420 }}>
        <div style={{ width: 600, fontSize: 30, fontWeight: 700, lineHeight: 1.35 }}>
          Points Prometheus at the component's <span style={{ color: C.observability }}>metrics path</span>, on{" "}
          <span style={{ color: C.observability }}>port 4000</span>, every <span style={{ color: C.observability }}>15 seconds</span>
        </div>
      </Appear>
      <Appear at={6.6} from="right" style={{ left: 1240, top: 640 }}>
        <Pill color={C.ok} fontSize={28}>No Prometheus configuration by hand</Pill>
      </Appear>
    </Phase>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slides 10–14, 17–19 — live captures
const PROM = "localhost:9090";
const GRAFANA = "localhost:3000";
const JAEGER = "localhost:16686";

const TARGETS: CaptureSegment[] = [
  { from: 1.6, to: 6.3, rate: 1.2, url: `${PROM}/targets`, label: "Prometheus · Status › Targets" },
  { from: 6.3, to: 12.8, rate: 1, label: "Scrape pool from the ServiceMonitor the Canvas created" },
  { from: 12.8, to: 20.6, rate: 1, label: "State UP · the component's metrics endpoint", zoom: { scale: 1.7, x: 0, y: 330 } },
];
export const S10Targets: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-prom-targets.webm" segments={TARGETS} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const BUSINESS: CaptureSegment[] = [
  { from: 1.6, to: 8.0, rate: 1.3, url: `${PROM}/graph`, label: "Prometheus · Graph" },
  { from: 8.0, to: 17.6, rate: 1.6, label: "Business events per second, by type · last 15 minutes" },
  { from: 17.6, to: 26.0, rate: 1, label: "One line per kind of catalog event" },
];
export const S11Business: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-prom-business.webm" segments={BUSINESS} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const CPU: CaptureSegment[] = [
  { from: 1.6, to: 8.2, rate: 1.6, url: `${PROM}/graph`, label: "Prometheus · Graph" },
  { from: 8.2, to: 17.9, rate: 2, label: "CPU of each pod in the components namespace" },
  { from: 17.9, to: 26.2, rate: 1, label: "Reported by the platform · nothing needed from the component" },
];
export const S12Cpu: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-prom-cpu.webm" segments={CPU} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const DASH: CaptureSegment[] = [
  { from: 3.0, to: 11.6, rate: 1.3, url: `${GRAFANA}/dashboards`, label: "Grafana · Dashboards" },
  { from: 11.6, to: 17.1, rate: 1, url: `${GRAFANA}/d/oda-component`, label: "ODA Component · metrics endpoint up, business events" },
  { from: 17.1, to: 22.1, rate: 1, label: "Business events per minute, by type" },
  { from: 22.1, to: 28.4, rate: 1, label: "CPU and memory of each pod" },
];
export const S13Grafana: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-grafana.webm" segments={DASH} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const K8S: CaptureSegment[] = [
  { from: 4.5, to: 13.5, rate: 1, url: `${GRAFANA}/d/…/namespace-pods?var-namespace=components`, label: "Kubernetes / Compute Resources / Namespace (Pods) · components" },
  { from: 13.5, to: 18.4, rate: 1, label: "Every component's CPU and memory together" },
];
export const S14K8s: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-grafana-k8s.webm" segments={K8S} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const SEARCH: CaptureSegment[] = [
  { from: 1.8, to: 8.1, rate: 1.4, url: `${JAEGER}/search`, label: "Jaeger · Search" },
  { from: 8.1, to: 12.4, rate: 1.2, label: "Service obs-productcatalogmanagement · Find Traces" },
  { from: 12.4, to: 18.2, rate: 1, label: "One trace per API request · how long each one took" },
];
export const S17JaegerSearch: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-jaeger.webm" segments={SEARCH} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

const TRACE: CaptureSegment[] = [
  { from: 18.6, to: 27.0, rate: 1.6, url: `${JAEGER}/trace/…`, label: "One POST request" },
  { from: 27.0, to: 33.0, rate: 1, label: "The HTTP call, then middleware validating it against the TMF API" },
  { from: 33.0, to: 41.7, rate: 1, label: "Then the MongoDB calls · every step timed" },
];
export const S18Trace: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/obs-jaeger.webm" segments={TRACE} width={1720} top={36} labelColor={C.observability} />
  </Stage>
);

// Slide 19 — The Canvas Portal's Observability page as designed (user, 2026-10-23). The live page in the demo
// cluster finds only Prometheus (it looks for other Grafana service names and has no Jaeger card), so this
// recreates the page with the tools the reference stack installs, at their real in-cluster addresses.
const MENU = [
  { group: "DASHBOARD", items: ["Dashboard"] },
  { group: "COMPONENTS", items: ["Inventory", "Deploy", "Lifecycle"] },
  { group: "APIS", items: ["Exposed APIs", "Dependent APIs", "Gateway", "Service Mesh", "Policies"] },
  { group: "AI", items: ["Model Gateway", "TMF AI Agents"] },
  { group: "PLATFORM", items: ["Operators", "Observability", "BDD"] },
];
const TOOLS = [
  { name: "Langfuse", what: "LLM traces and evaluations", url: "", color: "#94A3B8", at: 11.6, found: false },
  { name: "Grafana", what: "Dashboards", url: "http://observability-grafana.monitoring.svc.cluster.local", color: "#F46800", at: 7.6, found: true },
  { name: "Prometheus", what: "Metrics and PromQL", url: "http://prometheus-operated.monitoring.svc.cluster.local:9090", color: "#E6522C", at: 7.0, found: true },
  { name: "Jaeger", what: "Distributed traces", url: "http://observability-jaeger-query.monitoring.svc.cluster.local:16686", color: "#3BB3C3", at: 8.2, found: true },
];

const ToolCard: React.FC<{ tool: (typeof TOOLS)[number] }> = ({ tool }) => (
  <div style={{ width: 345, boxSizing: "border-box", background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "22px 20px 20px", boxShadow: "0 4px 14px rgba(15,23,42,0.06)", opacity: tool.found ? 1 : 0.45, filter: tool.found ? undefined : "grayscale(1)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: "none", width: 50, height: 50, borderRadius: 25, background: `${tool.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: tool.color }}>{tool.name[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 27, fontWeight: 800, color: "#0F172A" }}>{tool.name}</div>
        <div style={{ fontSize: 17, color: "#64748B", lineHeight: 1.2 }}>{tool.what}</div>
      </div>
    </div>
    <div style={{ marginTop: 16, display: "inline-block", fontSize: 17, fontWeight: 700, padding: "3px 10px", borderRadius: 8, color: tool.found ? "#15803D" : "#64748B", background: tool.found ? "#DCFCE7" : "#F1F5F9", border: `1px solid ${tool.found ? "#86EFAC" : "#CBD5E1"}` }}>
      {tool.found ? "✓ Found in cluster" : "Not configured"}
    </div>
    <div style={{ marginTop: 18, fontSize: 16, color: "#94A3B8", fontWeight: 600 }}>Internal URL</div>
    <div style={{ fontFamily: MONO, fontSize: 16, color: "#334155", wordBreak: "break-all", minHeight: 72 }}>{tool.url || "Unavailable"}</div>
    <div style={{ marginTop: 10, fontSize: 16, color: "#94A3B8", fontWeight: 600 }}>Public URL</div>
    <div style={{ fontFamily: MONO, fontSize: 16, color: "#334155" }}>Not exposed</div>
    <div style={{ marginTop: 20, textAlign: "center", fontSize: 18, fontWeight: 700, padding: "10px 0", borderRadius: 8, background: "#F1F5F9", color: tool.found ? "#1E40AF" : "#94A3B8" }}>Open {tool.name}</div>
  </div>
);

export const S19Portal: React.FC = () => (
  <Stage>
    <BrowserFrame url="localhost:8090/observability" style={{ left: 80, top: 40, width: 1760, height: 820 }}>
      <div style={{ display: "flex", height: 774, fontFamily: FONT }}>
        <div style={{ width: 250, background: "#0F172A", padding: "22px 16px", boxSizing: "border-box" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 24, marginBottom: 22 }}>Canvas Portal</div>
          {MENU.map((g) => (
            <div key={g.group} style={{ marginBottom: 10 }}>
              <div style={{ color: "#64748B", fontSize: 13, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>{g.group}</div>
              {g.items.map((i) => (
                <div key={i} style={{ fontSize: 18, padding: "6px 12px", borderRadius: 8, color: i === "Observability" ? "#fff" : "#CBD5E1", background: i === "Observability" ? "#1E3A8A" : undefined, fontWeight: i === "Observability" ? 700 : 500 }}>{i}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: "#F4F6FA", padding: "30px 36px", position: "relative" }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "#0F172A" }}>Observability</div>
          <div style={{ fontSize: 20, color: "#64748B", marginBottom: 30 }}>Telemetry tools</div>
          <div style={{ display: "flex", gap: 18 }}>
            {TOOLS.map((tool) => (
              <Appear key={tool.name} at={tool.at} from="up" dist={20} style={{ position: "relative" }}>
                <ToolCard tool={tool} />
              </Appear>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
    <Caption at={15.6} bottom={70} color={C.observability}>
      The Canvas is still under development · LLM observability is in the backlog
    </Caption>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 15 — How traces reach Jaeger: spans light up inside the component and are pushed over OTLP to
// the OpenTelemetry Collector, which batches them and forwards them to Jaeger (or another backend).
const SPANS = [
  { label: "POST /productOffering", w: 420, x: 0, at: 4.2 },
  { label: "validate", w: 120, x: 20, at: 4.8 },
  { label: "route", w: 260, x: 150, at: 5.2 },
  { label: "mongodb.insert", w: 140, x: 200, at: 5.6 },
  { label: "mongodb.find", w: 90, x: 350, at: 6.0 },
];
const SY = 520;

const Packet: React.FC<{ at: number; from: number; to: number; y: number; dur?: number }> = ({ at, from, to, y, dur = 1.2 }) => {
  const t = useT();
  const p = interpolate(t, [at, at + dur], [0, 1], clamp);
  const o = interpolate(t, [at, at + 0.15, at + dur - 0.15, at + dur], [0, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: from + (to - from) * p, top: y - 9, width: 36, height: 18, borderRadius: 6, background: C.observability, opacity: o }} />;
};

export const S15Traces: React.FC = () => (
  <Stage>
    <Heading kicker="Traces" title="How traces reach Jaeger" color={C.observability} />
    <Svg>
      <Draw d={`M 40 ${SY - 160} L 150 ${SY - 160}`} at={0.6} color={C.text} arrow />
      <Draw d={`M 760 ${SY} L 1010 ${SY}`} at={7.4} color={C.observability} width={5} arrow />
      <Draw d={`M 1370 ${SY} L 1520 ${SY}`} at={15.4} color={C.observability} width={5} arrow />
      <Draw d={`M 1190 ${SY + 120} C 1190 ${SY + 260}, 1300 ${SY + 300}, 1500 ${SY + 300}`} at={21.4} dur={0.8} color={C.muted} width={4} dash arrow />
    </Svg>
    <Appear at={0.2} from="none" style={{ left: 30, top: SY - 210 }}>
      <div style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}>API request</div>
    </Appear>
    <Appear at={0.4} from="up" style={{ left: 160, top: SY - 270 }}>
      <OdaComponent size={230} labels={false} caption="product catalog" />
    </Appear>
    <Appear at={3.6} from="up" style={{ left: 110, top: SY + 60 }}>
      <div style={{ width: 610, boxSizing: "border-box", padding: "16px 18px", borderRadius: 16, border: `2px solid ${C.panelEdge}`, background: "#0D1426" }}>
        {SPANS.map((s, i) => (
          <Appear key={s.label} at={s.at} from="left" dist={20} style={{ position: "relative", marginBottom: 8 }}>
            <div style={{ marginLeft: s.x, width: s.w + 140, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: s.w, height: 22, borderRadius: 5, background: i === 0 ? C.observability : `${C.observability}99` }} />
              <div style={{ fontFamily: MONO, fontSize: 18, color: C.text, whiteSpace: "nowrap" }}>{s.label}</div>
            </div>
          </Appear>
        ))}
      </div>
    </Appear>
    {[7.8, 8.4, 9.0, 9.6, 10.2].map((a) => (
      <Packet key={a} at={a} from={770} to={980} y={SY} />
    ))}
    <Appear at={11.2} from="pop" style={{ left: 770, top: SY + 22 }}>
      <div style={{ fontFamily: MONO, fontSize: 18, color: C.observability, fontWeight: 700 }}>OTLP · HTTP · :4318</div>
    </Appear>
    <Appear at={11.8} from="pop" style={{ left: 1020, top: SY - 110 }}>
      <div style={{ width: 340, height: 220, boxSizing: "border-box", padding: "22px 20px", borderRadius: 22, border: `3px solid ${C.observability}`, background: `${C.observability}1F`, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Gear size={70} color={C.observability} />
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>OpenTelemetry Collector</div>
        <Appear at={14.2} from="none" style={{ position: "relative" }}>
          <div style={{ fontSize: 20, color: C.muted }}>batches · forwards</div>
        </Appear>
      </div>
    </Appear>
    {[15.8, 16.6].map((a) => (
      <Packet key={a} at={a} from={1380} to={1500} y={SY} dur={0.8} />
    ))}
    <Appear at={15.8} from="right" style={{ left: 1530, top: SY - 80 }}>
      <Tile label="Jaeger" sub="stores and shows traces" color={C.observability} icon="trace" w={330} h={160} fontSize={34} />
    </Appear>
    <Appear at={21.8} from="right" style={{ left: 1520, top: SY + 250 }}>
      <Pill color={C.muted} fontSize={26}>or another tracing platform</Pill>
    </Appear>
    <Caption at={2.6} bottom={60} color={C.observability}>
      Pushed as they happen · not scraped
    </Caption>
  </Stage>
);
