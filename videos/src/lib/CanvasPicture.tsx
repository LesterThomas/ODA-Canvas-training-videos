import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../theme";
import { Appear, Gear, useProg } from "./ui";

// The ODA Canvas picture (public/ODA-Canvas-dark.svg) and helpers to light up its modules, plus the
// labelled operator gear. Shared by every deck that shows the Canvas (house style: always use the picture).

// viewBox 10 180 1652 610; module boxes are in SVG units.
export type Box = { left: number; top: number; width: number; height: number };
export const canvasModule = (c: { left: number; top: number; w: number }) => {
  const s = c.w / 1652;
  return (x0: number, x1: number, y0: number, y1: number): Box => ({
    left: c.left + (x0 - 10) * s,
    top: c.top + (y0 - 180) * s,
    width: (x1 - x0) * s,
    height: (y1 - y0) * s,
  });
};
export const MODULES: Record<string, [number, number, number, number]> = {
  component: [110, 412, 326, 458],
  api: [490, 821, 326, 458],
  observability: [849, 1181, 326, 458],
  identity: [1205, 1556, 326, 458],
  data: [1205, 1556, 494, 626],
  model: [849, 1181, 494, 626],
  cost: [95, 425, 494, 626],
  carbon: [470, 805, 494, 626],
};

export const CanvasPicture: React.FC<{ left: number; top: number; w: number; at: number }> = ({ left, top, w, at }) => (
  <Appear at={at} from="up" dist={60} style={{ left, top }}>
    <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ width: w, display: "block" }} />
  </Appear>
);

export const Glow: React.FC<{ box: Box; color: string; at: number; label?: string; labelY?: number }> = ({ box, color, at, label, labelY }) => {
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
export const OpGear: React.FC<{ label: string; sub?: string; color: string; size?: number; width?: number }> = ({ label, sub, color, size = 110, width = 280 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width }}>
    <Gear size={size} color={color} />
    <div style={{ fontSize: 26, fontWeight: 800, color, textAlign: "center", lineHeight: 1.15 }}>{label}</div>
    {sub ? <div style={{ fontSize: 20, color: C.muted, textAlign: "center" }}>{sub}</div> : null}
  </div>
);

