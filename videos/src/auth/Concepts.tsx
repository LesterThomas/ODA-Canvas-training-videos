import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { C, MONO } from "../theme";
import { Appear, Caption, Code, Draw, Gear, Heading, Icon, Pill, Stage, Svg, Tile, useProg, useT } from "../lib/ui";
import { OdaComponent } from "../lib/OdaComponent";

// Deck 03 — Authentication and Authorization: the concept slides (scripts/03-authentication-and-authorization.md).
// Timings are seconds from slide start ≈ words before the mention ÷ 2.5 (see the script's notes).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The identity platform: a coral panel that holds client cards. Never names one product alone. */
export const IdpPanel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  sub?: string;
  children?: React.ReactNode;
}> = ({ x, y, w, h, at, sub = "Keycloak · Microsoft Entra ID · or another identity platform", children }) => {
  const p = useProg(at, 0.8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 26,
        background: `${C.identity}12`,
        border: `3px solid ${C.identity}`,
        opacity: p,
        scale: String(interpolate(p, [0, 1], [0.94, 1])),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 26px 6px" }}>
        <Icon name="shield" size={44} color={C.identity} />
        <div style={{ fontSize: 34, fontWeight: 800 }}>Identity platform</div>
      </div>
      <div style={{ padding: "0 26px", fontSize: 21, color: C.muted }}>{sub}</div>
      {children}
    </div>
  );
};

