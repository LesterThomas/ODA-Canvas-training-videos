---
deck-id: 03-authentication-and-authorization
replaces: https://www.youtube.com/watch?v=w0iQv9FtuiM  (ODA Canvas Authentication and Authorization deep-dive, 14:11)
linked-from: oda-canvas Authentication-design.md:7
original-transcript: presentations/transcripts/03-authentication-and-authorization.md
use-cases: UC002, UC003, UC005, UC007, UC009, UC010
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2
target-length: ~10–11 min (concept + demo)
status: draft script
---

# ODA Canvas Authentication and Authorization: updated script

**Why it needs re-recording:**
- The demo YAML uses `controllerRole`, which was renamed `canvasSystemRole` in v1beta4.
- The dynamic-roles demo uses the TMF669 PartyRole API. The Identity Config operator now uses
  **TMF672** (`permissionSpecificationSetAPI`), and TMF669 is being deprecated.
- Three new operators change the story:
  - **Credentials Management** (TMFOP004) creates each component's client credentials as a Kubernetes
    secret.
  - **Dependency Management using Keycloak authorization** (TMFOP005) means granting a component a role
    now *also resolves its API dependency*.
  - **OAuth2 Config** (TMFOP008, prototype) adds tokens to outgoing calls between components.
- The original ends by promising a future video on gateway enforcement. Gateway policies now exist
  (`apiKeyVerification`, `rateLimit`, `quota`, `OASValidation`, `CORS`).

**Demo environment** (see the [plan](../specs/video-update-plan.md) §5):
- Reference Canvas with Keycloak (realm `odari`, Canvas client `canvassystem`, service-account user
  `service-account-canvassystem`).
- Canvas Portal v2.
- `dependency-management-keycloak-authz.enabled=true` and `dependentapi-simple-operator.enabled=false`.
  Only one of the two can be enabled.
- Test charts from `feature-definition-and-test-kit/testData/`: `productcatalog-static-roles-v1`
  (release `r1`), `productcatalog-dynamic-roles-v1` (release `r2`), and
  `productcatalog-dependendent-API-v1` (release `dep`).
- **[VERIFY]** the exact client and role names the current operator creates before writing on-screen
  callouts. In the original they were `r1-productcatalogmanagement`, `pcadmin` and `cat1owner`.

---

## Part A: The model (concept)

### Slide 1: Title
- **Visual:** [STATIC] "Authentication and Authorization in the ODA Canvas"
- **Speaker notes:**
> This video takes a deeper look at how authentication and authorization work in the ODA Canvas.

### Slide 2: Three questions, plus one
- **Visual:** [3B1B] Four question cards appear one at a time.
- **Speaker notes:**
> It answers four questions. First, what is the job of the component, and what is the job of the Canvas, when it comes to authentication and authorization? Second, how does the Canvas get permission to call a component's management and security APIs? Third, how does a component define the roles that other systems and other components can be granted? And fourth, a newer question: how does granting one of those roles connect one component to another?

### Slide 3: Components declare, the Canvas implements
- **Visual:** [3B1B] A traditional application with its own built-in identity database is replaced by a lightweight component that sends a "roles" list down to a single Canvas identity service.
- **Speaker notes:**
> In the ODA model, a component doesn't implement identity management. It declares the roles and permissions it supports, and relies on an identity service provided by the Canvas. That's a big change from traditional, standalone applications that each bring their own identity system. The result is one identity platform for the whole estate, and lighter components.

### Slide 4: Any OAuth 2.0 identity platform
- **Visual:** [3B1B] IdentityConfig YAML flows into the Identity Config operator, which branches to Keycloak and Microsoft Entra ID logos.
- **Speaker notes:**
> A Canvas can use any identity platform that supports the OAuth 2.0 standards. When a component is deployed, the component operator extracts its security requirements into an identity configuration resource. An identity config operator then sets up the identity platform to match. The reference implementation includes operators for Keycloak and for Microsoft Entra ID. This video uses Keycloak, but the concepts are the same for any platform.

