import React from "react";
import { Img, staticFile } from "remotion";
import { C, MONO } from "../theme";
import {
  Appear,
  BrowserFrame,
  Caption,
  Code,
  CodeLine,
  Draw,
  Gear,
  Heading,
  Icon,
  Pill,
  Stage,
  Svg,
  Tile,
  useProg,
  useT,
} from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Slide 15 — The component standard in two layers
const GOLDEN = [
  { id: "TMFC001", name: "Product Catalog" },
  { id: "TMFC002", name: "Product Order" },
  { id: "TMFC005", name: "Product Inventory" },
  { id: "TMFC031", name: "Bill Calculation" },
  { id: "TMFC043", name: "Fault Management" },
];

export const S15TwoLayers: React.FC = () => (
  <Stage>
    <Heading kicker="A tour of the Canvas" title="The component standard: two layers" color={C.component} />
    <Appear at={2.6} from="up" dist={60} style={{ left: 160, top: 730 }}>
      <div
        style={{
          width: 1600,
          height: 210,
          borderRadius: 24,
          background: `linear-gradient(180deg, ${C.panel} 0%, #0C1428 100%)`,
          border: `3px solid ${C.operator}`,
          boxSizing: "border-box",
          padding: "26px 40px",
        }}
      >
        <div style={{ fontSize: 30, color: C.operator, fontWeight: 800, letterSpacing: 3 }}>
          LAYER 1 · DESIGN PATTERNS
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 26 }}>
          <Appear at={4.2} from="up" style={{ position: "relative" }}>
            <Pill color={C.operator} fontSize={32}>Self-describing, modular software</Pill>
          </Appear>
          <Appear at={7.6} from="up" style={{ position: "relative" }}>
            <Pill color={C.identity} fontSize={32}>Security as code</Pill>
          </Appear>
          <Appear at={9.0} from="up" style={{ position: "relative" }}>
            <Pill color={C.observability} fontSize={32}>Management as code</Pill>
          </Appear>
        </div>
      </div>
    </Appear>
    <Appear at={11.0} from="left" style={{ left: 160, top: 290 }}>
      <div style={{ fontSize: 30, color: C.component, fontWeight: 800, letterSpacing: 3 }}>
        LAYER 2 · STANDARD “GOLDEN” COMPONENTS
      </div>
    </Appear>
    {GOLDEN.map((g, i) => (
      <Appear key={g.id} at={12.2 + i * 0.9} from="down" dist={160} style={{ left: 175 + i * 322, top: 360 }}>
        <div style={{ width: 290, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <OdaComponent size={230} labels={false} />
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{g.name}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.component }}>{g.id}</div>
        </div>
      </Appear>
    ))}
    <Appear at={19.8} from="up" style={{ left: 1180, top: 978 }}>
      <Pill color={C.tmf} fontSize={30}>
        <Icon name="globe" size={32} color={C.tmf} /> tmforum.org/oda/directory
      </Pill>
    </Appear>
  </Stage>
);

// Slide 16 — The component YAML
const YAML: CodeLine[] = [
  { text: "apiVersion: oda.tmforum.org/v1", color: C.muted },
  { text: "kind: Component", color: C.muted },
  { text: "spec:" },
  { text: "componentMetadata:", indent: 1, color: C.component },
  { text: "id: TMFC001", indent: 2 },
  { text: "name: productcatalogmanagement", indent: 2 },
  { text: "functionalBlock: CoreCommerce", indent: 2 },
  { text: "coreFunction:", indent: 1, color: C.api },
  { text: "exposedAPIs:", indent: 2 },
  { text: "- name: productcatalogmanagement  # TMF620", indent: 2 },
  { text: "  apiType: openapi", indent: 2 },
  { text: "dependentAPIs:", indent: 2 },
  { text: "- name: downstreamproductcatalog", indent: 2 },
  { text: "eventNotification:", indent: 1, color: C.events },
  { text: "publishedEvents: […]", indent: 2 },
  { text: "managementFunction:", indent: 1, color: C.observability },
  { text: "exposedAPIs:", indent: 2 },
  { text: "- name: metrics", indent: 2 },
  { text: "securityFunction:", indent: 1, color: C.identity },
  { text: "canvasSystemRole: Admin", indent: 2 },
  { text: "exposedAPIs:", indent: 2 },
  { text: "- name: userrolesandpermissions  # TMF672", indent: 2 },
];

