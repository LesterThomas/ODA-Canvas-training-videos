import React from "react";
import { interpolate, Sequence, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Appear, Gear, Pill, Stage, useProg, useT } from "../lib/ui";
import { CaptureClip, CaptureSegment } from "../lib/CaptureClip";
import { Terminal } from "../lib/Terminal";
import cliDeploy from "../../public/captures/cli-deploy.cli.json";

// Live-demo slides built from real recordings (demos/ → public/captures/). Segment times are
// capture seconds taken from <capture>.marks.json; rates speed up slow stretches so each slide
// tracks its narration.

const DIR = "tmforum.org/oda/directory/components-map";

// Slide 16 — Live demo: the ODA Component Directory (directory-tour capture)
const DIRECTORY_SEGMENTS: CaptureSegment[] = [
  { from: 1.2, to: 6.5, rate: 1, url: DIR, label: "ODA Component Directory · components map" },
  { from: 6.5, to: 12.8, rate: 1.15, label: "Grouped by domain, with the Canvas operators" },
  { from: 12.8, to: 20.3, rate: 1.5, url: `${DIR}/core-commerce-management/TMFC001`, label: "TMFC001 · Product Catalog Management" },
  { from: 20.3, to: 26.1, rate: 1.4, label: "YAML spec · conformance profile · CTK · reference implementation" },
  { from: 26.1, to: 32.35, rate: 1.6, label: "Exposed and dependent Open APIs" },
  { from: 32.35, to: 35.3, rate: 1.2, label: "Products certified against the component" },
  { from: 35.3, to: 40.2, rate: 2.2, url: DIR, label: "Back to the map" },
  { from: 40.2, to: 47.0, rate: 1.6, url: `${DIR}/core-commerce-management/TMFC005`, label: "TMFC005 · Product Inventory · same structure" },
];

export const S16Directory: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/directory-tour.webm" segments={DIRECTORY_SEGMENTS} width={1720} top={36} labelColor={C.component} />
  </Stage>
);

// Slide 20 — Live demo: the component inventory (portal-inventory capture)
const INVENTORY_SEGMENTS: CaptureSegment[] = [
  { from: 2.4, to: 4.6, rate: 1, url: "localhost:8090 · Canvas Portal · Dashboard", label: "Canvas Portal" },
  { from: 4.6, to: 7.4, rate: 1, url: "localhost:8090/components", label: "Components › Inventory" },
  { from: 7.4, to: 10.7, rate: 1.2, label: "Standard components, grouped by business domain" },
  { from: 10.7, to: 17.6, rate: 1.4, label: "Installed on this Canvas: Product Catalog Management" },
];

export const S20Inventory: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/portal-inventory.webm" segments={INVENTORY_SEGMENTS} width={1720} top={36} />
  </Stage>
);

// Slide 21 — Live demo: deploying a component (portal-deploy capture → real helm/kubectl output)
const DEPLOY_SEGMENTS: CaptureSegment[] = [
  { from: 5.6, to: 9.0, rate: 1.4, url: "localhost:8090/components/deploy", label: "Components › Deploy" },
  { from: 9.0, to: 14.0, rate: 2, label: "Install Helm Chart · reference-example-components" },
  { from: 14.0, to: 20.8, rate: 2.3, label: "Chart: productcatalog (TMFC001)" },
  { from: 20.8, to: 28.0, rate: 1.75, label: "Release name: r2" },
];
const DEPLOY_SWITCH = 12.0; // seconds: portal → terminal

const OPERATOR_CHIPS = [
  { label: "API operator → ExposedAPIs", color: C.api, at: 14.6 },
  { label: "Identity operator → roles", color: C.identity, at: 15.2 },
  { label: "Metrics endpoint → monitoring", color: C.observability, at: 15.8 },
];

export const S21Deploy: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useT();
  const out = interpolate(t, [DEPLOY_SWITCH - 0.4, DEPLOY_SWITCH + 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const term = useProg(DEPLOY_SWITCH, 0.6);
  return (
    <Stage>
      <Sequence durationInFrames={Math.round((DEPLOY_SWITCH + 0.3) * fps)} premountFor={fps}>
        <div style={{ position: "absolute", inset: 0, opacity: out }}>
          <CaptureClip src="captures/portal-deploy.webm" segments={DEPLOY_SEGMENTS} width={1720} top={36} />
        </div>
      </Sequence>
      <div style={{ position: "absolute", left: 80, top: 70, opacity: term, translate: `0px ${(1 - term) * 30}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
          <Gear size={64} color={C.operator} />
          <div style={{ fontSize: 50, fontWeight: 800 }}>…then the operators take over</div>
          <div style={{ fontSize: 26, color: C.muted, marginLeft: 12 }}>release r1 · same chart, deployed earlier</div>
        </div>
        <Terminal
          session={cliDeploy}
          starts={[DEPLOY_SWITCH + 0.5, DEPLOY_SWITCH + 2.6, DEPLOY_SWITCH + 4.4]}
          cps={36}
          fontSize={17}
          width={1760}
          height={470}
          highlight={["r1"]}
        />
      </div>
      {OPERATOR_CHIPS.map((c, i) => (
        <Appear key={c.label} at={c.at} from="up" style={{ left: 80 + i * 520, top: 700 }}>
          <Pill color={c.color} fontSize={28}>
            {c.label}
          </Pill>
        </Appear>
      ))}
    </Stage>
  );
};
