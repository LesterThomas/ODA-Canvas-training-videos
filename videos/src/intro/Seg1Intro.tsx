import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";
import { Appear, Brick, Heading, Icon, Pill, Stage, useProg, useT } from "../lib/ui";

/** Canvas "base plate" that components click onto. */
export const Plate: React.FC<{ w?: number; label?: string; fontSize?: number; style?: React.CSSProperties }> = ({
  w = 720,
  label = "ODA Canvas",
  fontSize,
  style,
}) => (
  <div
    style={{
      width: w,
      height: w * 0.14,
      borderRadius: 16,
      background: `linear-gradient(180deg, ${C.canvas} 0%, #1E4FB8 100%)`,
      boxShadow: `0 0 80px ${C.canvas}66, inset 0 -10px 0 rgba(0,0,0,0.2)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: fontSize ?? w * 0.05,
      fontWeight: 800,
      letterSpacing: 2,
      color: C.text,
      ...style,
    }}
  >
    {label}
  </div>
);

// Slide 1 — Title card
export const S01Title: React.FC = () => {
  const drop = useProg(1.1, 1.0);
  const settle = useProg(2.0, 0.6);
  return (
    <Stage glow="#1B2550">
      <Appear at={0.2} from="up" dist={60} style={{ left: 1060, top: 640 }}>
        <Plate w={700} />
      </Appear>
      <div
        style={{
          position: "absolute",
          left: 1230,
          top: 470,
          opacity: drop,
          translate: `0px ${interpolate(drop, [0, 1], [-420, 0])}px`,
        }}
      >
        <Brick w={360} label="ODA Component" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1410,
          top: 620,
          width: 520 * settle,
          height: 520 * settle,
          translate: "-50% -50%",
          borderRadius: "50%",
          border: `4px solid ${C.tmf}`,
          opacity: (1 - settle) * 0.9,
        }}
      />
      <Appear at={1.6} from="left" style={{ left: 120, top: 330 }}>
        <div style={{ fontSize: 44, color: C.muted, fontWeight: 600 }}>Introduction to the</div>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>
          ODA <span style={{ color: C.tmf }}>Canvas</span>
        </div>
      </Appear>
      <Appear at={2.6} from="left" style={{ left: 124, top: 560 }}>
        <div style={{ fontSize: 36, color: C.muted, fontWeight: 500 }}>
          Open Digital Architecture · TM Forum
        </div>
      </Appear>
      <Appear at={3.4} from="up" style={{ left: 124, top: 660 }}>
        <Pill color={C.tmf}>Training series · Part 1</Pill>
      </Appear>
    </Stage>
  );
};

const PersonaCard: React.FC<{
  at: number;
  x: number;
  title: string;
  body: string;
  color: string;
  prop: React.ReactNode;
}> = ({ at, x, title, body, color, prop }) => (
  <Appear at={at} from="up" dist={60} style={{ left: x, top: 250 }}>
    <div
      style={{
        width: 760,
        height: 640,
        borderRadius: 28,
        background: C.panel,
        border: `3px solid ${color}`,
        boxShadow: `0 0 70px ${color}33`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 50,
        boxSizing: "border-box",
        gap: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 230 }}>
        <Icon name="person" size={190} color={color} stroke={1.6} />
        {prop}
      </div>
      <div style={{ fontSize: 52, fontWeight: 800, textAlign: "center" }}>{title}</div>
      <div style={{ fontSize: 34, color: C.muted, textAlign: "center", lineHeight: 1.35 }}>{body}</div>
    </div>
  </Appear>
);

// Slide 2 — Who this is for
export const S02Audiences: React.FC = () => {
  const divider = useProg(1.0, 1.2);
  return (
    <Stage>
      <Heading kicker="Who this is for" title="Two audiences, one platform" />
      <PersonaCard
        at={1.4}
        x={140}
        color={C.component}
        title="Component builders"
        body="Architects and software engineers building software components that meet the ODA standards"
        prop={<Brick w={200} studs={3} />}
      />
      <div
        style={{
          position: "absolute",
          left: 958,
          top: 260,
          width: 4,
          height: 620 * divider,
          background: `linear-gradient(${C.panelEdge}, transparent)`,
        }}
      />
      <PersonaCard
        at={12.5}
        x={1020}
        color={C.canvas}
        title="Canvas builders & operators"
        body="Architects, engineers and SREs building or operating a Canvas platform"
        prop={
          <div
            style={{
              width: 230,
              height: 46,
              borderRadius: 10,
              background: C.canvas,
              marginBottom: 20,
              boxShadow: `0 0 40px ${C.canvas}`,
            }}
          />
        }
      />
      <Appear at={19} from="up" style={{ left: 1020, top: 920, width: 760 }}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Pill color={C.canvas}>CSP-run Canvas</Pill>
          <Pill color={C.canvas}>Managed Canvas (cloud provider)</Pill>
        </div>
      </Appear>
    </Stage>
  );
};

const AGENDA: { label: string; at: number; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { label: "History", at: 1.2, icon: "doc" },
  { label: "Components and Canvas", at: 4.2, icon: "cube" },
  { label: "Business benefits", at: 8.6, icon: "rocket" },
  { label: "A tour of the Canvas and its Portal", at: 11.0, icon: "layers" },
  { label: "What's next", at: 15.6, icon: "spark" },
];

// Slide 3 — Roadmap of this video
export const S03Roadmap: React.FC = () => {
  const t = useT();
  const line = useProg(0.8, 15.5, (x) => x);
  const active = AGENDA.reduce((acc, a, i) => (t >= a.at ? i : acc), -1);
  return (
    <Stage>
      <Heading kicker="In this video" title="Roadmap" />
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 300,
          width: 6,
          height: 600,
          background: C.panelEdge,
          borderRadius: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 300,
          width: 6,
          height: 600 * line,
          background: C.tmf,
          borderRadius: 3,
        }}
      />
      {AGENDA.map((a, i) => {
        const isActive = i === active;
        return (
          <Appear key={a.label} at={a.at} from="left" style={{ left: 214, top: 270 + i * 140 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 39,
                  background: isActive ? C.tmf : C.panel,
                  border: `4px solid ${C.tmf}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </div>
              <Icon name={a.icon} size={60} color={isActive ? C.tmf : C.muted} />
              <div
                style={{
                  fontSize: isActive ? 60 : 50,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? C.text : C.muted,
                }}
              >
                {a.label}
              </div>
            </div>
          </Appear>
        );
      })}
      <Appear at={19.0} from="up" style={{ left: 1260, top: 880 }}>
        <Pill color={C.operator}>Deep dives on each area follow in later videos</Pill>
      </Appear>
    </Stage>
  );
};
