import React from "react";
import { interpolate } from "remotion";
import { C, MONO } from "../theme";
import { Appear, Caption, Draw, Heading, Icon, Pill, Stage, Svg, Tile, useProg, useT } from "../lib/ui";

const DocCard: React.FC<{ label: string; color: string; w?: number; tilt?: number; tint?: string }> = ({
  label,
  color,
  w = 300,
  tilt = 0,
  tint,
}) => (
  <div
    style={{
      width: w,
      height: w * 0.62,
      borderRadius: 16,
      background: tint ?? C.panel,
      border: `3px solid ${color}`,
      rotate: `${tilt}deg`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    }}
  >
    <Icon name="doc" size={w * 0.22} color={color} />
    <div style={{ fontSize: w * 0.1, fontWeight: 700, textAlign: "center" }}>{label}</div>
  </div>
);

const FRAMEWORKS = [
  { label: "Process", x: 330, color: C.component, at: 5.0 },
  { label: "Information", x: 810, color: C.observability, at: 6.0 },
  { label: "Functional", x: 1290, color: C.operator, at: 7.0 },
];

// Slide 4 — Frameworks and the problem of interpretation
export const S04Frameworks: React.FC = () => {
  const variants = [
    { x: 150, from: 0, tilt: -6, hue: "#3A2A10" },
    { x: 420, from: 0, tilt: 5, hue: "#2E2410" },
    { x: 690, from: 1, tilt: -4, hue: "#0F2A3A" },
    { x: 960, from: 1, tilt: 7, hue: "#102536" },
    { x: 1230, from: 2, tilt: -7, hue: "#0E2E28" },
    { x: 1500, from: 2, tilt: 4, hue: "#123328" },
  ];
  return (
    <Stage>
      <Heading kicker="History" title="Frameworks: a common language" opening />
      <Appear at={0.8} from="pop" style={{ left: 1540, top: 60 }}>
        <div
          style={{
            width: 250,
            height: 250,
            borderRadius: 125,
            border: `4px solid ${C.tmf}`,
            background: `${C.tmf}22`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 800 }}>25+</div>
          <div style={{ fontSize: 26, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>years of<br />TM Forum</div>
        </div>
      </Appear>
      {FRAMEWORKS.map((f) => (
        <Appear key={f.label} at={f.at} from="up" style={{ left: f.x, top: 330 }}>
          <DocCard label={`${f.label} framework`} color={f.color} />
        </Appear>
      ))}
      <Appear at={10.5} from="up" style={{ left: 1650, top: 380 }}>
        <div style={{ width: 200, fontSize: 30, color: C.muted, lineHeight: 1.3 }}>
          Human-readable.
          <br />
          Open to interpretation.
        </div>
      </Appear>
      <Svg>
        {variants.map((v, i) => {
          const f = FRAMEWORKS[v.from];
          const sx = f.x + 150;
          const ex = v.x + 110;
          return (
            <Draw
              key={i}
              d={`M ${sx} 520 C ${sx} 600, ${ex} 590, ${ex} 680`}
              at={15.5 + i * 0.25}
              color={f.color}
              width={3}
              arrow
            />
          );
        })}
      </Svg>
      {variants.map((v, i) => {
        const f = FRAMEWORKS[v.from];
        return (
          <Appear key={i} at={16 + i * 0.25} from="pop" style={{ left: v.x, top: 690 }}>
            <DocCard
              label={`Operator ${String.fromCharCode(65 + i)} variant`}
              color={f.color}
              w={220}
              tilt={v.tilt}
              tint={v.hue}
            />
          </Appear>
        );
      })}
      <Caption at={19.5} color={C.danger} bottom={60}>
        One standard → many slightly different versions
      </Caption>
    </Stage>
  );
};

const MILESTONES = [
  { year: "2013", label: "Experiments & hackathons", x: 360, at: 3.6 },
  { year: "Jan 2017", label: "Open API programme launched", x: 860, at: 7.6 },
];

const APIS = ["TMF620 Product Catalog", "TMF622 Product Ordering", "TMF641 Service Ordering", "TMF639 Resource Inventory", "TMF672 User Roles & Permissions"];

// Slide 5 — The Open API programme
export const S05OpenApis: React.FC = () => {
  const t = useT();
  const count = interpolate(t, [15.5, 19.5], [0, 1_000_000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const line = useProg(1.5, 7, (x) => x);
  return (
    <Stage>
      <Heading kicker="History" title="TM Forum Open APIs" />
      <div style={{ position: "absolute", left: 200, top: 410, width: 880 * line, height: 6, background: C.api, borderRadius: 3 }} />
      {MILESTONES.map((m) => (
        <Appear key={m.year} at={m.at} from="pop" style={{ left: m.x - 20, top: 393 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.api, boxShadow: `0 0 30px ${C.api}` }} />
          <div style={{ position: "absolute", top: -90, left: -60, width: 300, fontSize: 44, fontWeight: 800 }}>{m.year}</div>
          <div style={{ position: "absolute", top: 60, left: -60, width: 330, fontSize: 30, color: C.muted, lineHeight: 1.3 }}>
            {m.label}
          </div>
        </Appear>
      ))}
      <Appear at={10.5} from="right" style={{ left: 1200, top: 250 }}>
        <div style={{ fontSize: 28, color: C.api, fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>
          MACHINE-READABLE SPECS
        </div>
      </Appear>
      {APIS.map((a, i) => (
        <Appear key={a} at={11 + i * 0.35} from="right" style={{ left: 1200, top: 310 + i * 84 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 28,
              padding: "12px 22px",
              borderRadius: 12,
              background: `${C.api}1C`,
              border: `2px solid ${C.api}88`,
              width: 600,
            }}
          >
            {a}
          </div>
        </Appear>
      ))}
      <Appear at={15.3} from="up" style={{ left: 200, top: 600 }}>
        <div style={{ fontSize: 150, fontWeight: 800, color: C.text, letterSpacing: -4, lineHeight: 1 }}>
          {Math.round(count).toLocaleString("en-US")}
          {count >= 999_999 ? <span style={{ color: C.api }}>+</span> : null}
        </div>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 10 }}>
          downloads by tens of thousands of developers
        </div>
      </Appear>
      <Appear at={22.5} from="up" style={{ left: 1170, top: 790 }}>
        <div
          style={{
            padding: "26px 36px",
            borderRadius: 26,
            background: C.panel,
            border: `3px solid ${C.tmf}`,
            fontSize: 40,
            fontWeight: 700,
            width: 620,
          }}
        >
          “Which standard APIs do we need?”
        </div>
      </Appear>
    </Stage>
  );
};

const SYSTEMS = [
  { label: "CRM", x: 260, y: 330 },
  { label: "Billing", x: 640, y: 290 },
  { label: "Ordering", x: 1020, y: 340 },
  { label: "Inventory", x: 1400, y: 300 },
  { label: "Catalog", x: 420, y: 620 },
  { label: "Provisioning", x: 840, y: 650 },
  { label: "Assurance", x: 1260, y: 610 },
];
const LINKS: [number, number][] = [
  [0, 1], [0, 4], [1, 2], [1, 5], [2, 3], [2, 6], [3, 6], [4, 5], [5, 6], [0, 5], [1, 6], [4, 2], [3, 5],
];

// Slide 6 — The remaining gap
export const S06Gap: React.FC = () => {
  const t = useT();
  const shake = interpolate(t, [8.6, 9.2, 12.5, 13.5], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const red = useProg(8.8, 0.6);
  const hit = useProg(7.8, 1.0);
  return (
    <Stage>
      <Heading kicker="History" title="The remaining gap" />
      <Svg>
        {LINKS.map(([a, b], i) => {
          const A = SYSTEMS[a];
          const B = SYSTEMS[b];
          const ax = A.x + 120;
          const ay = A.y + 50;
          const bx = B.x + 120;
          const by = B.y + 50;
          return (
            <Draw
              key={i}
              d={`M ${ax} ${ay} C ${(ax + bx) / 2} ${ay - 120 + (i % 3) * 90}, ${(ax + bx) / 2} ${by + 100 - (i % 2) * 160}, ${bx} ${by}`}
              at={2.5 + i * 0.2}
              color={red > 0.5 ? `${C.danger}AA` : C.faint}
              width={3}
            />
          );
        })}
      </Svg>
      {SYSTEMS.map((s, i) => (
        <Appear key={s.label} at={1.5 + i * 0.25} from="pop" style={{ left: s.x, top: s.y }}>
          <div style={{ translate: `${Math.sin(t * 38 + i) * 9 * shake}px ${Math.cos(t * 31 + i * 2) * 6 * shake}px` }}>
            <Tile
              label={s.label}
              color={red > 0.5 ? C.danger : C.muted}
              icon="server"
              w={240}
              h={100}
              fontSize={28}
            />
          </div>
        </Appear>
      ))}
      <div
        style={{
          position: "absolute",
          left: interpolate(hit, [0, 1], [-400, 420]),
          top: 820,
          opacity: hit,
        }}
      >
        <Pill color={C.danger} fontSize={34}>
          <Icon name="rocket" size={36} color={C.danger} /> Upgrade one system…
        </Pill>
      </div>
      <Appear at={10.0} from="up" style={{ left: 1000, top: 828 }}>
        <div style={{ fontSize: 34, color: C.danger, fontWeight: 700 }}>…and they all move together</div>
      </Appear>
      <Appear at={15.0} from="up" style={{ left: 0, top: 920, width: 1920 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, alignItems: "center" }}>
          <div style={{ fontSize: 34, color: C.muted, marginRight: 10 }}>Still missing a standard way to</div>
          <Pill color={C.tmf} fontSize={34}>package</Pill>
          <Pill color={C.tmf} fontSize={34}>deploy</Pill>
          <Pill color={C.tmf} fontSize={34}>operate</Pill>
        </div>
      </Appear>
    </Stage>
  );
};
