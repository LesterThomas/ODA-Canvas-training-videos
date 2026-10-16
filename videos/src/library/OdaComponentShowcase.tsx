import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { OdaComponent } from "../lib/OdaComponent";
import { Stage } from "../lib/ui";

// Reference sheet for the standard ODA Component symbol: the original PNG, the static SVG,
// and the animated Remotion component at several sizes. Use it to check the trace and to
// preview the build-up / highlight animations in Studio.
export const OdaComponentShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const build = interpolate(frame, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ifaces = interpolate(frame, [35, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hl = frame > 100 ? (["core", "security", "management"] as const)[Math.floor((frame - 100) / 30) % 3] : null;
  const label: React.CSSProperties = { position: "absolute", fontSize: 24, color: C.muted, fontWeight: 600 };
  return (
    <Stage>
      <div style={{ ...label, left: 60, top: 40 }}>Original PNG</div>
      <Img src={staticFile("oda-component-original.png")} style={{ position: "absolute", left: 40, top: 80, width: 560, background: "#fff", borderRadius: 12 }} />
      <div style={{ ...label, left: 660, top: 40 }}>Static SVG (images/ODA-Component.svg)</div>
      <div style={{ position: "absolute", left: 640, top: 80, width: 560, height: 495, background: "#fff", borderRadius: 12 }}>
        <Img src={staticFile("ODA-Component.svg")} style={{ width: 560 }} />
      </div>
      <div style={{ ...label, left: 1270, top: 40 }}>Remotion &lt;OdaComponent&gt; (animated)</div>
      <OdaComponent size={560} build={build} interfaces={ifaces} highlight={hl} style={{ position: "absolute", left: 1290, top: 80 }} />
      <div style={{ ...label, left: 60, top: 640 }}>Sizes: 320 (labels) · 200 · 120 · 64 (icon, no labels)</div>
      <OdaComponent size={320} variant="light" style={{ position: "absolute", left: 60, top: 690 }} />
      <OdaComponent size={200} labels={false} caption="Product Catalog" style={{ position: "absolute", left: 470, top: 720 }} />
      <OdaComponent size={120} labels={false} style={{ position: "absolute", left: 760, top: 760 }} />
      <OdaComponent size={64} labels={false} style={{ position: "absolute", left: 960, top: 790 }} />
    </Stage>
  );
};
