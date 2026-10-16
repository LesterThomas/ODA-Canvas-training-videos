import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "../theme";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 progress for an entrance that starts `at` seconds in and lasts `dur` seconds. */
export const useProg = (at: number, dur = 0.8, easing = EASE) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [at * fps, (at + dur) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

/** Seconds elapsed in the current composition. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** Dark "3Blue1Brown-style" stage with a soft glow and a faint dot grid. */
export const Stage: React.FC<{
  children?: React.ReactNode;
  glow?: string;
}> = ({ children, glow = C.bgGlow }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.bg,
      backgroundImage: `radial-gradient(ellipse 70% 60% at 50% 45%, ${glow} 0%, ${C.bg} 70%), radial-gradient(${C.grid} 1.5px, transparent 1.5px)`,
      backgroundSize: "100% 100%, 48px 48px",
      fontFamily: FONT,
      color: C.text,
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Slide heading: a small coloured kicker over a large title, top-left inside the safe area. */
export const Heading: React.FC<{
  kicker?: string;
  title: string;
  color?: string;
  at?: number;
}> = ({ kicker, title, color = C.tmf, at = 0 }) => {
  const p = useProg(at, 0.9);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: 84,
        opacity: p,
        translate: `${interpolate(p, [0, 1], [-40, 0])}px 0px`,
      }}
    >
      {kicker ? (
        <div
          style={{
            color,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -1 }}>
        {title}
      </div>
    </div>
  );
};

type Dir = "up" | "down" | "left" | "right" | "none" | "pop";

/** Generic entrance wrapper: fade plus a short slide or pop. */
export const Appear: React.FC<{
  at: number;
  dur?: number;
  from?: Dir;
  dist?: number;
  out?: number; // optional exit time (seconds)
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, dur = 0.8, from = "up", dist = 40, out, style, children }) => {
  const p = useProg(at, dur);
  const o = useProg(out ?? 1e6, 0.6);
  const dx = from === "left" ? -dist : from === "right" ? dist : 0;
  const dy = from === "up" ? dist : from === "down" ? -dist : 0;
  return (
    <div
      style={{
        position: "absolute",
        opacity: p * (1 - o),
        translate: `${dx * (1 - p)}px ${dy * (1 - p)}px`,
        scale: from === "pop" ? String(interpolate(p, [0, 1], [0.6, 1])) : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Rounded concept tile with an icon and label. */
export const Tile: React.FC<{
  label: string;
  sub?: string;
  color: string;
  icon?: IconName;
  w?: number;
  h?: number;
  fontSize?: number;
  filled?: boolean;
  glow?: number; // 0..1 highlight
  dim?: number; // 0..1 dimming
  style?: React.CSSProperties;
}> = ({
  label,
  sub,
  color,
  icon,
  w = 300,
  h = 110,
  fontSize = 30,
  filled = false,
  glow = 0,
  dim = 0,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 18,
      border: `3px solid ${color}`,
      background: filled ? color : `${color}1F`,
      color: filled ? C.bg : C.text,
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "0 24px",
      boxShadow: glow > 0 ? `0 0 ${60 * glow}px ${color}` : "none",
      opacity: 1 - dim * 0.7,
      ...style,
    }}
  >
    {icon ? <Icon name={icon} size={Math.min(52, h * 0.5)} color={filled ? C.bg : color} /> : null}
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
      <div style={{ fontSize, fontWeight: 700 }}>{label}</div>
      {sub ? (
        <div style={{ fontSize: fontSize * 0.72, color: filled ? C.bg : C.muted, fontWeight: 500 }}>
          {sub}
        </div>
      ) : null}
    </div>
  </div>
);

/** A Lego-style brick: the recurring "ODA Component" motif. */
export const Brick: React.FC<{
  w?: number;
  color?: string;
  studs?: number;
  label?: string;
  sub?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ w = 360, color = C.component, studs = 4, label, sub, fontSize, style }) => {
  const h = w * 0.42;
  const studW = (w / studs) * 0.52;
  const studH = w * 0.07;
  const fs = fontSize ?? w * 0.085;
  return (
    <div style={{ position: "relative", width: w, height: h + studH, ...style }}>
      {Array.from({ length: studs }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: (w / studs) * i + (w / studs - studW) / 2,
            width: studW,
            height: studH + 6,
            borderRadius: "10px 10px 0 0",
            background: color,
            filter: "brightness(1.12)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: studH,
          left: 0,
          width: w,
          height: h,
          borderRadius: 14,
          background: `linear-gradient(180deg, ${color} 0%, ${color} 70%, rgba(0,0,0,0.25) 140%)`,
          boxShadow: `inset 0 -${h * 0.12}px 0 rgba(0,0,0,0.18), 0 18px 40px rgba(0,0,0,0.45)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: color === C.agent ? C.bg : "#1B1300",
          textAlign: "center",
          lineHeight: 1.1,
          padding: "0 12px",
          boxSizing: "border-box",
        }}
      >
        {label ? <div style={{ fontSize: fs, fontWeight: 800 }}>{label}</div> : null}
        {sub ? <div style={{ fontSize: fs * 0.72, fontWeight: 700, opacity: 0.8, marginTop: 4 }}>{sub}</div> : null}
      </div>
    </div>
  );
};

/** A rotating gear: the recurring "Canvas operator" motif. */
export const Gear: React.FC<{
  size?: number;
  color?: string;
  spin?: number; // degrees per second
  style?: React.CSSProperties;
}> = ({ size = 120, color = C.operator, spin = 40, style }) => {
  const t = useT();
  const teeth = 10;
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? 50 : 40;
    const a1 = ((i - 0.35) / (teeth * 2)) * Math.PI * 2;
    const a2 = ((i + 0.35) / (teeth * 2)) * Math.PI * 2;
    pts.push(`${50 + r * Math.cos(a1)},${50 + r * Math.sin(a1)}`);
    pts.push(`${50 + r * Math.cos(a2)},${50 + r * Math.sin(a2)}`);
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ rotate: `${t * spin}deg`, ...style }}
    >
      <polygon points={pts.join(" ")} fill={color} />
      <circle cx={50} cy={50} r={15} fill={C.bg} />
    </svg>
  );
};

/** An SVG path that draws itself on, with an optional arrowhead. Place inside <Svg>. */
export const Draw: React.FC<{
  d: string;
  at: number;
  dur?: number;
  color?: string;
  width?: number;
  arrow?: boolean;
  dash?: boolean;
  opacity?: number;
}> = ({ d, at, dur = 0.8, color = C.muted, width = 4, arrow = false, dash = false, opacity = 1 }) => {
  const p = useProg(at, dur, EASE_IN_OUT);
  const id = `ah-${color.replace("#", "")}`;
  return (
    <>
      {arrow ? (
        <defs>
          <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={dash ? "0.02 0.02" : `${p} 1`}
        opacity={dash ? p * opacity : p > 0 ? opacity : 0}
        markerEnd={arrow && p > 0.97 ? `url(#${id})` : undefined}
      />
    </>
  );
};

/** Full-frame SVG overlay for connectors. */
export const Svg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    {children}
  </svg>
);

/** Caption bar along the bottom of the frame. */
export const Caption: React.FC<{ at: number; children: React.ReactNode; color?: string; bottom?: number }> = ({
  at,
  children,
  color = C.text,
  bottom = 90,
}) => {
  const p = useProg(at, 0.8);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        textAlign: "center",
        fontSize: 40,
        fontWeight: 600,
        color,
        opacity: p,
        translate: `0px ${(1 - p) * 20}px`,
      }}
    >
      {children}
    </div>
  );
};

/** Small pill label. */
export const Pill: React.FC<{ children: React.ReactNode; color: string; style?: React.CSSProperties; fontSize?: number }> = ({
  children,
  color,
  style,
  fontSize = 26,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 20px",
      borderRadius: 999,
      background: `${color}26`,
      border: `2px solid ${color}`,
      color: C.text,
      fontSize,
      fontWeight: 600,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export type CodeLine = { text: string; indent?: number; color?: string };

/** Monospace code panel. Lines appear one by one from `at`; `focus` highlights a line range. */
export const Code: React.FC<{
  lines: CodeLine[];
  at: number;
  perLine?: number;
  fontSize?: number;
  width?: number;
  title?: string;
  focus?: { from: number; to: number; color: string } | null;
  style?: React.CSSProperties;
}> = ({ lines, at, perLine = 0.12, fontSize = 26, width = 760, title, focus, style }) => {
  const t = useT();
  const lh = fontSize * 1.5;
  return (
    <div
      style={{
        width,
        background: "#0D1426",
        border: `2px solid ${C.panelEdge}`,
        borderRadius: 18,
        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: `2px solid ${C.panelEdge}`,
          fontFamily: MONO,
          fontSize: 22,
          color: C.muted,
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 7, background: "#FF5F57" }} />
        <span style={{ width: 14, height: 14, borderRadius: 7, background: "#FEBC2E" }} />
        <span style={{ width: 14, height: 14, borderRadius: 7, background: "#28C840" }} />
        <span style={{ marginLeft: 12 }}>{title}</span>
      </div>
      <div style={{ position: "relative", padding: "16px 0" }}>
        {focus ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 16 + focus.from * lh,
              height: (focus.to - focus.from + 1) * lh,
              background: `${focus.color}2E`,
              borderLeft: `6px solid ${focus.color}`,
            }}
          />
        ) : null}
        {lines.map((l, i) => {
          const p = interpolate(t, [at + i * perLine, at + i * perLine + 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                position: "relative",
                fontFamily: MONO,
                fontSize,
                height: lh,
                lineHeight: `${lh}px`,
                paddingLeft: 28 + (l.indent ?? 0) * fontSize * 1.2,
                color: l.color ?? C.text,
                opacity: p,
                whiteSpace: "pre",
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

/** Browser-style frame around a portal screenshot. */
export const BrowserFrame: React.FC<{ children?: React.ReactNode; url: string; style?: React.CSSProperties }> = ({
  children,
  url,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
      border: `2px solid ${C.panelEdge}`,
      ...style,
    }}
  >
    <div
      style={{
        height: 54,
        background: "#E9ECF2",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 20px",
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#FF5F57" }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#FEBC2E" }} />
      <span style={{ width: 14, height: 14, borderRadius: 7, background: "#28C840" }} />
      <div
        style={{
          marginLeft: 20,
          flex: 1,
          height: 34,
          borderRadius: 17,
          background: "#fff",
          color: "#556",
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          fontFamily: FONT,
        }}
      >
        {url}
      </div>
    </div>
    <div style={{ position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export type IconName =
  | "person"
  | "people"
  | "cube"
  | "shield"
  | "lock"
  | "key"
  | "chart"
  | "gateway"
  | "bell"
  | "leaf"
  | "coin"
  | "spark"
  | "doc"
  | "cloud"
  | "server"
  | "link"
  | "gear"
  | "check"
  | "globe"
  | "rocket"
  | "wrench"
  | "flask"
  | "smile"
  | "layers"
  | "bolt"
  | "database"
  | "trace"
  | "handshake";

/** Minimal line-icon set (24×24, stroke-based) so every scene shares one visual language. */
export const Icon: React.FC<{ name: IconName; size?: number; color?: string; stroke?: number }> = ({
  name,
  size = 40,
  color = C.text,
  stroke = 2,
}) => {
  const p = {
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const g: Record<IconName, React.ReactNode> = {
    person: (
      <>
        <circle cx={12} cy={7} r={4} {...p} />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" {...p} />
      </>
    ),
    people: (
      <>
        <circle cx={9} cy={8} r={3.5} {...p} />
        <path d="M2 20c0-3.8 3-6 7-6s7 2.2 7 6" {...p} />
        <circle cx={17} cy={7} r={3} {...p} />
        <path d="M17 13c3 0 5 1.8 5 5" {...p} />
      </>
    ),
    cube: (
      <>
        <path d="M12 2 21 7v10l-9 5-9-5V7z" {...p} />
        <path d="M3 7l9 5 9-5M12 12v10" {...p} />
      </>
    ),
    shield: (
      <>
        <path d="M12 2 20 5v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" {...p} />
        <path d="M8.5 12l2.5 2.5 4.5-5" {...p} />
      </>
    ),
    lock: (
      <>
        <rect x={4} y={10} width={16} height={11} rx={2} {...p} />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" {...p} />
      </>
    ),
    key: (
      <>
        <circle cx={7.5} cy={15.5} r={4.5} {...p} />
        <path d="M10.7 12.3 20 3M16 7l3 3M14 9l2 2" {...p} />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" {...p} />
        <path d="M7 15l4-5 3 3 5-7" {...p} />
      </>
    ),
    gateway: (
      <>
        <path d="M3 12h18M15 6l6 6-6 6M9 6 3 12l6 6" {...p} />
      </>
    ),
    bell: (
      <>
        <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" {...p} />
        <path d="M10 21h4" {...p} />
      </>
    ),
    leaf: (
      <>
        <path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" {...p} />
        <path d="M4 20 14 10" {...p} />
      </>
    ),
    coin: (
      <>
        <circle cx={12} cy={12} r={9} {...p} />
        <path d="M14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.7 0-2.8.9-2.8 2.1 0 2.9 5.6 1.6 5.6 4.6 0 1.2-1.2 2.3-2.8 2.3-1.2 0-2.2-.6-2.7-1.6M12 6v1.5M12 16.5V18" {...p} />
      </>
    ),
    spark: (
      <>
        <path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z" {...p} />
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" {...p} />
      </>
    ),
    doc: (
      <>
        <path d="M6 2h9l5 5v15H6z" {...p} />
        <path d="M15 2v5h5M9 12h8M9 16h8" {...p} />
      </>
    ),
    cloud: <path d="M7 19a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 19 9.5a4.8 4.8 0 0 1-1 9.5z" {...p} />,
    server: (
      <>
        <rect x={3} y={3} width={18} height={7} rx={2} {...p} />
        <rect x={3} y={14} width={18} height={7} rx={2} {...p} />
        <path d="M7 6.5h.01M7 17.5h.01" {...p} />
      </>
    ),
    link: (
      <>
        <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5" {...p} />
        <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5" {...p} />
      </>
    ),
    gear: (
      <>
        <circle cx={12} cy={12} r={3.5} {...p} />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" {...p} />
      </>
    ),
    check: <path d="M4 12.5 9.5 18 20 6" {...p} />,
    globe: (
      <>
        <circle cx={12} cy={12} r={9} {...p} />
        <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" {...p} />
      </>
    ),
    rocket: (
      <>
        <path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 15l-3-3c2-5 6-9 13-9 0 7-4 11-9 13z" {...p} />
        <circle cx={15} cy={9} r={1.8} {...p} />
      </>
    ),
    wrench: <path d="M14.5 3.5a5 5 0 0 0-5.8 6.8L3 16v5h5l5.7-5.7a5 5 0 0 0 6.8-5.8l-3 3-3-1-1-3z" {...p} />,
    flask: (
      <>
        <path d="M9 2h6M10 2v6L4 19a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 19l-6-11V2" {...p} />
        <path d="M7 15h10" {...p} />
      </>
    ),
    smile: (
      <>
        <circle cx={12} cy={12} r={9} {...p} />
        <path d="M8 14c1 1.5 2.4 2.2 4 2.2s3-.7 4-2.2M9 9.5h.01M15 9.5h.01" {...p} />
      </>
    ),
    layers: (
      <>
        <path d="M12 3 2 8l10 5 10-5z" {...p} />
        <path d="M2 13l10 5 10-5M2 17.5l10 5 10-5" {...p} />
      </>
    ),
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" {...p} />,
    database: (
      <>
        <ellipse cx={12} cy={5} rx={8} ry={3} {...p} />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" {...p} />
      </>
    ),
    trace: (
      <>
        <path d="M3 6h8M7 12h10M11 18h10" {...p} />
        <circle cx={3} cy={6} r={0.6} {...p} />
      </>
    ),
    handshake: (
      <>
        <path d="M2 12l4-4 4 2 3-2 3 0 6 4" {...p} />
        <path d="M6 8v7l5 4 2-1 2 1 3-3 4-4M10 14l2 2M13 12l3 3" {...p} />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {g[name]}
    </svg>
  );
};
