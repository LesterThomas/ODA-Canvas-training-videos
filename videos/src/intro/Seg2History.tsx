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

// Slide 4 — Frameworks: valuable for architecture and buying, but every integration paid a tax.
// Times follow the narration (words before each mention / 2.5).
const T4 = { arch: 12.0, rfp: 18.0, gap: 20.4, custom: 26.8, tax: 27.6 };

const Panel: React.FC<{ title: string; color: string; children?: React.ReactNode }> = ({ title, color, children }) => (
  <div
    style={{
      width: 500,
      height: 300,
      borderRadius: 20,
      background: C.panel,
      border: `3px solid ${color}`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      paddingTop: 26,
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 34, fontWeight: 800, textAlign: "center" }}>{title}</div>
    {children}
  </div>
);

export const S04Frameworks: React.FC = () => (
  <Stage>
    <Heading kicker="History" title="Frameworks: a common language" />
    <Appear at={0.8} from="pop" style={{ left: 1540, top: 40 }}>
      <div
        style={{
          width: 230,
          height: 230,
          borderRadius: 115,
          border: `4px solid ${C.tmf}`,
          background: `${C.tmf}22`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800 }}>25+</div>
        <div style={{ fontSize: 24, color: C.muted, textAlign: "center", lineHeight: 1.2 }}>years of<br />TM Forum</div>
      </div>
    </Appear>
    {FRAMEWORKS.map((f) => (
      <Appear key={f.label} at={f.at} from="up" style={{ left: f.x, top: 250 }}>
        <DocCard label={`${f.label} framework`} color={f.color} w={260} />
      </Appear>
    ))}
    <Appear at={T4.arch} from="pop" style={{ left: 1610, top: 330 }}>
      <Pill color={C.ok} fontSize={28}>✓ Very valuable</Pill>
    </Appear>
    <Svg>
      {/* Every framework feeds every use: one curved arrow from each card to each box below. */}
      {[460, 940, 1420].map((fx, i) =>
        [
          { cx: 370, at: T4.arch, color: C.ok, dash: false },
          { cx: 960, at: T4.rfp, color: C.ok, dash: false },
          { cx: 1550, at: T4.gap, color: C.danger, dash: true },
        ].map((t, j) => {
          const tx = t.cx + (i - 1) * 70;
          return (
            <Draw
              key={`${i}-${j}`}
              d={`M ${fx} 412 C ${fx} 490, ${tx} 470, ${tx} 552`}
              at={t.at - 0.4 + i * 0.15}
              color={t.color}
              width={3}
              dash={t.dash}
              arrow
            />
          );
        }),
      )}
    </Svg>
    <Appear at={T4.arch} from="up" style={{ left: 120, top: 560 }}>
      <Panel title="High-level architectures" color={C.ok}>
        <Icon name="layers" size={110} color={C.ok} />
        <div style={{ fontSize: 26, color: C.muted }}>Designed with a shared map</div>
      </Panel>
    </Appear>
    <Appear at={T4.rfp} from="up" style={{ left: 710, top: 560 }}>
      <Panel title="Product selection & RFPs" color={C.ok}>
        <Icon name="handshake" size={110} color={C.ok} />
        <div style={{ fontSize: 26, color: C.muted }}>Buyers and suppliers share terms</div>
      </Panel>
    </Appear>
    <Appear at={T4.gap} from="up" style={{ left: 1300, top: 560 }}>
      <Panel title="System integration" color={C.danger} />
    </Appear>
    <Appear at={T4.gap + 0.3} from="none" style={{ left: 1345, top: 650 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Icon name="server" size={90} color={C.text} />
        <div style={{ fontSize: 22, color: C.muted }}>System A</div>
      </div>
    </Appear>
    <Appear at={T4.gap + 0.3} from="none" style={{ left: 1655, top: 650 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Icon name="server" size={90} color={C.text} />
        <div style={{ fontSize: 22, color: C.muted }}>System B</div>
      </div>
    </Appear>
    <Svg>
      <Draw d="M 1445 695 L 1650 695" at={T4.gap + 0.8} color={C.danger} width={5} dash />
    </Svg>
    <Appear at={T4.custom} from="pop" style={{ left: 1512, top: 650 }}>
      <div style={{ background: C.bg, borderRadius: 40, padding: 6 }}>
        <Icon name="wrench" size={72} color={C.component} />
      </div>
    </Appear>
    <Appear at={T4.tax} from="pop" style={{ left: 1380, top: 795 }}>
      <Pill color={C.danger} fontSize={30}>Integration tax</Pill>
    </Appear>
    {[0, 1, 2].map((i) => (
      <Appear key={i} at={T4.tax + 0.4 + i * 0.35} from="down" style={{ left: 1660 + i * 36, top: 797 }}>
        <Icon name="coin" size={50} color={C.component} />
      </Appear>
    ))}
    <Caption at={T4.tax + 1.6} color={C.danger} bottom={50}>
      A common language, but every integration paid a tax
    </Caption>
  </Stage>
);

// Slide 5 — The Open API programme. Times follow the narration (words before each mention / 2.5).
// Figures as of September 2026, from TM Forum via the user.
const T5 = { y2013: 6.4, y2015: 8.4, specs: 9.6, downloads: 15.2, devs: 20.0, foundation: 22.8, integration: 28.0 };
const DOWNLOADS = 1_383_661;
const DEVELOPERS = 71_916;

const MILESTONES = [
  { year: "2013", label: "Experiments & hackathons", x: 360, at: T5.y2013 },
  { year: "2015", label: "Open API programme launched", x: 860, at: T5.y2015 },
];

const APIS = ["TMF620 Product Catalog", "TMF622 Product Ordering", "TMF641 Service Ordering", "TMF639 Resource Inventory", "TMF672 User Roles & Permissions"];

export const S05OpenApis: React.FC = () => {
  const t = useT();
  const ease = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x: number) => 1 - Math.pow(1 - x, 3) } as const;
  const downloads = interpolate(t, [T5.downloads + 0.3, T5.downloads + 4], [0, DOWNLOADS], ease);
  const devs = interpolate(t, [T5.devs + 0.2, T5.devs + 2.4], [0, DEVELOPERS], ease);
  const line = useProg(1.5, T5.y2015 - 1, (x) => x);
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
      <Appear at={T5.specs} from="right" style={{ left: 1200, top: 250 }}>
        <div style={{ fontSize: 28, color: C.api, fontWeight: 700, letterSpacing: 3, marginBottom: 16 }}>
          MACHINE-READABLE SPECS
        </div>
      </Appear>
      {APIS.map((a, i) => (
        <Appear key={a} at={T5.specs + 0.5 + i * 0.35} from="right" style={{ left: 1200, top: 310 + i * 84 }}>
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
      <Appear at={T5.downloads} from="up" style={{ left: 200, top: 590 }}>
        <div style={{ fontSize: 130, fontWeight: 800, color: C.text, letterSpacing: -4, lineHeight: 1 }}>
          {Math.round(downloads).toLocaleString("en-US")}
        </div>
        <div style={{ fontSize: 38, color: C.muted, marginTop: 10 }}>downloads · September 2026</div>
      </Appear>
      <Appear at={T5.devs} from="up" style={{ left: 200, top: 830 }}>
        <div style={{ fontSize: 60, fontWeight: 800, color: C.api }}>
          {Math.round(devs).toLocaleString("en-US")} <span style={{ fontSize: 38, color: C.muted, fontWeight: 600 }}>developers</span>
        </div>
      </Appear>
      <Appear at={T5.foundation} from="up" style={{ left: 1170, top: 760 }}>
        <div
          style={{
            padding: "24px 32px",
            borderRadius: 26,
            background: C.panel,
            border: `3px solid ${C.tmf}`,
            width: 640,
            height: 160,
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 800 }}>The foundation of telco IT</div>
        </div>
      </Appear>
      <Appear at={T5.integration} from="up" style={{ left: 1205, top: 845 }}>
        <div style={{ fontSize: 34, color: C.ok, fontWeight: 700 }}>✓ Seamless integration</div>
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
