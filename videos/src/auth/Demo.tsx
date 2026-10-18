import React from "react";
import { interpolate, Sequence, useVideoConfig } from "remotion";
import { C } from "../theme";
import { Gear, Stage, useProg, useT } from "../lib/ui";
import { CaptureClip, CaptureSegment } from "../lib/CaptureClip";
import { CliSession, Terminal } from "../lib/Terminal";
import installPc1 from "../../public/captures/auth-install-pc1.cli.json";
import rolesPc1 from "../../public/captures/auth-roles-pc1.cli.json";
import installRest from "../../public/captures/auth-install-pi1-po1.cli.json";
import order from "../../public/captures/auth-order.cli.json";
import uninstall from "../../public/captures/auth-uninstall.cli.json";

// Deck 03 — the live demo, recorded on the demo cluster by demos/auth/record-demo.mjs. Segment times are
// capture seconds from <capture>.marks.json; terminals replay the real command output (.cli.json).

const KC = "localhost:8083/auth/admin · realm odari";
const PORTAL = "localhost:8090";

/** Fades `children` out at `until` (seconds), and stops rendering them after it. */
const Phase: React.FC<{ from?: number; until?: number; children: React.ReactNode }> = ({ from = 0, until, children }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  const p = useProg(from, 0.5);
  const fadeIn = from > 0 ? p : 1;
  const out = until !== undefined ? interpolate(t, [until - 0.4, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const inner = <div style={{ position: "absolute", inset: 0, opacity: fadeIn * out }}>{children}</div>;
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={until !== undefined ? Math.round((until - from + 0.2) * fps) : undefined} premountFor={fps}>
      {inner}
    </Sequence>
  );
};

/** A terminal phase, with a short title line (the slide's title is in the narration). */
const TermPhase: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <div style={{ position: "absolute", left: 80, top: 60 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
      <Gear size={56} color={C.operator} />
      <div style={{ fontSize: 46, fontWeight: 800 }}>{title}</div>
      {note ? <div style={{ fontSize: 24, color: C.muted, marginLeft: 10 }}>{note}</div> : null}
    </div>
    {children}
  </div>
);

// Sequences start their own clock, so terminals inside a Phase use local times.
const S = (s: unknown) => s as CliSession;

// Slide 9 — Deploy the product catalog: helm install, then pc1 in the Canvas Portal.
const PC1_PORTAL: CaptureSegment[] = [
  { from: 7.9, to: 13.6, rate: 1.5, url: `${PORTAL}/components/components/pc1-productcatalogmanagement`, label: "pc1-productcatalogmanagement · Complete" },
  { from: 13.6, to: 21.0, rate: 1.2, label: "APIs · security function: TMF672 roles and permissions" },
];
export const S09InstallPc1: React.FC = () => (
  <Stage>
    <Phase until={7.2}>
      <TermPhase title="Deploy the product catalog" note="release pc1 · reference-example-components">
        <Terminal session={S(installPc1)} starts={[0.3, 3.6, 5.2]} cps={48} fontSize={20} width={1760} height={640} highlight={["pc1", "Complete", "Keycloak"]} />
      </TermPhase>
    </Phase>
    <Phase from={7.0}>
      <CaptureClip src="captures/auth-portal-pc1.webm" segments={PC1_PORTAL} width={1720} top={36} labelColor={C.identity} />
    </Phase>
  </Stage>
);

// Slide 10 — Its client appears in Keycloak (the first part of the auth-kc-pc1 capture).
const PC1_CLIENT: CaptureSegment[] = [
  { from: 2.1, to: 4.9, rate: 1, url: `${KC} · Clients`, label: "Keycloak · Clients" },
  { from: 4.9, to: 11.5, rate: 1.4, label: "A new client: pc1-productcatalogmanagement" },
  { from: 11.5, to: 15.2, rate: 1, label: "Its role: canvasRole · the Canvas system role it declared" },
];
export const S10Pc1Client: React.FC = () => (
  <Stage>
    <CaptureClip src="captures/auth-kc-pc1.webm" segments={PC1_CLIENT} width={1720} top={36} labelColor={C.identity} />
  </Stage>
);

// Slide 12 — Dynamic roles through TMF672: newman loads the test data, then the roles appear.
const PC1_DYNAMIC: CaptureSegment[] = [
  { from: 21.5, to: 29.9, rate: 2.2, url: `${KC} · Clients · pc1-productcatalogmanagement`, label: "Re-open the client" },
  { from: 29.9, to: 36.7, rate: 1, label: "Roles: canvasRole · CSP · MVNO" },
];
export const S12DynamicRoles: React.FC = () => (
  <Stage>
    <Phase until={12.0}>
      <TermPhase title="Load the catalog's test data" note="Postman collection · run with newman">
        <Terminal
          session={S(rolesPc1)}
          starts={[0.3]}
          cps={40}
          fontSize={18}
          width={1760}
          height={820}
          outputDur={6.5}
          stopAt={["MVNO PermissionSpecificationSet created"]}
          highlight={["CSP PermissionSpecificationSet", "MVNO PermissionSpecificationSet"]}
        />
      </TermPhase>
    </Phase>
    <Phase from={11.8}>
      <CaptureClip src="captures/auth-kc-pc1.webm" segments={PC1_DYNAMIC} width={1720} top={36} labelColor={C.identity} />
    </Phase>
  </Stage>
);

// Slide 13 — Deploy the inventory and order components; po1's two dependencies are unmet.
const CLIENTS: CaptureSegment[] = [
  { from: 7.9, to: 16.0, rate: 1.3, url: `${KC} · Clients`, label: "Both get their own clients" },
];
const UNMET: CaptureSegment[] = [
  { from: 6.6, to: 13.6, rate: 1, url: `${PORTAL}/dependentapis`, label: "APIs › Dependent APIs · both unresolved" },
];
export const S13InstallRest: React.FC = () => (
  <Stage>
    <Phase until={7.0}>
      <TermPhase title="Deploy the inventory and the order components" note="releases pi1 and po1">
        <Terminal session={S(installRest)} starts={[0.2, 1.8, 3.4, 4.6]} cps={60} fontSize={18} width={1760} height={760} highlight={["In-Progress-DepApi", "downstream"]} />
      </TermPhase>
    </Phase>
    <Phase from={6.8} until={13.2}>
      <CaptureClip src="captures/auth-kc-clients.webm" segments={CLIENTS} width={1720} top={36} labelColor={C.identity} />
    </Phase>
    <Phase from={13.0}>
      <CaptureClip src="captures/auth-portal-unmet.webm" segments={UNMET} width={1720} top={36} labelColor={C.danger} />
    </Phase>
  </Stage>
);

// Slides 14 and 15 — grant po1's service account the CSP role on pc1 (then pi1); the dependency resolves.
const grantSegments = (roleClient: string, fast = false): CaptureSegment[] => [
  { from: 11.4, to: 20.8, rate: fast ? 3 : 2.2, url: `${KC} · Clients · po1-productordercaptureandvalidation`, label: "po1 › Service accounts roles › Assign role · filter by clients" },
  { from: 20.8, to: 26.1, rate: fast ? 1.2 : 1, label: `Assign ${roleClient} · CSP` },
];
const metSegments = (dep: string, fast = false): CaptureSegment[] => [
  { from: fast ? 6.7 : 6.2, to: fast ? 14.0 : 13.6, rate: fast ? 1.3 : 1, url: `${PORTAL}/dependentapis`, label: `${dep} · resolved, with its URL filled in` },
];
export const S14GrantCatalog: React.FC = () => (
  <Stage>
    <Phase until={10.2}>
      <CaptureClip src="captures/auth-grant-catalog-kc.webm" segments={grantSegments("pc1-productcatalogmanagement")} width={1720} top={36} labelColor={C.identity} />
    </Phase>
    <Phase from={10.0}>
      <CaptureClip src="captures/auth-grant-catalog-portal.webm" segments={metSegments("downstreamproductcatalog")} width={1720} top={36} labelColor={C.ok} />
    </Phase>
  </Stage>
);
export const S15GrantInventory: React.FC = () => (
  <Stage>
    <Phase until={7.8}>
      <CaptureClip src="captures/auth-grant-inventory-kc.webm" segments={grantSegments("pi1-productinventory", true)} width={1720} top={36} labelColor={C.identity} />
    </Phase>
    <Phase from={7.6}>
      <CaptureClip src="captures/auth-grant-inventory-portal.webm" segments={metSegments("downstreamproductinventory", true)} width={1720} top={36} labelColor={C.ok} />
    </Phase>
  </Stage>
);

// Slide 16 — Send a product order (TMF622) to po1.
export const S16Order: React.FC = () => (
  <Stage>
    <TermPhase title="Send a product order" note="TMF622 · po1">
      <Terminal session={S(order)} starts={[0.2, 3.4]} cps={90} fontSize={17} width={1760} height={900} wrap outputDur={1.2} highlight={["acknowledged", "Unlimited Max SIM Only 24-month\""]} />
    </TermPhase>
  </Stage>
);

// Slide 18 — Automated cleanup: helm uninstall, and the clients disappear from Keycloak.
const CLEANUP: CaptureSegment[] = [
  { from: 6.0, to: 7.5, rate: 1, url: `${KC} · Clients`, label: "Keycloak · pc1, pi1 and po1 clients" },
  { from: 7.5, to: 17.6, rate: 2.5, label: "Uninstalling…" },
  { from: 17.6, to: 19.9, rate: 1, label: "Clients and their roles removed" },
];
export const S18Cleanup: React.FC = () => (
  <Stage>
    <Phase until={5.0}>
      <TermPhase title="Uninstall the components">
        <Terminal session={S(uninstall)} starts={[0.3, 2.4]} cps={40} fontSize={22} width={1760} height={400} highlight={["uninstalled"]} />
      </TermPhase>
    </Phase>
    <Phase from={4.8}>
      <CaptureClip src="captures/auth-kc-cleanup.webm" segments={CLEANUP} width={1720} top={36} labelColor={C.identity} />
    </Phase>
  </Stage>
);