/** A client in the identity platform, with its roles as chips. `roles` entries appear at their `at`. */
export const ClientCard: React.FC<{
  name: string;
  x: number;
  y: number;
  w?: number;
  at: number;
  color?: string;
  roles?: { name: string; at: number; out?: number; color?: string; glow?: number }[];
  note?: string;
  glow?: number;
}> = ({ name, x, y, w = 520, at, color = C.identity, roles = [], note, glow = 0 }) => {
  const t = useT();
  const p = useProg(at, 0.7);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        boxSizing: "border-box",
        padding: "16px 20px",
        borderRadius: 18,
        background: C.panel,
        border: `2px solid ${color}`,
        boxShadow: glow ? `0 0 ${50 * glow}px ${color}` : "none",
        opacity: p,
        translate: `0px ${(1 - p) * 24}px`,
      }}
    >
      <div style={{ fontSize: 15, color: C.muted, letterSpacing: 3, fontWeight: 700 }}>CLIENT</div>
      <div style={{ fontFamily: MONO, fontSize: 25, fontWeight: 600, marginTop: 2, whiteSpace: "nowrap" }}>{name}</div>
      {note ? <div style={{ fontSize: 20, color: C.muted, marginTop: 4 }}>{note}</div> : null}
      {roles.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12, minHeight: 44 }}>
          {roles.map((r) => {
            const rp = interpolate(t, [r.at, r.at + 0.5], [0, 1], clamp);
            const ro = r.out !== undefined ? interpolate(t, [r.out, r.out + 0.6], [0, 1], clamp) : 0;
            if (rp <= 0 || ro >= 1) return null;
            return (
              <div key={r.name} style={{ opacity: rp * (1 - ro), scale: String(interpolate(rp, [0, 1], [0.6, 1])) }}>
                <Pill color={r.color ?? C.identity} fontSize={22} style={{ boxShadow: r.glow ? `0 0 30px ${r.color ?? C.identity}` : undefined, textDecoration: ro > 0 ? "line-through" : undefined }}>
                  {r.name}
                </Pill>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 3 — Components declare, the Canvas implements
const SEC_YAML = [
  { text: "securityFunction:", color: C.muted },
  { text: "canvasSystemRole: canvasRole", indent: 1, color: C.identity },
  { text: "exposedAPIs:", indent: 1, color: C.muted },
  { text: "- name: userrolesandpermissions", indent: 1 },
  { text: "  id: TMF672", indent: 1, color: C.api },
];

export const S03Declare: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="Identity" title="Components declare, the Canvas implements" color={C.identity} />
      <Appear at={0.6} from="up" style={{ left: 170, top: 220 }}>
        <OdaComponent size={280} labels={false} highlight={t >= 4 ? "security" : null} dim={0.4} caption="ODA Component" />
      </Appear>
      <Appear at={1.8} from="pop" style={{ left: 120, top: 520 }}>
        <Pill color={C.danger} fontSize={26} style={{ textDecoration: t >= 3.4 ? "line-through" : undefined, opacity: t >= 3.4 ? 0.55 : 1 }}>
          No built-in identity management
        </Pill>
      </Appear>
      <Appear at={4.0} from="up" style={{ left: 110, top: 600 }}>
        <Code lines={SEC_YAML} at={4.2} perLine={0.25} fontSize={23} width={600} title="component YAML" focus={t >= 5.5 ? { from: 0, to: 4, color: C.identity } : null} />
      </Appear>
      <Svg>
        <Draw d="M 720 720 C 780 720, 790 470, 840 470" at={9.4} color={C.identity} width={4} arrow />
        <Draw d="M 1180 470 L 1290 470" at={15.8} color={C.operator} width={4} arrow />
      </Svg>
      <Appear at={9.6} from="pop" style={{ left: 850, top: 400 }}>
        <Tile label="IdentityConfig" sub="made by the component operator" color={C.operator} icon="doc" w={330} h={130} fontSize={32} />
      </Appear>
      <Appear at={15.6} from="up" style={{ left: 900, top: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Gear size={70} color={C.operator} />
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
            Identity config
            <br />
            operator
          </div>
        </div>
      </Appear>
      <IdpPanel x={1300} y={250} w={520} h={560} at={15.9} sub="configured to match the component">
        <div style={{ position: "absolute", left: 26, top: 170, display: "flex", flexDirection: "column", gap: 18 }}>
          <Appear at={20.2} from="left" style={{ position: "relative" }}>
            <Pill color={C.identity} fontSize={28}>Keycloak</Pill>
          </Appear>
          <Appear at={20.9} from="left" style={{ position: "relative" }}>
            <Pill color={C.identity} fontSize={28}>Microsoft Entra ID</Pill>
          </Appear>
          <Appear at={24.9} from="left" style={{ position: "relative" }}>
            <Pill color={C.canvas} fontSize={28}>…or another identity platform</Pill>
          </Appear>
        </div>
      </IdpPanel>
      <Caption at={25.6} bottom={50} color={C.canvas}>
        One standard pattern · OAuth 2.0 · no mandated product
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 4 — Every component gets its own client (the target pattern for outbound calls)
export const S04Client: React.FC = () => {
  const t = useT();
  const fetchTok = interpolate(t, [8.0, 9.6], [0, 1], clamp);
  const carry = interpolate(t, [10.4, 12.2], [0, 1], clamp);
  return (
    <Stage>
      <Heading kicker="Identity" title="Every component gets its own client" color={C.identity} />
      <Appear at={0.4} from="up" style={{ left: 130, top: 300 }}>
        <OdaComponent size={300} labels={false} caption="Product Order (po1)" />
      </Appear>
      <IdpPanel x={1150} y={230} w={660} h={330} at={0.2}>
        <ClientCard name="po1-productordercaptureandvalidation" x={26} y={140} w={608} at={0.8} glow={t > 3.6 && t < 6 ? 0.6 : 0} note="the component's own identity" />
      </IdpPanel>
      <Appear at={6.4} from="up" style={{ left: 1290, top: 650 }}>
        <OdaComponent size={260} labels={false} caption="Product Catalog (pc1)" />
      </Appear>
      <Svg>
        <Draw d="M 450 420 C 700 420, 900 360, 1140 360" at={7.0} color={C.identity} width={4} arrow />
        <Draw d="M 450 520 C 760 560, 1000 760, 1270 780" at={10.2} color={C.api} width={5} arrow />
      </Svg>
      <Appear at={7.2} from="none" style={{ left: 640, top: 300 }}>
        <Pill color={C.identity} fontSize={22}>client credentials</Pill>
      </Appear>
      {/* the access token travels back to the component, then rides along on the API call */}
      <div
        style={{
          position: "absolute",
          left: interpolate(fetchTok, [0, 1], [1110, 470]) + interpolate(carry, [0, 1], [0, 560]),
          top: interpolate(fetchTok, [0, 1], [380, 430]) + interpolate(carry, [0, 1], [0, 250]),
          opacity: t >= 8 ? 1 : 0,
        }}
      >
        <Pill color={C.secrets} fontSize={22}>
          <Icon name="key" size={26} color={C.secrets} /> access token
        </Pill>
      </div>
      <Appear at={10.6} from="none" style={{ left: 700, top: 560 }}>
        <Pill color={C.api} fontSize={22}>API call</Pill>
      </Appear>
      <Caption at={12.8} bottom={60}>
        Every call between components carries the identity of the caller
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 5 — The Canvas system role (the intended design; see the script's note on slide 10)
export const S05SystemRole: React.FC = () => {
  const t = useT();
  return (
    <Stage>
      <Heading kicker="Identity" title="The Canvas system role" color={C.identity} />
      <Appear at={0.4} from="up" style={{ left: 120, top: 640 }}>
        <Img src={staticFile("ODA-Canvas-dark.svg")} style={{ width: 520 }} />
      </Appear>
      <Appear at={4.6} from="up" style={{ left: 130, top: 250 }}>
        <Code
          lines={[
            { text: "securityFunction:", color: C.muted },
            { text: "canvasSystemRole: canvasRole", indent: 1, color: C.identity },
          ]}
          at={4.8}
          perLine={0.3}
          fontSize={26}
          width={560}
          title="component YAML"
          focus={t >= 6 ? { from: 1, to: 1, color: C.identity } : null}
        />
      </Appear>
      <IdpPanel x={860} y={230} w={950} h={620} at={0.6}>
        <ClientCard name="canvassystem" x={40} y={150} w={420} at={0.9} color={C.canvas} note="the Canvas system client"
          roles={[{ name: "canvasRole · pc1", at: 13.0, color: C.identity, glow: 1 }]} />
        <ClientCard name="pc1-productcatalogmanagement" x={430} y={380} w={490} at={5.2}
          roles={[{ name: "canvasRole", at: 10.2, glow: t > 10 && t < 13 ? 1 : 0 }]} />
      </IdpPanel>
      <Svg>
        <Draw d="M 1285 712 C 1170 712, 1130 640, 1130 540" at={11.6} color={C.identity} width={4} arrow />
        <Draw d="M 520 690 C 640 600, 700 470, 860 470" at={16.4} color={C.canvas} width={4} arrow dash />
      </Svg>
      <Appear at={11.8} from="none" style={{ left: 880, top: 600 }}>
        <Pill color={C.identity} fontSize={22}>granted by the operator</Pill>
      </Appear>
      <Caption at={16.2} bottom={60}>
        The Canvas may call each component's management and security APIs
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 6 — Static and dynamic roles
export const S06Roles: React.FC = () => {
  const t = useT();
  const ev = (at: number) => interpolate(t, [at, at + 1.2], [0, 1], clamp);
  return (
    <Stage>
      <Heading kicker="Roles" title="Static and dynamic roles" color={C.identity} />
      <Appear at={3.8} from="up" style={{ left: 110, top: 250 }}>
        <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 16 }}>Static · in the YAML</div>
        <Code
          lines={[
            { text: "securityFunction:", color: C.muted },
            { text: "componentRole:", indent: 1, color: C.identity },
            { text: "- name: pcadmin", indent: 1 },
            { text: "- name: cat1owner", indent: 1 },
            { text: "- name: cat2owner", indent: 1 },
          ]}
          at={4.2}
          perLine={0.2}
          fontSize={24}
          width={560}
          title="component YAML"
        />
      </Appear>
      <Appear at={7.0} from="up" style={{ left: 760, top: 250 }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>Dynamic · via an Open API</div>
      </Appear>
      <Appear at={7.4} from="up" style={{ left: 770, top: 330 }}>
        <OdaComponent size={230} labels={false} highlight="security" dim={0.4} />
      </Appear>
      <Appear at={9.0} from="pop" style={{ left: 760, top: 580 }}>
        <Pill color={C.api} fontSize={24}>TMF672 roles and permissions</Pill>
      </Appear>
      <Appear at={13.6} from="up" style={{ left: 770, top: 650 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Gear size={60} color={C.operator} />
          <div style={{ fontSize: 24, fontWeight: 700 }}>operator listens for events</div>
        </div>
      </Appear>
      <Svg>
        <Draw d="M 1010 450 C 1120 450, 1180 380, 1250 380" at={16.6} color={C.api} width={4} arrow />
      </Svg>
      {[
        { label: "+ CSP", at: 16.8, color: C.ok },
        { label: "+ MVNO", at: 19.4, color: C.ok },
        { label: "+ Partner", at: 21.2, color: C.ok },
        { label: "− Partner", at: 23.2, color: C.danger },
      ].map((e) => (
        <div
          key={e.label}
          style={{
            position: "absolute",
            left: interpolate(ev(e.at), [0, 1], [1010, 1250]),
            top: 400,
            opacity: interpolate(ev(e.at), [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
          }}
        >
          <Pill color={e.color} fontSize={20}>{e.label}</Pill>
        </div>
      ))}
      <IdpPanel x={1260} y={230} w={560} h={360} at={7.2} sub="the component's client">
        <ClientCard
          name="pc1-productcatalogmanagement"
          x={20}
          y={130}
          w={520}
          at={7.6}
          roles={[
            { name: "canvasRole", at: 7.8 },
            { name: "CSP", at: 17.8 },
            { name: "MVNO", at: 20.4 },
            { name: "Partner", at: 22.2, out: 24.0 },
          ]}
        />
      </IdpPanel>
      <Caption at={26.4} bottom={60}>
        For example, a new role for each new partner catalog
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 7 — A grant is also a connection
export const S07Grant: React.FC = () => {
  const t = useT();
  const grant = interpolate(t, [13.6, 15.2], [0, 1], clamp);
  const ready = t >= 18.6;
  return (
    <Stage>
      <Heading kicker="Roles" title="A grant is also a connection" color={C.identity} />
      <Appear at={0.4} from="up" style={{ left: 150, top: 330 }}>
        <OdaComponent size={300} labels={false} caption="Product Order" />
      </Appear>
      <Appear at={0.8} from="up" style={{ left: 1430, top: 330 }}>
        <OdaComponent size={300} labels={false} caption="Product Catalog" />
      </Appear>
      <IdpPanel x={640} y={230} w={640} h={290} at={2.4} sub="roles are granted here">
        <ClientCard name="pc1-productcatalogmanagement" x={26} y={130} w={588} at={2.8} roles={[{ name: "CSP", at: 3.2, glow: grant > 0 && grant < 1 ? 1 : 0 }]} />
      </IdpPanel>
      <div
        style={{
          position: "absolute",
          left: interpolate(grant, [0, 1], [900, 170]),
          top: interpolate(grant, [0, 1], [430, 790]),
          opacity: grant > 0 ? 1 : 0,
        }}
      >
        <Pill color={C.identity} fontSize={22}>CSP role on pc1</Pill>
      </div>
      <Appear at={0.8} from="none" style={{ left: 170, top: 720 }}>
        <Pill color={ready ? C.ok : C.danger} fontSize={24}>
          {ready ? "Dependent API · ready" : "Dependent API · not ready"}
        </Pill>
      </Appear>
      <Appear at={10.4} from="up" style={{ left: 760, top: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Gear size={70} color={C.operator} />
          <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>
            Dependency management operator
            <br />
            <span style={{ color: C.muted, fontWeight: 500 }}>watches for role grants</span>
          </div>
        </div>
      </Appear>
      <Svg>
        <Draw d="M 470 600 C 800 700, 1100 700, 1440 560" at={17.6} dur={1.0} color={C.ok} width={6} arrow />
      </Svg>
      <Caption at={22.4} bottom={50}>
        A component can only discover an API it has been allowed to call
      </Caption>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 11 — Static roles, YAML only (from the Canvas test kit: productcatalog-static-roles-v1)
const STATIC_YAML = [
  { text: "securityFunction:", color: C.muted },
  { text: "canvasSystemRole: Admin", indent: 1, color: C.muted },
  { text: "componentRole:", indent: 1, color: C.identity },
  { text: "- name: pcadmin", indent: 1 },
  { text: "  description: Product Catalogue Administrator", indent: 1, color: C.muted },
  { text: "- name: cat1owner", indent: 1 },
  { text: "  description: Catalogue Owner for catalogue 1", indent: 1, color: C.muted },
  { text: "- name: cat2owner", indent: 1 },
  { text: "  description: Catalogue Owner for catalogue 2", indent: 1, color: C.muted },
];

export const S11Static: React.FC = () => {
  const t = useT();
  const focus = t >= 11.2 ? { from: 5, to: 8, color: C.identity } : t >= 9.6 ? { from: 3, to: 4, color: C.identity } : t >= 4.6 ? { from: 2, to: 8, color: C.identity } : null;
  return (
    <Stage>
      <Heading kicker="From the Canvas test kit" title="Static roles" color={C.identity} />
      <Appear at={0.6} from="up" style={{ left: 110, top: 250 }}>
        <Code lines={STATIC_YAML} at={0.8} perLine={0.15} fontSize={25} width={860} title="productcatalog-static-roles-v1 · component YAML" focus={focus} />
      </Appear>
      <Svg>
        <Draw d="M 990 520 L 1150 520" at={12.4} color={C.identity} width={4} arrow />
      </Svg>
      <IdpPanel x={1170} y={330} w={640} h={330} at={12.2} sub="when the component is deployed">
        <ClientCard name="its client" x={26} y={130} w={588} at={12.6}
          roles={[{ name: "pcadmin", at: 13.4 }, { name: "cat1owner", at: 14.0 }, { name: "cat2owner", at: 14.6 }]} />
      </IdpPanel>
      <Appear at={18.4} from="up" style={{ left: 0, top: 880, width: 1920 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Pill color={C.api} fontSize={30}>Our three demo components use dynamic roles (TMF672)</Pill>
        </div>
      </Appear>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------
// Slide 17 — What happened behind the scenes (animation only, per the user)
export const S17Flow: React.FC = () => {
  const t = useT();
  const order = interpolate(t, [0.3, 1.6], [0, 1], clamp);
  const get = interpolate(t, [1.8, 4.0], [0, 1], clamp);
  const post = interpolate(t, [14.0, 16.2], [0, 1], clamp);
  const land = interpolate(t, [16.4, 17.6], [0, 1], clamp);
  return (
    <Stage>
      <Heading kicker="Behind the scenes" title="One order, three components" color={C.identity} />
      <div style={{ position: "absolute", left: interpolate(order, [0, 1], [-300, 70]), top: 520, opacity: order }}>
        <Tile label="Product order" sub="Unlimited Max SIM Only 24-month" color={C.component} icon="doc" w={500} h={120} fontSize={28} />
      </div>
      <Appear at={0.2} from="up" style={{ left: 600, top: 400 }}>
        <OdaComponent size={300} labels={false} caption="Product Order (po1)" />
      </Appear>
      <Appear at={0.4} from="up" style={{ left: 1420, top: 190 }}>
        <OdaComponent size={260} labels={false} caption="Product Catalog (pc1)" />
      </Appear>
      <Appear at={0.6} from="up" style={{ left: 1420, top: 630 }}>
        <OdaComponent size={260} labels={false} caption="Product Inventory (pi1)" />
      </Appear>
      <Svg>
        <Draw d="M 900 470 C 1100 420, 1250 330, 1410 320" at={1.8} dur={1.2} color={C.api} width={5} arrow />
        <Draw d="M 900 620 C 1100 680, 1250 760, 1410 760" at={14.0} dur={1.2} color={C.api} width={5} arrow />
      </Svg>
      <Appear at={2.4} from="none" style={{ left: 930, top: 300 }}>
        <Pill color={C.api} fontSize={22}>GET /productOffering/&#123;id&#125;</Pill>
      </Appear>
      <Appear at={6.0} from="pop" style={{ left: 930, top: 360 }}>
        <Pill color={C.identity} fontSize={20}>address from the grant · CSP role</Pill>
      </Appear>
      <Appear at={10.4} from="pop" style={{ left: 1720, top: 260 }}>
        <Icon name="check" size={80} color={C.ok} />
      </Appear>
      <Appear at={11.0} from="pop" style={{ left: 640, top: 830 }}>
        <Pill color={C.ok} fontSize={26}>order valid · acknowledged</Pill>
      </Appear>
      <Appear at={14.6} from="none" style={{ left: 980, top: 760 }}>
        <Pill color={C.api} fontSize={22}>POST /product</Pill>
      </Appear>
      <div style={{ position: "absolute", left: 1250, top: interpolate(land, [0, 1], [900, 960]), opacity: land }}>
        <Pill color={C.ok} fontSize={22}>Unlimited Max SIM Only 24-month · created</Pill>
      </div>
      {/* the token badge riding on each call */}
      <div style={{ position: "absolute", left: interpolate(get, [0, 1], [900, 1340]), top: interpolate(get, [0, 1], [440, 300]), opacity: get > 0 && get < 1 ? 1 : 0 }}>
        <Icon name="key" size={34} color={C.secrets} />
      </div>
      <div style={{ position: "absolute", left: interpolate(post, [0, 1], [900, 1340]), top: interpolate(post, [0, 1], [610, 740]), opacity: post > 0 && post < 1 ? 1 : 0 }}>
        <Icon name="key" size={34} color={C.secrets} />
      </div>
    </Stage>
  );
};
