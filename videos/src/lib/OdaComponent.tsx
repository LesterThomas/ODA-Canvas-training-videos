import React from "react";
import { FONT } from "../theme";

// The standard ODA Component symbol (hexagon with five capability segments, exposed-API
// lollipops and dependent-API sockets), traced from images/ODA-Component.png.
// Geometry mirrors .claude/skills/oda-canvas-video-generator/scripts/make_oda_component_svg.py,
// which writes the static images/ODA-Component.svg — change both together.

export const ODA_NAVY = "#1A2747";
export const ODA_SEGMENT_COLORS = {
  core: "#7E9E54",
  notification: "#FABB42",
  security: "#E0141D",
  environment: "#D3D4DA",
  management: "#6596CE",
} as const;
export type OdaSegment = keyof typeof ODA_SEGMENT_COLORS;
/** Interface/rim colour used on dark slide backgrounds, where navy strokes would disappear. */
export const ODA_DARK_LINE = "#DCE3F2";

const CX = 400;
const CY = 380;
const R = 245;
const V = Array.from({ length: 6 }, (_, i) => {
  const a = ((-90 + 60 * i) * Math.PI) / 180;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as const;
});
const SEGMENTS: { key: OdaSegment; pts: (readonly [number, number])[] }[] = [
  { key: "core", pts: [[CX, CY], V[5], V[0], V[1]] },
  { key: "notification", pts: [[CX, CY], V[1], V[2]] },
  { key: "security", pts: [[CX, CY], V[2], V[3]] },
  { key: "environment", pts: [[CX, CY], V[3], V[4]] },
  { key: "management", pts: [[CX, CY], V[4], V[5]] },
];
const LABELS: { key: OdaSegment; lines: string[]; x: number; y: number; fill: string }[] = [
  { key: "core", lines: ["Core", "Function"], x: 400, y: 228, fill: "#FFFFFF" },
  { key: "management", lines: ["Management", "/Operations"], x: 268, y: 378, fill: "#FFFFFF" },
  { key: "notification", lines: ["Notification", "/Reporting"], x: 535, y: 378, fill: ODA_NAVY },
  { key: "environment", lines: ["Environment", "Dependence/", "Requirements"], x: 320, y: 506, fill: ODA_NAVY },
  { key: "security", lines: ["Security"], x: 482, y: 512, fill: "#FFFFFF" },
];
type Iface = { a: number; b: number; t: number; kind: "api" | "dep" };
const INTERFACES: Iface[] = [
  { a: 5, b: 0, t: 0.32, kind: "api" }, { a: 5, b: 0, t: 0.65, kind: "dep" },
  { a: 0, b: 1, t: 0.38, kind: "api" }, { a: 0, b: 1, t: 0.68, kind: "dep" },
  { a: 1, b: 2, t: 0.34, kind: "api" }, { a: 1, b: 2, t: 0.62, kind: "dep" },
  { a: 2, b: 3, t: 0.3, kind: "api" }, { a: 2, b: 3, t: 0.63, kind: "dep" },
  { a: 4, b: 5, t: 0.33, kind: "api" }, { a: 4, b: 5, t: 0.66, kind: "dep" },
];
const STEM = 52;
const BALL_R = 19;
const CUP_R = 22;

// Centre badge: a data disc above an exposed-API lollipop and a dependent-API socket whose stems
// cross (the two interface symbols overlapped), as in the original artwork.
const HUB_DISC = { cx: CX, cy: CY - 28, rx: 25, ry: 6.5, h: 11 };
const HUB_IFACES: { bx: number; by: number; ang: number; len: number; r: number; kind: "api" | "dep" }[] = [
  { bx: CX - 11, by: CY + 62, ang: -104, len: 41, r: 12, kind: "api" },
  { bx: CX - 60, by: CY + 58, ang: -30, len: 70, r: 14, kind: "dep" },
];