const FOCUS = [
  { at: 6.2, from: 3, to: 6, color: C.component, label: "Metadata & functional scope" },
  { at: 10.6, from: 7, to: 10, color: C.api, label: "APIs it exposes" },
  { at: 12.6, from: 11, to: 12, color: C.api, label: "APIs it depends on" },
  { at: 14.4, from: 13, to: 14, color: C.events, label: "Events it uses" },
  { at: 15.8, from: 15, to: 17, color: C.observability, label: "Management & metrics" },
  { at: 17.4, from: 18, to: 21, color: C.identity, label: "Security roles" },
];

export const S16Yaml: React.FC = () => {
  const t = useT();
  const active = FOCUS.reduce((acc, f, i) => (t >= f.at ? i : acc), -1);
  const f = active >= 0 && t < 20.5 ? FOCUS[active] : null;
  return (
    <Stage>
      <Heading kicker="A tour of the Canvas" title="The component YAML" color={C.component} />
      <Appear at={0.6} from="left" style={{ left: 120, top: 236 }}>
        <Code
          lines={YAML}
          at={0.8}
          perLine={0.12}
          fontSize={21}
          width={900}
          title="component-productcatalog.yaml"
          focus={f ? { from: f.from, to: f.to, color: f.color } : null}
        />
      </Appear>
      <Appear at={3.0} from="right" style={{ left: 1120, top: 250 }}>
        <Pill color={C.api} fontSize={32}>
          <Icon name="doc" size={34} color={C.api} /> “Swagger for a whole component”
        </Pill>
      </Appear>
      {FOCUS.map((x, i) => (
        <Appear key={x.label} at={x.at} from="right" style={{ left: 1120, top: 360 + i * 92 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 34,
              fontWeight: i === active ? 800 : 600,
              color: i === active ? C.text : C.muted,
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 11, background: x.color }} />
            {x.label}
          </div>
        </Appear>
      ))}
      <Appear at={21.0} from="pop" style={{ left: 1120, top: 930 }}>
        <Pill color={C.ok} fontSize={32}>
          <Icon name="check" size={34} color={C.ok} /> Spec v1 · generally available, Dec 2024
        </Pill>
      </Appear>
    </Stage>
  );
};

// Slide 17 — The Canvas as a set of operators
const SUBS = [
  { kind: "ExposedAPI", op: "API operator", color: C.api, at: 13.6 },
  { kind: "DependentAPI", op: "Dependency operator", color: C.api, at: 14.6 },
  { kind: "IdentityConfig", op: "Identity Config operator", color: C.identity, at: 15.6 },
  { kind: "SecretsManagement", op: "Secrets operator", color: C.secrets, at: 16.8 },
  { kind: "PublishedNotification", op: "Event operator", color: C.events, at: 17.6 },
];

