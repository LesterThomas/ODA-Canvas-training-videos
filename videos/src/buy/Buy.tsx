import React from "react";
import { Img, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { C, MONO } from "../theme";
import { Appear, Caption, Code, Draw, Gear, Heading, Icon, IconName, Pill, Stage, Svg, Tile, useProg, useT } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";
import { CaptureClip, CaptureSegment } from "../lib/CaptureClip";
import { CliSession, Terminal } from "../lib/Terminal";
import { IdpPanel } from "../auth/Concepts";
import cli from "../../public/captures/buy-cli.cli.json";

// Deck 02 — How do I buy or build an ODA Canvas? (scripts/02-how-do-i-buy-or-build-an-oda-canvas.md).
// Timings are seconds from slide start ≈ words before the mention ÷ 2.5. Live segments were recorded on
// the demo cluster by demos/buy/record-demo.mjs; segment times are capture seconds from its marks.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PORTAL = "localhost:8090";

// ---- The ODA Canvas picture (images/ODA-Canvas-dark.svg; viewBox 10 180 1652 610), with its modules.
type Box = { left: number; top: number; width: number; height: number };
const canvasModule = (c: { left: number; top: number; w: number }) => {
  const s = c.w / 1652;
  return (x0: number, x1: number, y0: number, y1: number): Box => ({
    left: c.left + (x0 - 10) * s,
    top: c.top + (y0 - 180) * s,
    width: (x1 - x0) * s,
    height: (y1 - y0) * s,
  });
};
const MODULES: Record<string, [number, number, number, number]> = {
  component: [110, 412, 326, 458],
  api: [490, 821, 326, 458],
  observability: [849, 1181, 326, 458],
  identity: [1205, 1556, 326, 458],
  data: [1205, 1556, 494, 626],
  model: [849, 1181, 494, 626],
  cost: [95, 425, 494, 626],
  carbon: [470, 805, 494, 626],
};

const CanvasPicture: React.FC<{ left: number; top: number; w: number; at: number }> = ({ left, top, w, at }) => (
  <Appear at={at} from="up" dist={60} style={{ left, top }}>
    <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ width: w, display: "block" }} />
  </Appear>
);