### Slide 5: The Canvas system role
- **Visual:** [3B1B] At install time, a "canvassystem" client appears in Keycloak. When component r1 is deployed, its YAML's `canvasSystemRole` line lights up, and an arrow grants that role to the Canvas system client.
- **On-screen text:** `securityFunction.canvasSystemRole`
- **Speaker notes:**
> When the Canvas is installed, it creates its own system identity, called the Canvas system client in Keycloak. Every component must name one of its roles as the Canvas system role, in the security function section of its YAML. When the component is deployed, the identity config operator grants that role to the Canvas system client. That's how the Canvas earns permission to call the component's management and security APIs.

### Slide 6: Static and dynamic roles
- **Visual:** [3B1B] Split screen. On the left, the static `componentRole` list (pcadmin, cat1owner, cat2owner). On the right, a component exposing the TMF672 roles-and-permissions API, with roles streaming into Keycloak over time.
- **Speaker notes:**
> A component can define its other roles in two ways. Static roles are listed directly in the component's YAML. Dynamic roles are published through a TM Forum Open API, the TMF672 user roles and permissions API. The Canvas reads that API and keeps listening for changes, so roles can be added, updated or removed throughout the component's life. Think of a product catalog that adds a role for a new partner who should only see part of the catalog.

### Slide 7: Credentials are handled for you
- **Visual:** [3B1B] The Credentials Management operator gear watches the IdentityConfig and drops a Kubernetes Secret, holding the client ID and client secret, next to the component.
- **Speaker notes:**
> Each deployed component also gets its own client in the identity platform. The credentials management operator creates the component's client credentials and stores them as a Kubernetes secret that only that component uses. Nobody has to copy secrets around by hand.

## Part B: Live demo

### Slide 8: Deploy a component with static roles
- **Visual:** [DEMO] Terminal: `helm install r1 …productcatalog-static-roles-v1 -n components`, then Canvas Portal → Components → Inventory shows r1 moving to "Complete". Cut to the component detail's Security Function panel showing `canvasSystemRole` and the `componentRole` list.
- **Speaker notes:**
> Let's see it working. We deploy a product catalog component that uses static roles. In the Canvas Portal we can follow it until its status is complete, and the security function shows the Canvas system role and the list of component roles it declares.

### Slide 9: What appeared in Keycloak
- **Visual:** [DEMO] Keycloak admin console, realm `odari` → Clients: a new client for r1 with its roles listed. Then Users → `service-account-canvassystem` → Role mapping shows the r1 Canvas system role assigned.
- **Speaker notes:**
> In Keycloak, the operator has created a client for the new component, holding every role it declared. If we open the Canvas system service account, we can see it has been granted the component's Canvas system role automatically.

### Slide 10: Deploy a component with dynamic roles
- **Visual:** [DEMO] `helm install r2 …productcatalog-dynamic-roles-v1`. The YAML highlights `permissionSpecificationSetAPI`. Keycloak shows the r2 client and its roles appearing.
- **Speaker notes:**
> The second component publishes its roles dynamically through the roles-and-permissions API. Its Canvas system role is still declared statically, because the Canvas needs that permission before it can call the API at all. Once that's granted, the Canvas reads the remaining roles from the component and keeps them in sync.

### Slide 11: Granting an external system a role
- **Visual:** [DEMO] Keycloak: Create client "external-system" with client authentication on → Client scopes → Create "catalog1-scope" → Assign role → r1's cat1owner → External-system → Client scopes → Add catalog1-scope.
- **Speaker notes:**
> External systems get access the same way you'd grant any OAuth client. We create a client for the external system, with client authentication switched on. In Keycloak, roles are usually grouped into a client scope, a little like a business role. We add the product catalog's catalog-one owner role to a scope and attach the scope to the external system. Its operations team can now use the client ID and secret to get a token, and the component knows exactly what that caller is allowed to see and do.