export const S17Operators: React.FC = () => {
  const dim = useProg(22.0, 0.8);
  const shot = useProg(22.3, 1.2);
  return (
    <Stage>
      <Heading kicker="A tour of the Canvas" title="The Canvas is a set of operators" color={C.operator} />
      <div style={{ opacity: 1 - dim * 0.65 }}>
        <Appear at={3.2} from="pop" style={{ left: 120, top: 260 }}>
          <Pill color={C.operator} fontSize={28}>Kubernetes operator pattern</Pill>
        </Appear>
        <Appear at={8.0} from="up" style={{ left: 120, top: 470 }}>
          <Tile label="Component" sub="component.yaml" color={C.component} iconNode={<OdaComponent size={56} crop />} w={300} h={130} fontSize={36} />
        </Appear>
        <Appear at={9.4} from="pop" style={{ left: 490, top: 455 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Gear size={160} color={C.operator} />
            <div style={{ fontSize: 24, fontWeight: 700, color: C.operator, width: 260, textAlign: "center" }}>
              Component Management
            </div>
          </div>
        </Appear>
        <Svg>
          <Draw d="M 425 535 L 485 535" at={9.2} color={C.operator} arrow />
          {SUBS.map((s, i) => (
            <Draw key={s.kind} d={`M 665 535 C 720 535, 720 ${325 + i * 128}, 790 ${325 + i * 128}`} at={s.at - 0.4} dur={0.5} color={s.color} width={3} arrow />
          ))}
          {SUBS.map((s, i) => (
            <Draw key={`o${s.kind}`} d={`M 1250 ${325 + i * 128} L 1330 ${325 + i * 128}`} at={18.6 + i * 0.25} dur={0.4} color={s.color} width={3} arrow />
          ))}
        </Svg>
        {SUBS.map((s, i) => (
          <Appear key={s.kind} at={s.at} from="left" style={{ left: 800, top: 280 + i * 128 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 26,
                width: 440,
                padding: "18px 22px",
                borderRadius: 14,
                background: `${s.color}1F`,
                border: `2px solid ${s.color}`,
                boxSizing: "border-box",
              }}
            >
              kind: {s.kind}
            </div>
          </Appear>
        ))}
        {SUBS.map((s, i) => (
          <Appear key={`g${s.kind}`} at={18.8 + i * 0.25} from="pop" style={{ left: 1345, top: 285 + i * 128 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Gear size={78} color={s.color} spin={60} />
              <div style={{ fontSize: 28, fontWeight: 700 }}>{s.op}</div>
            </div>
          </Appear>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: shot,
          translate: `0px ${(1 - shot) * 120}px`,
        }}
      >
        <BrowserFrame url="canvas-portal · Platform › Operators" style={{ left: 360, top: 222, width: 1200 }}>
          <Img src={staticFile("portal/operators.png")} style={{ width: 1200, display: "block" }} />
        </BrowserFrame>
      </div>
      <Caption at={23.4} bottom={36} color={C.operator}>
        Operational knowledge, captured in software
      </Caption>
    </Stage>
  );
};

// Slide 18 — Worked example: API exposure
const GATEWAYS = [
  { name: "Istio service mesh", tag: "default", at: 21.6 },
  { name: "Kong", at: 23.6 },
  { name: "Apache APISIX", at: 24.2 },
  { name: "Azure API Management", at: 25.6 },
  { name: "Google Apigee", at: 26.8 },
  { name: "Whale Cloud", at: 27.8 },
];

const POLICIES = [
  { label: "rate limit", at: 8.6 },
  { label: "API key", at: 9.8 },
  { label: "CORS", at: 10.8 },
  { label: "OpenAPI validation", at: 11.8 },
];

export const S18ApiExposure: React.FC = () => {
  const t = useT();
  // After 31s the active gateway cycles to show "only the operator changes".
  const cycle = t > 30.5 ? Math.floor((t - 30.5) / 0.9) % GATEWAYS.length : -1;
  return (
    <Stage>
      <Heading kicker="Worked example" title="API exposure" color={C.api} />
      <Appear at={2.6} from="left" style={{ left: 120, top: 270 }}>
        <Code
          at={2.8}
          perLine={0.15}
          fontSize={24}
          width={640}
          title="ExposedAPI"
          lines={[
            { text: "kind: ExposedAPI", color: C.muted },
            { text: "spec:" },
            { text: "name: productcatalogmanagement", indent: 1 },
            { text: "apiType: openapi", indent: 1 },
            { text: "path: /r1-pc/tmf-api/…/v4", indent: 1 },
            { text: "gatewayConfiguration:", indent: 1, color: C.api },
            { text: "rateLimit: { limit: 100 }", indent: 2 },
            { text: "apiKeyVerification: …", indent: 2 },
          ]}
        />
      </Appear>
      {POLICIES.map((p, i) => (
        <Appear key={p.label} at={p.at} from="pop" style={{ left: 120 + (i % 2) * 320, top: 730 + Math.floor(i / 2) * 76 }}>
          <Pill color={C.api} fontSize={28}>
            <Icon name="shield" size={28} color={C.api} /> {p.label}
          </Pill>
        </Appear>
      ))}
      <Svg>
        <Draw d="M 770 470 L 860 470" at={13.6} color={C.api} arrow />
        {GATEWAYS.map((g, i) => (
          <Draw
            key={g.name}
            d={`M 1060 470 C 1140 470, 1140 ${300 + i * 110}, 1230 ${300 + i * 110}`}
            at={15.8 + i * 0.2}
            dur={0.6}
            color={cycle === -1 || cycle === i ? C.api : C.faint}
            width={cycle === i ? 6 : 3}
            arrow
          />
        ))}
      </Svg>
      <Appear at={13.8} from="pop" style={{ left: 870, top: 375 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Gear size={180} color={C.api} />
          <div style={{ fontSize: 28, fontWeight: 800, color: C.api }}>API operator</div>
        </div>
      </Appear>
      {GATEWAYS.map((g, i) => (
        <Appear key={g.name} at={16 + i * 0.2} from="right" style={{ left: 1240, top: 255 + i * 110 }}>
          <Tile
            label={g.name}
            color={C.canvas}
            icon="gateway"
            w={560}
            h={90}
            fontSize={30}
            glow={(t >= g.at && t < g.at + 1.4) || cycle === i ? 0.7 : 0}
            dim={cycle !== -1 && cycle !== i ? 1 : 0}
          />
          {g.tag ? (
            <div style={{ position: "absolute", right: 22, top: 26 }}>
              <Pill color={C.ok} fontSize={20}>
                {g.tag}
              </Pill>
            </div>
          ) : null}
        </Appear>
      ))}
      <Caption at={31} bottom={60} color={C.api}>
        Same component · only the operator changes
      </Caption>
    </Stage>
  );
};