/** Cup arc that opens away from the stem: centre c, outward direction n, radius r. */
const cupPath = (cx: number, cy: number, nx: number, ny: number, r: number) => {
  const tx = -ny;
  const ty = nx;
  const sx = cx + tx * r;
  const sy = cy + ty * r;
  const qx = cx - tx * r;
  const qy = cy - ty * r;
  const a0 = Math.atan2(sy - cy, sx - cx);
  const am = Math.atan2(-ny, -nx);
  const d = (((am - a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const sweep = Math.abs(d - Math.PI / 2) < 1e-6 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${qx} ${qy}`;
};

const MiniInterface: React.FC<(typeof HUB_IFACES)[number]> = ({ bx, by, ang, len, r, kind }) => {
  const nx = Math.cos((ang * Math.PI) / 180);
  const ny = Math.sin((ang * Math.PI) / 180);
  const ex = bx + nx * len;
  const ey = by + ny * len;
  const cx = ex + nx * r;
  const cy = ey + ny * r;
  return (
    <g>
      <line x1={bx} y1={by} x2={ex} y2={ey} />
      {kind === "api" ? <circle cx={cx} cy={cy} r={r} fill={ODA_SEGMENT_COLORS.environment} /> : <path d={cupPath(cx, cy, nx, ny, r)} />}
    </g>
  );
};

const ptsStr = (p: (readonly [number, number])[]) => p.map(([x, y]) => `${x},${y}`).join(" ");
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const Interface: React.FC<{ i: Iface; p: number; ballFill: string }> = ({ i, p, ballFill }) => {
  if (p <= 0) return null;
  const [ax, ay] = V[i.a];
  const [bx, by] = V[i.b];
  const px = ax + (bx - ax) * i.t;
  const py = ay + (by - ay) * i.t;
  const mx = (ax + bx) / 2 - CX;
  const my = (ay + by) / 2 - CY;
  const ln = Math.hypot(mx, my);
  const nx = mx / ln;
  const ny = my / ln;
  const ex = px + nx * STEM * p;
  const ey = py + ny * STEM * p;
  const tail = clamp01(p * 2 - 1); // ball/cup appear in the second half
  if (i.kind === "api") {
    return (
      <g>
        <line x1={px} y1={py} x2={ex} y2={ey} />
        {tail > 0 ? <circle cx={ex + nx * BALL_R} cy={ey + ny * BALL_R} r={BALL_R * tail} fill={ballFill} /> : null}
      </g>
    );
  }
  const cx = ex + nx * CUP_R;
  const cy = ey + ny * CUP_R;
  const tx = -ny;
  const ty = nx;
  const sx = cx + tx * CUP_R;
  const sy = cy + ty * CUP_R;
  const qx = cx - tx * CUP_R;
  const qy = cy - ty * CUP_R;
  const a0 = Math.atan2(sy - cy, sx - cx);
  const am = Math.atan2(-ny, -nx);
  const d = (((am - a0) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const sweep = Math.abs(d - Math.PI / 2) < 1e-6 ? 1 : 0;
  return (
    <g>
      <line x1={px} y1={py} x2={ex} y2={ey} />
      {tail > 0 ? (
        <path
          d={`M ${sx} ${sy} A ${CUP_R} ${CUP_R} 0 0 ${sweep} ${qx} ${qy}`}
          fill="none"
          pathLength={1}
          strokeDasharray={`${tail} 1`}
        />
      ) : null}
    </g>
  );
};

export type OdaComponentProps = {
  /** Rendered width in px (height follows the 720×680 aspect ratio). */
  size?: number;
  /** Show the five segment labels. Turn off below ~300 px, where they become unreadable. */
  labels?: boolean;
  /** 0→1: segments grow out of the centre one after another. */
  build?: number;
  /** 0→1: interfaces (lollipops = exposed APIs, sockets = dependent APIs) draw outward. */
  interfaces?: number;
  /** Emphasise one segment (glow) and dim the others by `dim`. */
  highlight?: OdaSegment | null;
  dim?: number;
  /** Optional caption under the symbol, e.g. a component name. */
  caption?: string;
  captionColor?: string;
  /** "dark" (default, for the dark video stage): light interfaces and a light rim.
   *  "light": the original navy-on-white look, for white slides and documents. */
  variant?: "dark" | "light";
  /** Fill every segment with one colour (e.g. C.agent white for agentic components). Hides labels. */
  mono?: string;
  /** Hexagon-only framing (no interfaces, tight bounds) for small inline icons in pills and tiles. */
  crop?: boolean;
  style?: React.CSSProperties;
};

export const OdaComponent: React.FC<OdaComponentProps> = ({
  size = 400,
  labels = true,
  build = 1,
  interfaces = 1,
  highlight = null,
  dim = 0.6,
  caption,
  captionColor = "#F2F5FB",
  variant = "dark",
  mono,
  crop = false,
  style,
}) => {
  const line = variant === "dark" ? ODA_DARK_LINE : ODA_NAVY;
  const viewBox = crop ? "170 118 460 524" : "40 40 720 680";
  const h = crop ? (size * 524) / 460 : (size * 680) / 720;
  const showLabels = labels && !mono && !crop;
  const showIfaces = !crop;
  const order: OdaSegment[] = ["core", "notification", "security", "environment", "management"];
  const segP = (k: OdaSegment) => clamp01(build * 1.6 - order.indexOf(k) * 0.15);
  const op = (k: OdaSegment) => (highlight && highlight !== k ? 1 - dim : 1);
  return (
    <div style={{ width: size, display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      <svg width={size} height={h} viewBox={viewBox} style={{ overflow: "visible" }}>
        {highlight ? (
          <defs>
            <filter id={`oda-glow-${highlight}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={ODA_SEGMENT_COLORS[highlight]} floodOpacity="0.9" />
            </filter>
          </defs>
        ) : null}
        <g stroke={line} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={highlight ? 1 - dim * 0.5 : 1}>
          {showIfaces && INTERFACES.map((i, k) => (
            <Interface key={k} i={i} p={clamp01(interfaces * 1.4 - k * 0.04)} ballFill={variant === "dark" ? ODA_NAVY : "#FFFFFF"} />
          ))}
        </g>
        <g stroke={ODA_NAVY} strokeWidth={6} strokeLinejoin="round">
          {SEGMENTS.map((s) => {
            const p = segP(s.key);
            return (
              <polygon
                key={s.key}
                points={ptsStr(s.pts)}
                fill={mono ?? ODA_SEGMENT_COLORS[s.key]}
                opacity={op(s.key) * p}
                style={{ transformOrigin: `${CX}px ${CY}px`, scale: String(0.6 + 0.4 * p) }}
                filter={highlight === s.key ? `url(#oda-glow-${highlight})` : undefined}
              />
            );
          })}
        </g>
        {variant === "dark" ? (
          <polygon points={ptsStr(V)} fill="none" stroke={ODA_DARK_LINE} strokeWidth={20} strokeLinejoin="round" opacity={clamp01(build * 2)} />
        ) : null}
        <polygon points={ptsStr(V)} fill="none" stroke={ODA_NAVY} strokeWidth={12} strokeLinejoin="round" opacity={clamp01(build * 2)} />
        <g opacity={clamp01(build * 3)}>
          {/* Grey hub, outline open over the Environment segment (90°→150°) so they read as one shape. */}
          <circle cx={CX} cy={CY} r={52} fill={ODA_SEGMENT_COLORS.environment} />
          <path
            d={`M ${CX} ${CY + 52} A 52 52 0 1 0 ${CX + 52 * Math.cos((150 * Math.PI) / 180)} ${CY + 52 * Math.sin((150 * Math.PI) / 180)}`}
            fill="none"
            stroke={ODA_NAVY}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <g fill="none" stroke={ODA_NAVY} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
            <path d={`M ${HUB_DISC.cx - HUB_DISC.rx} ${HUB_DISC.cy} v ${HUB_DISC.h} a ${HUB_DISC.rx} ${HUB_DISC.ry} 0 0 0 ${2 * HUB_DISC.rx} 0 v ${-HUB_DISC.h}`} fill="#E9E9EE" />
            <ellipse cx={HUB_DISC.cx} cy={HUB_DISC.cy} rx={HUB_DISC.rx} ry={HUB_DISC.ry} fill="#E9E9EE" />
            {HUB_IFACES.map((m, k) => (
              <MiniInterface key={k} {...m} />
            ))}
          </g>
        </g>
        {showLabels ? (
          <g fontFamily={FONT} fontSize={21} fontWeight={600} textAnchor="middle">
            {LABELS.map((l) => (
              <text key={l.key} fill={l.fill} opacity={op(l.key) * segP(l.key)}>
                {l.lines.map((line, i) => (
                  <tspan key={i} x={l.x} y={l.y - (l.lines.length - 1) * 12 + i * 25}>
                    {line}
                  </tspan>
                ))}
              </text>
            ))}
          </g>
        ) : null}
      </svg>
      {caption ? (
        <div style={{ marginTop: size * 0.03, fontSize: Math.max(22, size * 0.07), fontWeight: 800, color: captionColor, textAlign: "center" }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
};