const Glow: React.FC<{ box: Box; color: string; at: number; label?: string; labelY?: number }> = ({ box, color, at, label, labelY }) => {
  const p = useProg(at, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        ...box,
        borderRadius: 10,
        border: `4px solid ${color}`,
        boxShadow: `0 0 ${30 * p}px ${color}, inset 0 0 ${20 * p}px ${color}66`,
        opacity: p,
      }}
    >
      {label ? (
        <div style={{ position: "absolute", left: -40, right: -40, top: (labelY ?? box.top - 44) - box.top, textAlign: "center", fontSize: 24, fontWeight: 700, color, whiteSpace: "nowrap" }}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** A gear with a label under it (an operator). */
const OpGear: React.FC<{ label: string; sub?: string; color: string; size?: number; width?: number }> = ({ label, sub, color, size = 110, width = 280 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width }}>
    <Gear size={size} color={color} />
    <div style={{ fontSize: 26, fontWeight: 800, color, textAlign: "center", lineHeight: 1.15 }}>{label}</div>
    {sub ? <div style={{ fontSize: 20, color: C.muted, textAlign: "center" }}>{sub}</div> : null}
  </div>
);

// ---------------------------------------------------------------------------------------------
// Slide 2 — The standard is the component
const SPEC = [
  { text: "kind: Component", color: C.muted },
  { text: "spec:" },
  { text: "coreFunction:", indent: 1 },
  { text: "exposedAPIs: …", indent: 2, color: C.api },
  { text: "dependentAPIs: …", indent: 2, color: C.api },
  { text: "dependentModels: …", indent: 2, color: C.ai },
  { text: "securityFunction:", indent: 1 },
  { text: "canvasSystemRole: …", indent: 2, color: C.identity },
  { text: "managementFunction:", indent: 1 },
  { text: "exposedAPIs: metrics", indent: 2, color: C.observability },
];
const C2 = { left: 820, top: 430, w: 1000 };
const M2 = canvasModule(C2);

export const S02Standard: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="What a Canvas is" title="The standard is the component" color={C.component} />
      <Appear at={0.4} from="pop" style={{ left: 120, top: 220 }}>
        <Pill color={C.danger} fontSize={26} style={{ textDecoration: t >= 3.4 ? "line-through" : undefined, opacity: t >= 3.4 ? 0.6 : 1 }}>
          A separate Canvas standard
        </Pill>
      </Appear>
      <Appear at={3.6} from="up" style={{ left: 110, top: 300 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OdaComponent size={150} labels={false} />
          <div style={{ fontSize: 32, fontWeight: 800, color: C.component, lineHeight: 1.2 }}>
            ODA Component
            <br />
            specification
          </div>
        </div>
      </Appear>
      <Appear at={4.4} from="up" style={{ left: 110, top: 480 }}>
        <Code lines={SPEC} at={4.6} perLine={0.15} fontSize={22} width={560} title="component.yaml" />
      </Appear>
      <CanvasPicture {...C2} at={6.4} />
      <Svg>
        <Draw d="M 690 640 C 760 640, 760 560, 830 560" at={7.6} color={C.operator} width={4} arrow />
      </Svg>
      <Appear at={7.8} from="left" style={{ left: 1000, top: 250 }}>
        <Pill color={C.operator} fontSize={26}>reads the specification · meets its requirements</Pill>
      </Appear>
      <Glow box={M2(...MODULES.api)} color={C.api} at={12.4} label="APIs exposed" labelY={C2.top - 50} />
      <Glow box={M2(...MODULES.identity)} color={C.identity} at={13.6} label="Roles registered" labelY={C2.top - 50} />
      <Glow box={M2(...MODULES.observability)} color={C.observability} at={14.6} label="Monitored" labelY={C2.top - 50} />
      <Glow box={M2(...MODULES.model)} color={C.ai} at={19.6} label="AI models" labelY={C2.top + 380} />
      <Glow box={M2(...MODULES.data)} color={C.ai} at={24.0} label="Data products" labelY={C2.top + 380} />
      <Glow box={M2(...MODULES.cost)} color={C.cost} at={28.6} label="Cost" labelY={C2.top + 380} />
      <Glow box={M2(...MODULES.carbon)} color={C.carbon} at={29.4} label="Carbon" labelY={C2.top + 380} />
      <Appear at={32.0} from="up" style={{ left: 820, top: 880, width: 1000 }}>
        <div style={{ textAlign: "center", fontSize: 30, fontWeight: 700, color: C.operator }}>
          Not exhaustive · any common platform service, same pattern
        </div>
      </Appear>
      <Appear at={38.0} from="up" style={{ left: 1040, top: 950 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: C.muted, fontWeight: 700 }}>
          <Icon name="server" size={34} color={C.canvas} /> Reference implementation · on Kubernetes
        </div>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 4 — Mix and match: one Canvas assembled from all three routes
const C4 = { left: 460, top: 560, w: 1000 };
const M4 = canvasModule(C4);
const ROUTES: { label: string; sub: string; icon: IconName; color: string; x: number }[] = [
  { label: "Public cloud", sub: "managed services", icon: "cloud", color: C.canvas, x: 150 },
  { label: "Reference implementation", sub: "Apache 2.0", icon: "layers", color: C.operator, x: 700 },
  { label: "Your own or a vendor's", sub: "operators", icon: "wrench", color: C.component, x: 1250 },
];
const PIECES: { label: string; from: number; to: string; color: string; at: number; below?: boolean }[] = [
  { label: "API management", from: 0, to: "api", color: C.api, at: 6.6 },
  { label: "Identity operator", from: 1, to: "identity", color: C.identity, at: 9.0 },
  { label: "In-house operator", from: 2, to: "data", color: C.component, at: 11.4, below: true },
];

const Piece: React.FC<{ p: (typeof PIECES)[number] }> = ({ p }) => {
  const t = useT();
  const k = interpolate(t, [p.at, p.at + 1.4], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const appear = interpolate(t, [p.at - 0.4, p.at], [0, 1], clamp);
  const box = M4(...MODULES[p.to]);
  const sx = ROUTES[p.from].x + 40;
  const sy = 400;
  const tx = box.left + box.width / 2 - 130;
  const ty = box.top + box.height / 2 - 26;
  return (
    <div style={{ position: "absolute", left: interpolate(k, [0, 1], [sx, tx]), top: interpolate(k, [0, 1], [sy, ty]), opacity: appear * (1 - interpolate(k, [0.85, 1], [0, 1], clamp)) }}>
      <Pill color={p.color} fontSize={24} style={{ width: 260, justifyContent: "center", boxSizing: "border-box" }}>{p.label}</Pill>
    </div>
  );
};

export const S04MixMatch: React.FC = () => (
  <Stage>
    <Heading kicker="Three routes" title="Mix and match" color={C.canvas} />
    {ROUTES.map((r, i) => (
      <Appear key={r.label} at={0.3 + i * 0.3} from="up" style={{ left: r.x, top: 230 }}>
        <Tile label={r.label} sub={r.sub} icon={r.icon} color={r.color} w={500} h={120} fontSize={30} />
      </Appear>
    ))}
    <CanvasPicture {...C4} at={1.6} />
    {PIECES.map((p) => (
      <React.Fragment key={p.label}>
        <Piece p={p} />
        <Glow box={M4(...MODULES[p.to])} color={p.color} at={p.at + 1.3} label={p.label} labelY={p.below ? C4.top + 375 : C4.top - 50} />
      </React.Fragment>
    ))}
    <Caption at={13.6} bottom={40} color={C.canvas}>
      Standard operators, plus custom ones for your own policies
    </Caption>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 5 — How you know it's a Canvas: any Canvas passes through the test kit
const CANDIDATES: { label: string; icon: IconName; color: string }[] = [
  { label: "Cloud Canvas", icon: "cloud", color: C.canvas },
  { label: "Home-grown Canvas", icon: "wrench", color: C.operator },
  { label: "Mixed Canvas", icon: "layers", color: C.component },
];
const SCENARIOS = ["Install component", "Expose APIs", "Configure roles", "Dependent APIs", "OpenMetrics", "Disruption budget"];

export const S05TestKit: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="Checking the result" title="How you know it's a Canvas" color={C.ok} />
      {CANDIDATES.map((c, i) => (
        <Appear key={c.label} at={0.6 + i * 0.4} from="left" style={{ left: 110, top: 290 + i * 200 }}>
          <Tile label={c.label} icon={c.icon} color={c.color} w={420} h={120} fontSize={30} />
        </Appear>
      ))}
      <Appear at={4.8} from="up" style={{ left: 700, top: 250 }}>
        <div style={{ width: 600, height: 640, borderRadius: 26, border: `3px solid ${C.ok}`, background: `${C.ok}10` }} />
      </Appear>
      <Appear at={9.6} from="up" style={{ left: 730, top: 280 }}>
        <Tile label="Use-case library" sub="what a Canvas does" icon="doc" color={C.ok} w={540} h={120} fontSize={30} />
      </Appear>
      <Appear at={13.2} from="up" style={{ left: 730, top: 430 }}>
        <Tile label="BDD features" sub="scenarios · how it behaves" icon="flask" color={C.ok} w={540} h={120} fontSize={30} />
      </Appear>
      {SCENARIOS.map((s, i) => (
        <Appear key={s} at={16.8 + i * 0.25} from="left" style={{ left: 740 + (i % 2) * 270, top: 600 + Math.floor(i / 2) * 82 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, color: C.text, width: 262, whiteSpace: "nowrap" }}>
            <Icon name="check" size={26} color={C.ok} /> {s}
          </div>
        </Appear>
      ))}
      <Appear at={16.8} from="pop" style={{ left: 930, top: 200 }}>
        <Pill color={C.ok} fontSize={26}>Test kit</Pill>
      </Appear>
      <Svg>
        {CANDIDATES.map((c, i) => (
          <Draw key={c.label} d={`M 540 ${350 + i * 200} L 690 ${350 + i * 200}`} at={18.6 + i * 0.4} dur={0.5} color={c.color} width={4} arrow />
        ))}
        {CANDIDATES.map((c, i) => (
          <Draw key={`o${c.label}`} d={`M 1310 ${350 + i * 200} L 1440 ${350 + i * 200}`} at={19.4 + i * 0.4} dur={0.5} color={C.ok} width={4} arrow />
        ))}
      </Svg>
      {CANDIDATES.map((c, i) => (
        <Appear key={`r${c.label}`} at={19.8 + i * 0.4} from="pop" style={{ left: 1460, top: 300 + i * 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: C.ok, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={60} color={C.bg} stroke={3} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, opacity: t > 0 ? 1 : 0 }}>{c.label.replace(" Canvas", "")}</div>
          </div>
        </Appear>
      ))}
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 6 — Live: the test kit in the Canvas Portal (buy-bdd capture; marks bdd 8.9, catalogue 18.2,
// selected 25.9, started 28.4; the UC002-F001 run finished at about 77 s and passed, 6 of 6 scenarios).
const BDD: CaptureSegment[] = [
  { from: 8.5, to: 11.5, rate: 1, url: `${PORTAL}/bdd`, label: "Canvas Portal · Platform › BDD" },
  { from: 11.5, to: 18.2, rate: 1.6, label: "Feature files, straight from the oda-canvas repository" },
  { from: 18.2, to: 23.5, rate: 0.85, label: "Each named after the use case it tests" },
  { from: 23.5, to: 29.5, rate: 1, label: "Pick a feature · UC002-F001 Install Component · Start run" },
  { from: 29.5, to: 77.5, rate: 12, label: "Running against this Canvas (sped up)" },
  { from: 77.5, to: 81.5, rate: 1, label: "Succeeded · all 6 scenarios passed" },
];
export const S06Bdd: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/buy-bdd.webm" segments={BDD} width={1720} top={36} labelColor={C.ok} />
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 7 — Operators are the modules: sub-resources fan out, each to its own operator; one swaps.
const SUBS = [
  { kind: "ExposedAPI", op: "API operator", color: C.api, at: 14.0 },
  { kind: "DependentAPI", op: "Dependency operator", color: C.api, at: 14.8 },
  { kind: "IdentityConfig", op: "Identity config operator", color: C.identity, at: 15.6 },
  { kind: "SecretsManagement", op: "Secrets operator", color: C.secrets, at: 16.0 },
];
const SWAP = 19.6;

export const S07Modules: React.FC = () => {
  const t = useT();
  const swap = interpolate(t, [SWAP, SWAP + 0.8], [0, 1], clamp);
  return (
    <Stage>
      <Heading kicker="Canvas operators" title="Operators are the modules" color={C.operator} />
      <Appear at={3.6} from="pop" style={{ left: 120, top: 250 }}>
        <Pill color={C.operator} fontSize={26}>Kubernetes operator pattern · operational knowledge in software</Pill>
      </Appear>
      <Appear at={9.6} from="up" style={{ left: 110, top: 520 }}>
        <Tile label="Component" sub="component.yaml" color={C.component} iconNode={<OdaComponent size={56} crop />} w={320} h={130} fontSize={32} />
      </Appear>
      <Appear at={10.4} from="pop" style={{ left: 470, top: 490 }}>
        <OpGear label="Component Management" color={C.operator} size={150} width={260} />
      </Appear>
      <Svg>
        <Draw d="M 415 585 L 480 585" at={10.2} color={C.operator} arrow />
        {SUBS.map((s, i) => (
          <Draw key={s.kind} d={`M 680 565 C 730 565, 730 ${400 + i * 140}, 790 ${400 + i * 140}`} at={s.at - 0.4} dur={0.5} color={s.color} width={3} arrow />
        ))}
        {SUBS.map((s, i) => (
          <Draw key={`o${s.kind}`} d={`M 1240 ${400 + i * 140} L 1320 ${400 + i * 140}`} at={16.4 + i * 0.25} dur={0.4} color={s.color} width={3} arrow />
        ))}
      </Svg>
      {SUBS.map((s, i) => (
        <Appear key={s.kind} at={s.at} from="left" style={{ left: 800, top: 362 + i * 140 }}>
          <div style={{ fontFamily: MONO, fontSize: 25, width: 430, padding: "16px 20px", borderRadius: 14, background: `${s.color}1F`, border: `2px solid ${s.color}`, boxSizing: "border-box" }}>
            kind: {s.kind}
          </div>
        </Appear>
      ))}
      {SUBS.map((s, i) => (
        <Appear key={`g${s.kind}`} at={16.6 + i * 0.25} from="pop" style={{ left: 1335, top: 362 + i * 140 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Gear size={76} color={s.color} spin={60} />
            <div style={{ fontSize: 27, fontWeight: 700, width: 420 }}>
              {i === 0 ? (
                <span>
                  API operator ·{" "}
                  <span style={{ display: "inline-grid" }}>
                    <span style={{ gridArea: "1/1", opacity: 1 - swap, color: C.api }}>Istio</span>
                    <span style={{ gridArea: "1/1", opacity: swap, color: C.api }}>Kong</span>
                  </span>
                </span>
              ) : (
                s.op
              )}
            </div>
          </div>
        </Appear>
      ))}
      <Appear at={SWAP} from="pop" style={{ left: 1300, top: 270 }}>
        <Pill color={C.api} fontSize={22}>swap the technology</Pill>
      </Appear>
      <Caption at={SWAP + 0.6} bottom={40} color={C.operator}>
        Same component · only the operator changes
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 9 — Live: the operators in this Canvas (buy-operators capture; marks operators 5.5, kong 13.0,
// keycloak 15.5, vault 18.2), then the same list from kubectl.
const S = (s: unknown) => s as CliSession;
const session = S(cli);
const step = (...i: number[]): CliSession => ({ ...session, steps: i.map((n) => session.steps[n]) });

const OPS: CaptureSegment[] = [
  { from: 5.0, to: 8.0, rate: 0.75, url: `${PORTAL}/operators`, label: "Canvas Portal · Platform › Operators" },
  { from: 8.0, to: 19.0, rate: 1.1, label: "Kong API operator (image api-operator-kong) · Keycloak identity · Vault secrets" },
];

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
      <Gear size={56} color={C.operator} />
      <div style={{ fontSize: 46, fontWeight: 800 }}>{title}</div>
      {note ? <div style={{ fontSize: 24, color: C.muted, marginLeft: 10 }}>{note}</div> : null}
    </div>
    {children}
  </div>
);

export const S09Operators: React.FC = () => (
  <Stage>
    <Phase until={15.4}>
      <CaptureClip src="captures/buy-operators.webm" segments={OPS} width={1720} top={36} labelColor={C.operator} />
    </Phase>
    <Phase from={15.2}>
      <TermTitle title="The same operators, from the command line" note="kubectl · namespace canvas">
        <Terminal session={step(0)} starts={[0.3]} cps={40} fontSize={21} width={1760} height={700} highlight={["operator", "keycloak-authz"]} />
      </TermTitle>
    </Phase>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 10 — Live: choosing the modules (helm get values, then helm list).
export const S10Choosing: React.FC = () => (
  <Stage>
    <TermTitle title="Choosing the modules" note="configuration, not code">
      <Terminal
        session={step(1, 2)}
        starts={[0.6, 12.0]}
        cps={36}
        fontSize={18}
        width={1760}
        height={640}
        highlight={["api-operator-istio", "kong-gateway-install", "depmgmt-keycloak-authz"]}
      />
    </TermTitle>
    <Appear at={9.2} from="pop" style={{ left: 1300, top: 70 }}>
      <Pill color={C.api} fontSize={26}>One API operator at a time</Pill>
    </Appear>
    <Caption at={19.2} bottom={70} color={C.operator}>
      The components didn't change at all
    </Caption>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 11 — Example 1: API management
const GATEWAYS = [
  { name: "Istio service mesh", at: 14.4 },
  { name: "Kong", at: 15.4 },
  { name: "Apache APISIX", at: 16.0 },
  { name: "Azure API Management", at: 18.6 },
  { name: "Google Apigee", at: 19.8 },
  { name: "Whale Cloud", at: 21.0 },
];
const POLICIES = [
  { label: "rate limit", at: 4.6 },
  { label: "API key", at: 5.6 },
];

export const S11Api: React.FC = () => (
  <Stage>
    <Heading kicker="Example 1 · TMFOP002" title="API management" color={C.api} />
    <Appear at={1.2} from="left" style={{ left: 110, top: 270 }}>
      <Code
        at={1.4}
        perLine={0.15}
        fontSize={24}
        width={620}
        title="ExposedAPI"
        lines={[
          { text: "kind: ExposedAPI", color: C.muted },
          { text: "spec:" },
          { text: "name: productcatalogmanagement", indent: 1 },
          { text: "apiType: openapi", indent: 1 },
          { text: "gatewayConfiguration:", indent: 1, color: C.api },
          { text: "rateLimit: { limit: 100 }", indent: 2 },
          { text: "apiKeyVerification: …", indent: 2 },
        ]}
      />
    </Appear>
    {POLICIES.map((p, i) => (
      <Appear key={p.label} at={p.at} from="pop" style={{ left: 110 + i * 260, top: 660 }}>
        <Pill color={C.api} fontSize={28}>
          <Icon name="shield" size={28} color={C.api} /> {p.label}
        </Pill>
      </Appear>
    ))}
    <Svg>
      <Draw d="M 740 470 L 830 470" at={7.6} color={C.api} arrow />
      {GATEWAYS.map((g, i) => (
        <Draw key={g.name} d={`M 1040 470 C 1120 470, 1120 ${300 + i * 105}, 1210 ${300 + i * 105}`} at={g.at - 0.3} dur={0.5} color={C.api} width={3} arrow />
      ))}
    </Svg>
    <Appear at={7.8} from="pop" style={{ left: 835, top: 370 }}>
      <OpGear label="API operator" color={C.api} size={170} width={210} />
    </Appear>
    {GATEWAYS.map((g, i) => (
      <Appear key={g.name} at={g.at} from="right" style={{ left: 1220, top: 258 + i * 105 }}>
        <Tile label={g.name} color={C.canvas} icon="gateway" w={560} h={86} fontSize={29} />
      </Appear>
    ))}
    <Appear at={22.8} from="up" style={{ left: 1220, top: 900 }}>
      <Tile label="or another gateway" sub="with its own operator" color={C.faint} icon="gateway" w={560} h={96} fontSize={28} style={{ borderStyle: "dashed" }} />
    </Appear>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 12 — Example 2: observability, configured by the API operator
const OUTPUTS = [
  { k: "ServiceMonitor", label: "Prometheus operator", at: 15.6 },
  { k: "PrometheusAnnotation", label: "Managed Prometheus service", at: 17.0 },
  { k: "DataDogAnnotations", label: "Datadog", at: 18.6 },
];

export const S12Observability: React.FC = () => (
  <Stage>
    <Heading kicker="Example 2" title="Observability" color={C.observability} />
    <Appear at={0.8} from="up" style={{ left: 120, top: 260 }}>
      <OdaComponent size={260} labels={false} highlight="management" dim={0.45} caption="ODA Component" />
    </Appear>
    <Appear at={1.6} from="pop" style={{ left: 100, top: 560 }}>
      <Pill color={C.danger} fontSize={24} style={{ textDecoration: "line-through", opacity: 0.7 }}>
        its own monitoring tools
      </Pill>
    </Appear>
    <Appear at={5.4} from="pop" style={{ left: 120, top: 640 }}>
      <Pill color={C.observability} fontSize={26}>OpenMetrics</Pill>
    </Appear>
    <Appear at={6.6} from="pop" style={{ left: 120, top: 712 }}>
      <Pill color={C.observability} fontSize={26}>OpenTelemetry</Pill>
    </Appear>
    <Svg>
      <Draw d="M 410 400 L 560 400" at={8.4} color={C.observability} arrow />
      {OUTPUTS.map((o, i) => (
        <Draw key={o.k} d={`M 900 400 C 980 400, 980 ${290 + i * 140}, 1060 ${290 + i * 140}`} at={o.at - 0.3} dur={0.5} color={C.observability} width={3} arrow />
      ))}
    </Svg>
    <Appear at={8.6} from="pop" style={{ left: 570, top: 300 }}>
      <OpGear label="API operator" sub="exposes the metrics endpoint" color={C.api} size={130} width={320} />
    </Appear>
    <Appear at={11.0} from="up" style={{ left: 545, top: 560 }}>
      <div style={{ fontFamily: MONO, fontSize: 22, padding: "12px 18px", borderRadius: 12, background: "#0D1426", border: `2px solid ${C.panelEdge}`, color: C.observability }}>
        openMetricsImplementation:
      </div>
    </Appear>
    {OUTPUTS.map((o, i) => (
      <Appear key={o.k} at={o.at} from="right" style={{ left: 1070, top: 240 + i * 140 }}>
        <div style={{ width: 720, boxSizing: "border-box", padding: "14px 22px", borderRadius: 16, border: `3px solid ${C.observability}`, background: `${C.observability}1A` }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: C.observability }}>{o.k}</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{o.label}</div>
        </div>
      </Appear>
    ))}
    <Appear at={19.6} from="up" style={{ left: 110, top: 850 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "nowrap" }}>
        <div style={{ fontSize: 26, color: C.muted, fontWeight: 700, marginRight: 8 }}>Reference stack</div>
        {["Prometheus", "Grafana", "Jaeger", "OpenTelemetry Collector"].map((n) => (
          <Pill key={n} color={C.observability} fontSize={24}>{n}</Pill>
        ))}
      </div>
    </Appear>
    <Appear at={22.0} from="up" style={{ left: 110, top: 940 }}>
      <div style={{ fontSize: 28, color: C.muted, fontWeight: 700 }}>…or another observability platform</div>
    </Appear>
  </Stage>
);

// ---------------------------------------------------------------------------------------------
// Slide 13 — Example 3: identity. Each application's own identity box gives way to one platform.
const APPS = ["Billing", "CRM", "Ordering", "Inventory"];

export const S13Identity: React.FC = () => {
  const t = useT();
  const old = interpolate(t, [8.0, 8.8], [1, 0], clamp);
  return (
    <Stage>
      <Heading kicker="Example 3 · TMFOP003" title="Identity" color={C.identity} />
      {/* Before: each application brings its own identity management, wired to the central system. */}
      <div style={{ position: "absolute", inset: 0, opacity: old }}>
        {APPS.map((a, i) => (
          <Appear key={a} at={0.8 + i * 0.3} from="up" style={{ left: 120 + i * 300, top: 300 }}>
            <div style={{ width: 260, borderRadius: 16, border: `2px solid ${C.faint}`, background: C.panel, padding: 16, boxSizing: "border-box" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{a}</div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 20, color: C.identity }}>
                <Icon name="key" size={26} color={C.identity} /> own identity store
              </div>
            </div>
          </Appear>
        ))}
        <Svg>
          {APPS.map((a, i) => (
            <Draw key={a} d={`M ${250 + i * 300} 440 C ${250 + i * 300} 560, 760 520, 760 640`} at={4.2 + i * 0.3} color={C.danger} width={3} dash />
          ))}
        </Svg>
        <Appear at={4.0} from="up" style={{ left: 560, top: 650 }}>
          <Tile label="Central identity system" sub="one integration per application" icon="people" color={C.danger} w={420} h={120} fontSize={28} />
        </Appear>
      </div>
      {/* After: components hold only their roles; the Canvas registers them in one platform. */}
      {[0, 1, 2].map((i) => (
        <Appear key={i} at={8.6 + i * 0.3} from="up" style={{ left: 120, top: 250 + i * 230 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <OdaComponent size={130} labels={false} highlight="security" dim={0.5} />
            <Pill color={C.identity} fontSize={22}>roles · permissions</Pill>
          </div>
        </Appear>
      ))}
      <Svg>
        {[0, 1, 2].map((i) => (
          <Draw key={i} d={`M 530 ${320 + i * 230} C 620 ${320 + i * 230}, 620 520, 700 520`} at={11.6 + i * 0.2} color={C.identity} width={3} arrow />
        ))}
        <Draw d="M 980 520 L 1080 520" at={14.6} color={C.identity} width={4} arrow />
      </Svg>
      <Appear at={11.6} from="pop" style={{ left: 720, top: 420 }}>
        <OpGear label="Identity config operator" color={C.identity} size={120} width={260} />
      </Appear>
      <IdpPanel x={1090} y={300} w={720} h={340} at={14.4}>
        <div style={{ position: "absolute", left: 26, top: 120, display: "flex", flexDirection: "column", gap: 14 }}>
          {["product catalog", "product inventory", "product order"].map((n, i) => (
            <Appear key={n} at={15.6 + i * 0.4} from="left" style={{ position: "relative" }}>
              <Pill color={C.identity} fontSize={22}>{n} · its roles</Pill>
            </Appear>
          ))}
        </div>
      </IdpPanel>
      <Appear at={20.0} from="up" style={{ left: 1090, top: 700 }}>
        <div style={{ display: "flex", gap: 30 }}>
          <OpGear label="Credentials" sub="TMFOP004 · client secrets" color={C.operator} size={80} width={330} />
          <OpGear label="Dependency" sub="TMFOP005 · simple, or Keycloak authorization" color={C.operator} size={80} width={360} />
        </div>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 15 — Example 5: carbon-aware scaling. Replicas fall when grid intensity is high.
const HOURS = 24;
const intensity = (h: number) => 0.5 + 0.32 * Math.sin(((h - 3) / 24) * Math.PI * 2) + 0.12 * Math.sin((h / 24) * Math.PI * 6);
const CH = { x: 430, y: 300, w: 1380, h: 300 };

export const S15Carbon: React.FC = () => {
  const t = useT();
  const sweep = interpolate(t, [10.4, 17.0], [0, 1], clamp);
  const pts = Array.from({ length: HOURS * 4 + 1 }, (_, i) => {
    const h = i / 4;
    return `${CH.x + (h / HOURS) * CH.w},${CH.y + CH.h - intensity(h) * CH.h}`;
  });
  const d = `M ${pts.join(" L ")}`;
  return (
    <Stage>
      <Heading kicker="Example 5 · TMFOP011" title="Carbon-aware scaling" color={C.carbon} />
      <Appear at={5.2} from="pop" style={{ left: 1420, top: 200 }}>
        <Pill color={C.carbon} fontSize={26}>Experimental</Pill>
      </Appear>
      <Appear at={10.0} from="up" style={{ left: CH.x, top: CH.y - 60 }}>
        <div style={{ fontSize: 24, color: C.muted, fontWeight: 700 }}>Grid carbon intensity (gCO₂eq/kWh) · from TMF628</div>
      </Appear>
      <Svg>
        <line x1={CH.x} y1={CH.y + CH.h} x2={CH.x + CH.w} y2={CH.y + CH.h} stroke={C.faint} strokeWidth={2} opacity={t > 10 ? 1 : 0} />
        <Draw d={d} at={10.4} dur={6.6} color={C.carbon} width={5} />
        <line x1={CH.x} y1={CH.y + CH.h - 0.6 * CH.h} x2={CH.x + CH.w} y2={CH.y + CH.h - 0.6 * CH.h} stroke={C.danger} strokeWidth={2} strokeDasharray="10 10" opacity={interpolate(t, [11, 11.6], [0, 1], clamp)} />
      </Svg>
      <Appear at={11.0} from="left" style={{ left: CH.x + CH.w - 300, top: CH.y + CH.h - 0.6 * CH.h - 44 }}>
        <div style={{ fontSize: 22, color: C.danger, fontWeight: 700 }}>carbon-intensive</div>
      </Appear>
      <Appear at={7.6} from="up" style={{ left: 110, top: 690 }}>
        <Tile label="carbon-aware" sub="workload" icon="leaf" color={C.carbon} w={300} h={110} fontSize={28} />
      </Appear>
      {Array.from({ length: HOURS }, (_, h) => {
        const shown = sweep * HOURS > h;
        const high = intensity(h + 0.5) > 0.6;
        const replicas = high ? 1 : intensity(h + 0.5) > 0.45 ? 2 : 3;
        return (
          <div key={h} style={{ position: "absolute", left: CH.x + (h / HOURS) * CH.w + 8, top: 700, width: CH.w / HOURS - 16, display: "flex", flexDirection: "column-reverse", gap: 6, opacity: shown ? 1 : 0 }}>
            {Array.from({ length: replicas }, (_, r) => (
              <div key={r} style={{ height: 34, borderRadius: 6, background: high ? `${C.carbon}55` : C.carbon }} />
            ))}
          </div>
        );
      })}
      <Appear at={12.0} from="up" style={{ left: CH.x, top: 840 }}>
        <div style={{ fontSize: 24, color: C.muted, fontWeight: 700 }}>Replicas allowed · scaled by KEDA · no code changes</div>
      </Appear>
      <Caption at={17.6} bottom={60} color={C.carbon}>
        There's a dedicated video on carbon-aware software
      </Caption>
    </Stage>
  );
};
