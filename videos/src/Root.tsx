import React from "react";
import { Composition, Folder } from "remotion";
import { S01Title, S02Audiences, S03Roadmap } from "./intro/Seg1Intro";
import { S04Frameworks, S05OpenApis, S06Gap } from "./intro/Seg2History";
import {
  S07Component,
  S08Canvas,
  S09ComposableIT,
  S10ComposableAI,
  S11Identity,
  S12Secrets,
} from "./intro/Seg3ComponentsCanvas";
import { S13Benefits, S14TenX } from "./intro/Seg4Benefits";
import { S15TwoLayers, S16Yaml, S17Operators, S18ApiExposure } from "./intro/Seg5Tour";
import {
  S19Inventory,
  S20Deploy,
  S21IdentityConfig,
  S22Observability,
  S23Status,
  S24Adoption,
} from "./intro/Seg5Portal";
import { S25Together, S26Next } from "./intro/Seg6Conclusion";

// Deck 01 — "Introduction to the ODA Canvas" (scripts/01-introduction-to-the-oda-canvas.md).
// One silent clip per slide; each duration roughly matches that slide's narration so the
// build-up tracks the voice-over, then the clip holds on its final frame.
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Intro-to-ODA-Canvas">
      <Composition id="Intro-01-Title" component={S01Title} durationInFrames={330} fps={30} width={1920} height={1080} />
      <Composition id="Intro-02-Audiences" component={S02Audiences} durationInFrames={840} fps={30} width={1920} height={1080} />
      <Composition id="Intro-03-Roadmap" component={S03Roadmap} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="Intro-04-Frameworks" component={S04Frameworks} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="Intro-05-OpenAPIs" component={S05OpenApis} durationInFrames={870} fps={30} width={1920} height={1080} />
      <Composition id="Intro-06-Gap" component={S06Gap} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-07-Component" component={S07Component} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-08-Canvas" component={S08Canvas} durationInFrames={630} fps={30} width={1920} height={1080} />
      <Composition id="Intro-09-ComposableIT" component={S09ComposableIT} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-10-ComposableAI" component={S10ComposableAI} durationInFrames={1050} fps={30} width={1920} height={1080} />
      <Composition id="Intro-11-Identity" component={S11Identity} durationInFrames={780} fps={30} width={1920} height={1080} />
      <Composition id="Intro-12-Secrets" component={S12Secrets} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-13-Benefits" component={S13Benefits} durationInFrames={1080} fps={30} width={1920} height={1080} />
      <Composition id="Intro-14-TenX" component={S14TenX} durationInFrames={390} fps={30} width={1920} height={1080} />
      <Composition id="Intro-15-TwoLayers" component={S15TwoLayers} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="Intro-16-Yaml" component={S16Yaml} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-17-Operators" component={S17Operators} durationInFrames={870} fps={30} width={1920} height={1080} />
      <Composition id="Intro-18-ApiExposure" component={S18ApiExposure} durationInFrames={1080} fps={30} width={1920} height={1080} />
      <Composition id="Intro-19-PortalInventory" component={S19Inventory} durationInFrames={420} fps={30} width={1920} height={1080} />
      <Composition id="Intro-20-PortalDeploy" component={S20Deploy} durationInFrames={600} fps={30} width={1920} height={1080} />
      <Composition id="Intro-21-IdentityConfig" component={S21IdentityConfig} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-22-Observability" component={S22Observability} durationInFrames={930} fps={30} width={1920} height={1080} />
      <Composition id="Intro-23-Status" component={S23Status} durationInFrames={1020} fps={30} width={1920} height={1080} />
      <Composition id="Intro-24-Adoption" component={S24Adoption} durationInFrames={540} fps={30} width={1920} height={1080} />
      <Composition id="Intro-25-Together" component={S25Together} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-26-Next" component={S26Next} durationInFrames={630} fps={30} width={1920} height={1080} />
    </Folder>
  );
};