### Slide 12: Granting another component a role, which resolves its dependency
- **Visual:** [DEMO] `helm install dep …productcatalog-dependendent-API-v1`. Portal → APIs → Dependent APIs shows its DependentAPI as *not ready*. Keycloak: open the dep component's client and add the same catalog scope (or the role) on r1. Back in the Portal: the DependentAPI flips to *ready* with r1's URL filled in.
- **Speaker notes:**
> Granting a role to another component is even simpler, because the Canvas has already created that component's client. And there's a new step. This component declares that it depends on the product catalog API, but its dependency stays unresolved for now. As soon as we grant it a role on the product catalog component, the dependency management operator notices the grant, finds the matching exposed API and fills in the address. Authorization and connection happen in one step, so a component can only discover an API it has been allowed to call.

## Part C: Recap and what's next

### Slide 13: The right things in the right place
- **Visual:** [3B1B] Summary diagram. Each component's client holds roles defined by the component. The Canvas system client holds each component's Canvas system role. External clients and other components hold granted roles. Dependency arrows light up only where grants exist.
- **Speaker notes:**
> To recap: components define their roles, and since they define them, they know what each role means when a call arrives. The Canvas has its own system identity with permission to manage every component. Every component, and every external system, has its own client. Access is granted in the identity platform, and in the reference implementation that grant also connects the dependency.

### Slide 14: Answers to the four questions
- **Visual:** [3B1B] The four cards from slide 2 flip over to show their answers.
- **Speaker notes:**
> So, the answers. Components don't include their own identity management. They declare roles, and the Canvas configures them in a shared platform. The Canvas gets permission because every component must declare a Canvas system role, which is granted to the Canvas system client. Components define other roles statically or dynamically, for external systems and other components. And granting a component a role can now resolve its API dependency automatically.

### Slide 15: Enforcement and what's next
- **Visual:** [3B1B] An ExposedAPI with policy badges (API key, rate limit, quota, OpenAPI validation, CORS) in front of the gateway. A side panel shows an outgoing call from a component picking up a token: "OAuth2 Config (prototype)".
- **Speaker notes:**
> Roles are only half the story. The other half is enforcement. Components can now declare gateway policies, such as API-key checks, rate limits, quotas and request validation, and the API operator applies them. For calls between components, an OAuth2 configuration operator for the Istio service mesh shows how outgoing requests can automatically pick up a token. It's a prototype today. Both are covered in more detail in the API management video and in use cases nine and ten.

### Slide 16: Find out more
- **Visual:** [STATIC] Links: oda-canvas `Authentication-design.md`, `usecase-library/UC005`, `UC009`, `UC010`, and the operator READMEs for TMFOP003, TMFOP004, TMFOP005 and TMFOP008.
- **Speaker notes:**
> The authentication design, use cases and operator documentation are all in the oda-canvas repository on GitHub. If you have comments, or would like to contribute, please get involved.

---

## Source check

| Claim | Source |
|---|---|
| `controllerRole` renamed `canvasSystemRole` | `release-notes/ReleaseNotes.md` (v1beta4) |
| TMF672 dynamic roles; TMF669 being deprecated | `source/operators/TMFOP003-Identity-Config/README.md`. **Note:** the `keycloak/README.md` beside it still says TMF669, which is an upstream doc inconsistency to fix. |
| Realm `odari`, client `canvassystem` | `charts/canvas-oda/values.yaml` lines ~105–150 |
| Credentials Management creates k8s secrets from IdentityConfig | `TMFOP004-Credentials-Management/credentials-management/README.md` |
| Keycloak role grant resolves DependentAPI | `TMFOP005-Dependency-Management/dependency-management-using-keycloak-authorization/README.md` |
| Only one dependency operator at a time | `TMFOP005-Dependency-Management/README.md` |
| OAuth2 EnvoyFilter is a prototype | `TMFOP008-OAuth2-Config/README.md` |
| Gateway policies | `TMFOP002-API-Management/README.md` |
