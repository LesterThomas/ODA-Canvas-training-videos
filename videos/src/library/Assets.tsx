import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import { Icon, IconName, Stage } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Still "assets" rendered to PNG for native PowerPoint slides, so native and Remotion slides share
// one visual language. Rendered by `node scripts/assets.mjs` → videos/out/assets/*.png.
// Backgrounds are opaque; icons and symbols are transparent.

export type StageAssetProps = { glow: string };
export const StageAsset: React.FC<StageAssetProps> = ({ glow }) => <Stage glow={glow} />;

export type IconAssetProps = { name: IconName; color: string };
export const IconAsset: React.FC<IconAssetProps> = ({ name, color }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <Icon name={name} size={256} color={color} />
  </AbsoluteFill>
);

export type OdaAssetProps = { labels: boolean; mono?: string; agent?: boolean; crop?: boolean };
export const OdaAsset: React.FC<OdaAssetProps> = ({ labels, mono, agent, crop }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    <OdaComponent size={crop ? 440 : 720} labels={labels} mono={mono} agent={agent} crop={crop} />
  </AbsoluteFill>
);

export const ASSET_DEFAULT_GLOW = C.bgGlow;
