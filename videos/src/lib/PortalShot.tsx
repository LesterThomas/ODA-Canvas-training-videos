import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { BrowserFrame, EASE_IN_OUT, useProg, useT } from "./ui";

// Fallback for portal demos when no live Playwright capture is possible: animate a camera move,
// cursor, highlight boxes and typed text over a static 1920×1080 screenshot (images/Canvas N.png).
// Prefer CaptureClip (real recordings from demos/) whenever the demo cluster is available.


const FRAME_W = 1500;
const S = FRAME_W / 1920; // screenshot → frame scale

type Box = { x: number; y: number; w: number; h: number };
const sb = (b: Box): React.CSSProperties => ({
  position: "absolute",
  left: b.x * S,
  top: b.y * S,
  width: b.w * S,
  height: b.h * S,
});

/** Highlight rectangle over a screenshot region, in screenshot pixel coordinates. */
export const Highlight: React.FC<{ box: Box; at: number; out?: number; color?: string; shade?: boolean }> = ({ box, at, out = 1e6, color = C.tmf, shade = true }) => {
  const t = useT();
  const p = interpolate(t, [at, at + 0.4, out, out + 0.4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        ...sb(box),
        border: `4px solid ${color}`,
        borderRadius: 12,
        boxShadow: shade ? `0 0 0 9999px rgba(10,15,30,${0.35 * p}), 0 0 30px ${color}` : `0 0 30px ${color}`,
        opacity: p,
        scale: String(interpolate(p, [0, 1], [1.08, 1])),
      }}
    />
  );
};

/** Animated mouse pointer moving between waypoints (screenshot coords), with click ripples. */
export const Cursor: React.FC<{ path: { at: number; x: number; y: number; click?: boolean }[] }> = ({ path }) => {
  const t = useT();
  const times = path.map((p) => p.at);
  const ease = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: EASE_IN_OUT };
  const x = interpolate(t, times, path.map((p) => p.x), ease);
  const y = interpolate(t, times, path.map((p) => p.y), ease);
  return (
    <>
      {path
        .filter((p) => p.click)
        .map((p) => {
          const r = interpolate(t, [p.at, p.at + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={p.at}
              style={{
                position: "absolute",
                left: p.x * S,
                top: p.y * S,
                width: 90 * r,
                height: 90 * r,
                translate: "-50% -50%",
                borderRadius: "50%",
                border: `4px solid ${C.tmf}`,
                opacity: r > 0 && r < 1 ? 1 - r : 0,
              }}
            />
          );
        })}
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", left: x * S - 6, top: y * S - 4 }}>
        <path d="M4 2l14 10-6.5 1.5L15 21l-3 1.5-3.5-7.5L4 19z" fill="#fff" stroke="#111" strokeWidth={1.4} />
      </svg>
    </>
  );
};

/** Text typed into a form field over the screenshot. */
export const Typed: React.FC<{ box: Box; text: string; at: number; cps?: number; cover?: boolean }> = ({ box, text, at, cps = 14, cover = true }) => {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps)));
  if (t < at - 0.05) return null;
  return (
    <div
      style={{
        ...sb(box),
        background: cover ? "#fff" : "transparent",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        paddingLeft: 14 * S,
        fontFamily: FONT,
        fontSize: 18 * S * 1.0 + 2,
        color: "#111827",
        boxSizing: "border-box",
        border: `2px solid #1677ff`,
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: Math.floor(t * 2) % 2 === 0 ? 1 : 0, marginLeft: 2 }}>|</span>
    </div>
  );
};

/** Screenshot inside a browser frame with a slow camera move towards `focus` (screenshot coords). */
export const PortalShot: React.FC<{
  src: string;
  url: string;
  zoomAt: number;
  zoomDur: number;
  zoom: number;
  focus: { x: number; y: number };
  children?: React.ReactNode;
}> = ({ src, url, zoomAt, zoomDur, zoom, focus, children }) => {
  const z = useProg(zoomAt, zoomDur, EASE_IN_OUT);
  const enter = useProg(0.2, 1.0);
  return (
    <div style={{ opacity: enter, translate: `0px ${(1 - enter) * 60}px` }}>
      <BrowserFrame url={url} style={{ left: (1920 - FRAME_W) / 2, top: 44, width: FRAME_W }}>
        <div
          style={{
            position: "relative",
            width: FRAME_W,
            height: 1080 * S,
            transformOrigin: `${focus.x * S}px ${focus.y * S}px`,
            scale: String(1 + (zoom - 1) * z),
          }}
        >
          <Img src={staticFile(src)} style={{ width: FRAME_W, display: "block" }} />
          {children}
        </div>
      </BrowserFrame>
    </div>
  );
};

