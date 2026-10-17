import React from "react";
import { Composition, Folder } from "remotion";
import { S04Frameworks, S05OpenApis, S06Gap } from "./intro/Seg2History";
import {
  S07Component,
  S08Canvas,
  S09ComposableIT,
  S10ComposableAI,
  S11Identity,
  S12Secrets,
} from "./intro/Seg3ComponentsCanvas";
import { S16Yaml, S17Operators, S18ApiExposure } from "./intro/Seg5Tour";
import { S21IdentityConfig, S22Observability } from "./intro/Seg5Portal";
import { S16Directory, S20Inventory, S21Deploy } from "./intro/Seg5Live";
import { OdaComponentShowcase } from "./library/OdaComponentShowcase";
import { IconAsset, OdaAsset, StageAsset } from "./library/Assets";

// Deck 01 — "Introduction to the ODA Canvas" (scripts/01-introduction-to-the-oda-canvas.md).
// One silent clip per *animated* slide; each duration roughly matches that slide's narration so the
// build-up tracks the voice-over, then the clip holds on its final frame. Slides 1–3, 13–15 and 24–27
// are native PowerPoint slides (tools/native/intro.py), so they have no composition here.
export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Folder name="Library">
      <Composition id="Lib-OdaComponent" component={OdaComponentShowcase} durationInFrames={190} fps={30} width={1920} height={1080} />
      {/* PNG assets for native PowerPoint slides (rendered by scripts/assets.mjs with input props) */}
      <Composition id="Asset-Stage" component={StageAsset} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ glow: "#16203A" }} />
      <Composition id="Asset-Icon" component={IconAsset} durationInFrames={1} fps={30} width={256} height={256} defaultProps={{ name: "spark" as const, color: "#F2F5FB" }} />
      <Composition id="Asset-Oda" component={OdaAsset} durationInFrames={1} fps={30} width={720} height={680} defaultProps={{ labels: false }} />
      <Composition id="Asset-OdaCrop" component={OdaAsset} durationInFrames={1} fps={30} width={440} height={502} defaultProps={{ labels: false, crop: true }} />
    </Folder>
    <Folder name="Intro-to-ODA-Canvas">
      <Composition id="Intro-04-Frameworks" component={S04Frameworks} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="Intro-05-OpenAPIs" component={S05OpenApis} durationInFrames={870} fps={30} width={1920} height={1080} />
      <Composition id="Intro-06-Gap" component={S06Gap} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-07-Component" component={S07Component} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-08-Canvas" component={S08Canvas} durationInFrames={630} fps={30} width={1920} height={1080} />
      <Composition id="Intro-09-ComposableIT" component={S09ComposableIT} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-10-ComposableAI" component={S10ComposableAI} durationInFrames={1050} fps={30} width={1920} height={1080} />
      <Composition id="Intro-11-Identity" component={S11Identity} durationInFrames={780} fps={30} width={1920} height={1080} />
      <Composition id="Intro-12-Secrets" component={S12Secrets} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-16-Directory" component={S16Directory} durationInFrames={1020} fps={30} width={1920} height={1080} />
      <Composition id="Intro-17-Yaml" component={S16Yaml} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-18-Operators" component={S17Operators} durationInFrames={870} fps={30} width={1920} height={1080} />
      <Composition id="Intro-19-ApiExposure" component={S18ApiExposure} durationInFrames={1080} fps={30} width={1920} height={1080} />
      <Composition id="Intro-20-PortalInventory" component={S20Inventory} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition id="Intro-21-PortalDeploy" component={S21Deploy} durationInFrames={630} fps={30} width={1920} height={1080} />
      <Composition id="Intro-22-IdentityConfig" component={S21IdentityConfig} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-23-Observability" component={S22Observability} durationInFrames={930} fps={30} width={1920} height={1080} />
    </Folder>
    </>
  );
};
