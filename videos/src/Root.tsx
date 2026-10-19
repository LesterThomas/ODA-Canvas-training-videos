import React from "react";
import { Composition, Folder } from "remotion";
import { S01Presenter } from "./intro/S01Presenter";
import { S01BuyPresenter } from "./buy/S01Presenter";
import { S01AuthPresenter } from "./auth/S01Presenter";
import { S01AiPresenter } from "./ai/S01Presenter";
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
import { S03Declare, S04Client, S05SystemRole, S06Roles, S07Grant, S11Static, S17Flow } from "./auth/Concepts";
import { S09InstallPc1, S10Pc1Client, S12DynamicRoles, S13InstallRest, S14GrantCatalog, S15GrantInventory, S16Order, S18Cleanup } from "./auth/Demo";
import { S02Standard, S04MixMatch, S05TestKit, S06Bdd, S07Modules, S09Operators, S10Choosing, S11Api, S12Observability, S13Identity, S15Carbon } from "./buy/Buy";
import { S04Mcp, S05Descriptions, S07DependentAIModels, S08Inference, S11Gateway, S12GatewayDemo, S15WithAI, S16Registry, S17Evaluation, S18Amplifier, S20AgentsMd, S21Skills, S22SkillDemo } from "./ai/Ai";
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
      <Composition id="Intro-01-Presenter" component={S01Presenter} durationInFrames={1660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-04-Frameworks" component={S04Frameworks} durationInFrames={983} fps={30} width={1920} height={1080} />
      <Composition id="Intro-05-OpenAPIs" component={S05OpenApis} durationInFrames={983} fps={30} width={1920} height={1080} />
      <Composition id="Intro-06-Gap" component={S06Gap} durationInFrames={660} fps={30} width={1920} height={1080} />
      <Composition id="Intro-07-Component" component={S07Component} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-08-Canvas" component={S08Canvas} durationInFrames={630} fps={30} width={1920} height={1080} />
      <Composition id="Intro-09-ComposableIT" component={S09ComposableIT} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Intro-10-ComposableAI" component={S10ComposableAI} durationInFrames={1050} fps={30} width={1920} height={1080} />
      <Composition id="Intro-11-Identity" component={S11Identity} durationInFrames={1140} fps={30} width={1920} height={1080} />
      <Composition id="Intro-12-Secrets" component={S12Secrets} durationInFrames={744} fps={30} width={1920} height={1080} />
      <Composition id="Intro-16-Directory" component={S16Directory} durationInFrames={1020} fps={30} width={1920} height={1080} />
      <Composition id="Intro-17-Yaml" component={S16Yaml} durationInFrames={834} fps={30} width={1920} height={1080} />
      <Composition id="Intro-18-Operators" component={S17Operators} durationInFrames={870} fps={30} width={1920} height={1080} />
      <Composition id="Intro-19-ApiExposure" component={S18ApiExposure} durationInFrames={1188} fps={30} width={1920} height={1080} />
      <Composition id="Intro-20-PortalInventory" component={S20Inventory} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition id="Intro-21-PortalDeploy" component={S21Deploy} durationInFrames={630} fps={30} width={1920} height={1080} />
      <Composition id="Intro-22-IdentityConfig" component={S21IdentityConfig} durationInFrames={708} fps={30} width={1920} height={1080} />
      <Composition id="Intro-23-Observability" component={S22Observability} durationInFrames={966} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="Buy-or-Build-a-Canvas">
      <Composition id="Buy-01-Presenter" component={S01BuyPresenter} durationInFrames={1753} fps={30} width={1920} height={1080} />
      <Composition id="Buy-02-Standard" component={S02Standard} durationInFrames={1290} fps={30} width={1920} height={1080} />
      <Composition id="Buy-04-MixMatch" component={S04MixMatch} durationInFrames={645} fps={30} width={1920} height={1080} />
      <Composition id="Buy-05-TestKit" component={S05TestKit} durationInFrames={735} fps={30} width={1920} height={1080} />
      <Composition id="Buy-06-Bdd" component={S06Bdd} durationInFrames={825} fps={30} width={1920} height={1080} />
      <Composition id="Buy-07-Modules" component={S07Modules} durationInFrames={750} fps={30} width={1920} height={1080} />
      <Composition id="Buy-09-Operators" component={S09Operators} durationInFrames={675} fps={30} width={1920} height={1080} />
      <Composition id="Buy-10-Choosing" component={S10Choosing} durationInFrames={690} fps={30} width={1920} height={1080} />
      <Composition id="Buy-11-Api" component={S11Api} durationInFrames={855} fps={30} width={1920} height={1080} />
      <Composition id="Buy-12-Observability" component={S12Observability} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Buy-13-Identity" component={S13Identity} durationInFrames={810} fps={30} width={1920} height={1080} />
      <Composition id="Buy-15-Carbon" component={S15Carbon} durationInFrames={645} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="Authentication-and-Authorization">
      {/* Deck 03 (scripts/03-authentication-and-authorization.md). Slides 2, 8, 19 and 20 are native (tools/native/auth.py); slide 1 is the presenter's recording. */}
      <Composition id="Auth-01-Presenter" component={S01AuthPresenter} durationInFrames={1754} fps={30} width={1920} height={1080} />
      <Composition id="Auth-03-Declare" component={S03Declare} durationInFrames={930} fps={30} width={1920} height={1080} />
      <Composition id="Auth-04-Client" component={S04Client} durationInFrames={570} fps={30} width={1920} height={1080} />
      <Composition id="Auth-05-SystemRole" component={S05SystemRole} durationInFrames={702} fps={30} width={1920} height={1080} />
      <Composition id="Auth-06-Roles" component={S06Roles} durationInFrames={990} fps={30} width={1920} height={1080} />
      <Composition id="Auth-07-Grant" component={S07Grant} durationInFrames={894} fps={30} width={1920} height={1080} />
      <Composition id="Auth-09-InstallPc1" component={S09InstallPc1} durationInFrames={522} fps={30} width={1920} height={1080} />
      <Composition id="Auth-10-Pc1Client" component={S10Pc1Client} durationInFrames={558} fps={30} width={1920} height={1080} />
      <Composition id="Auth-11-Static" component={S11Static} durationInFrames={690} fps={30} width={1920} height={1080} />
      <Composition id="Auth-12-DynamicRoles" component={S12DynamicRoles} durationInFrames={702} fps={30} width={1920} height={1080} />
      <Composition id="Auth-13-InstallRest" component={S13InstallRest} durationInFrames={738} fps={30} width={1920} height={1080} />
      <Composition id="Auth-14-GrantCatalog" component={S14GrantCatalog} durationInFrames={690} fps={30} width={1920} height={1080} />
      <Composition id="Auth-15-GrantInventory" component={S15GrantInventory} durationInFrames={474} fps={30} width={1920} height={1080} />
      <Composition id="Auth-16-Order" component={S16Order} durationInFrames={402} fps={30} width={1920} height={1080} />
      <Composition id="Auth-17-Flow" component={S17Flow} durationInFrames={726} fps={30} width={1920} height={1080} />
      <Composition id="Auth-18-Cleanup" component={S18Cleanup} durationInFrames={582} fps={30} width={1920} height={1080} />
    </Folder>
    <Folder name="AI-Native-ODA-Canvas">
      {/* Deck 04 (scripts/04-ai-native-oda-canvas.md). Slides 2, 3, 6, 9, 10, 13, 14, 19, 23 and 24 are native (tools/native/ai.py); slide 1 is the presenter's recording. */}
      <Composition id="AI-01-Presenter" component={S01AiPresenter} durationInFrames={2314} fps={30} width={1920} height={1080} />
      <Composition id="AI-04-Mcp" component={S04Mcp} durationInFrames={825} fps={30} width={1920} height={1080} />
      <Composition id="AI-05-Descriptions" component={S05Descriptions} durationInFrames={1000} fps={30} width={1920} height={1080} />
      <Composition id="AI-07-DependentAIModels" component={S07DependentAIModels} durationInFrames={930} fps={30} width={1920} height={1080} />
      <Composition id="AI-08-Inference" component={S08Inference} durationInFrames={825} fps={30} width={1920} height={1080} />
      <Composition id="AI-11-Gateway" component={S11Gateway} durationInFrames={820} fps={30} width={1920} height={1080} />
      <Composition id="AI-12-GatewayDemo" component={S12GatewayDemo} durationInFrames={910} fps={30} width={1920} height={1080} />
      <Composition id="AI-15-WithAI" component={S15WithAI} durationInFrames={1065} fps={30} width={1920} height={1080} />
      <Composition id="AI-16-Registry" component={S16Registry} durationInFrames={1080} fps={30} width={1920} height={1080} />
      <Composition id="AI-17-Evaluation" component={S17Evaluation} durationInFrames={860} fps={30} width={1920} height={1080} />
      <Composition id="AI-18-Amplifier" component={S18Amplifier} durationInFrames={800} fps={30} width={1920} height={1080} />
      <Composition id="AI-20-AgentsMd" component={S20AgentsMd} durationInFrames={858} fps={30} width={1920} height={1080} />
      <Composition id="AI-21-Skills" component={S21Skills} durationInFrames={990} fps={30} width={1920} height={1080} />
      <Composition id="AI-22-SkillDemo" component={S22SkillDemo} durationInFrames={840} fps={30} width={1920} height={1080} />
    </Folder>
    </>
  );
};
