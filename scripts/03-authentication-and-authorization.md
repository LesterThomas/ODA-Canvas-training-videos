---
deck-id: 03-authentication-and-authorization
replaces: https://www.youtube.com/watch?v=w0iQv9FtuiM  (ODA Canvas Authentication and Authorization deep-dive, 14:11)
linked-from: oda-canvas Authentication-design.md:7
original-transcript: presentations/transcripts/03-authentication-and-authorization.md
original-screenshots: presentations/screenshots/03-authentication-and-authorization/  (frames at m-ss)
use-cases: UC002, UC003, UC005, UC007, UC009, UC010
oda-canvas-commit: c39da6340dbc971981bcb1eea5da5d718fac11d2  (chart canvas-oda 1.2.6-rc4 on the demo cluster)
reference-example-components-commit: be11fd0161444f4b6be00de51dbc01258be50500
target-length: ~11–12 min (concept + end-to-end demo)
status: facts confirmed 2026-10-17; demo recorded 2026-10-17 (demos/auth/record-demo.mjs); deck at decks/03-authentication-and-authorization.pptx
---

# ODA Canvas Authentication and Authorization: updated script

The original (Dec 2024) showed Keycloak clients and roles for one product catalog, then granted an
external system a role by hand. This version follows the user's brief. It shows how the Identity Config
operator turns the **declarative security requirements in a component's YAML** into configuration in
the identity platform (Keycloak here, any OAuth 2.0 platform in general). It then runs one **end-to-end
dependency scenario**: a role grant in Keycloak resolves a component's dependency, and a real product
order flows through three components.

**Main changes from the original:**
- `controllerRole` is now `canvasSystemRole` (v1beta4).
- Dynamic roles use **TMF672** Roles and Permissions (`PermissionSpecificationSet`), not TMF669.
- Each component's Keycloak client is presented as **its own identity for outbound calls**.
- **Granting a role resolves the dependency** (TMFOP005, Keycloak-authorization variant). It's shown live
  with ProductCatalog → ProductOrderCaptureAndValidation → ProductInventory.
- The automated **cleanup** on uninstall is shown. Clients and roles disappear.

**Demo scenario** (reference-example-components @ be11fd0, release names as in its Postman READMEs):

| Release | Component | Exposes | Depends on |
|---|---|---|---|
| `pc1` | `pc1-productcatalogmanagement` (TMFC001) | TMF620, TMF672 | – |
| `pi1` | `pi1-productinventory` (TMFC005) | TMF637, TMF672 | – |
| `po1` | `po1-productordercaptureandvalidation` (TMFC002) | TMF622, TMF672 | TMF620 `downstreamproductcatalog`, TMF637 `downstreamproductinventory` |

Each component's role-initialization job creates its Canvas system role (`canvasRole`) through its own
TMF672 API. The `RetailandWholesale` Postman collections then add the **CSP** and **MVNO**
PermissionSpecificationSets, which become Keycloak client roles. Upstream, the CSP set is named
`RedBrand` (Vodafone's retail brand, as a CSP). Per the user, the demo calls it **CSP**, using the copies in
`demos/auth/postman/`, where only the permission-set names change. The catalogs keep their upstream names. On `POST /productOrder`, po1 looks up
each offering in pc1 (422 if it isn't found), then creates a product in pi1 for each `add` item
(`ProductOrderService.js`).

**Demo environment: state on 2026-10-17 (changes approved by the user):**
- The dependency operator is now the Keycloak-authorization one. It runs as its own release,
  `depmgmt-keycloak-authz` (subchart 0.2.1 from the local oda-canvas checkout, minus its ConfigMap, which
  the `canvas` release already owns), and `canvas-depapi-op` is scaled to 0. The umbrella `helm upgrade`
  was not used, because it would also move the Canvas from 1.2.6-rc4 to rc5, and Kong's Postgres
  refuses to upgrade without its current passwords. To undo: `helm uninstall depmgmt-keycloak-authz -n canvas`
  and `kubectl scale deploy canvas-depapi-op -n canvas --replicas=1`.
- pc1, pi1 and po1 are installed from reference-example-components @ be11fd0 with `demos/auth/<release>-values.yaml`.
  The charts' `tmforumodacanvas/*:1.0.0` images aren't on Docker Hub yet (the issue #84 republish hasn't
  run), so the values files point at each image's `republishedFrom` source.
  They also set the `hostpath` storage class.
  pc1 and pi1 are Complete. po1 is `In-Progress-DepApi`, with both DependentAPIs unresolved, as the demo needs.
- The user removed the old `r1` release. The Credentials Management operator (TMFOP004) is left out of this video.
- **Upstream bug, which affects slides 5 and 10 (user decision 2026-10-17: narrate the intended design, never show the `canvassystem` role mapping):** `identityConfigOperatorKeycloak.py:239` *creates a role* named
  `canvasRole` on the `canvassystem` client, instead of mapping the component's `canvasRole` to
  `service-account-canvassystem`. So the Canvas system account holds no component roles (only
  `realm-management manage-clients`), and every component's Canvas system role collapses into one
  same-named role on `canvassystem`. The 2024 video showed the mapping working (`r1-productcatalogmanagement Admin`).

---

## Part A: The model

### Slide 1: Title
- **Visual:** [NATIVE] "Authentication and Authorization in the ODA Canvas". The ODA Component symbol with its Security segment lit, beside the ODA Canvas picture with its Identity module lit.
- **Speaker notes:**
> This video takes a deeper look at authentication and authorization in the ODA Canvas. It shows how a component declares its security needs, and how the Canvas configures the identity platform to match. Then it runs a complete example with three real components.

### Slide 2: Four questions
- **Visual:** [NATIVE] Four question cards build one at a time.
- **On-screen text:** "Who does what?" · "How does the Canvas get in?" · "How are roles defined?" · "How does a grant connect components?"
- **Speaker notes:**
> It answers four questions. First, what is the job of the component, and what is the job of the Canvas? Second, how does the Canvas get permission to manage a component? Third, how does a component define the roles that others can be granted? And fourth, how does granting one of those roles connect one component to another?

### Slide 3: Components declare, the Canvas implements
- **Visual:** [CLIP Auth-03-Declare] A component YAML scrolls to `securityFunction` (real lines from `charts/ProductOrderCaptureAndValidation`). The block lifts out, becomes an `IdentityConfig` resource, passes through the Identity Config operator gear, and lands in an identity platform panel labelled "Keycloak, Microsoft Entra ID, or another identity platform".
- **On-screen text:** `securityFunction` → `IdentityConfig` → identity platform
- **Speaker notes:**
> An ODA component does not bring its own identity management. Instead, its YAML specification declares what it needs, in the security function section. When the component is deployed, the component operator copies those requirements into an identity config resource. An identity config operator then configures the identity platform to match. The reference Canvas has operators for Keycloak and for Microsoft Entra ID. Another identity platform can be used, through the same standard pattern.

### Slide 4: Every component gets its own client
- **Visual:** [CLIP Auth-04-Client] In the identity platform panel, a client card appears for the component. An arrow out of the component to another component's API picks up a token from that client on the way ("client credentials").
- **On-screen text:** "One client per component · its identity for outbound calls"
- **Note:** This is the **target pattern** (user, 2026-10-17). The reference components don't fetch tokens for outbound calls yet, and the OAuth2 Config operator (TMFOP008) is a prototype. Present it as how the Canvas is designed to work, and don't demo it.
- **Speaker notes:**
> The operator first creates a client for the component. This client is the component's own identity. When the component calls another component's API, it uses this client to get an access token. So every call between components carries the identity of the caller.

### Slide 5: The Canvas system role
- **Visual:** [CLIP Auth-05-SystemRole] The YAML line `canvasSystemRole: canvasRole` lights up. The role appears on the component's client, and an arrow grants it to the `canvassystem` client.
- **On-screen text:** `securityFunction.canvasSystemRole`
- **Speaker notes:**
> The Canvas has its own identity too, called the Canvas system client. Every component must name one of its roles as its Canvas system role. When the component is deployed, the operator grants that role to the Canvas system client. That's how the Canvas earns permission to call the component's management and security APIs.

### Slide 6: Static and dynamic roles
- **Visual:** [CLIP Auth-06-Roles] Split screen. On the left, a static `componentRole` list in the YAML. On the right, a component exposing TMF672 Roles and Permissions, with PermissionSpecificationSets streaming into the client as roles over time, and one being removed.
- **On-screen text:** "Static: `componentRole`" · "Dynamic: TMF672 `PermissionSpecificationSet`"
- **Speaker notes:**
> A component can define its other roles in two ways. Static roles are listed directly in its YAML. Dynamic roles are published through a TM Forum Open API, the TMF672 roles and permissions API. The operator registers for events on that API. When the component adds a permission set, the matching role is added in the identity platform. When it removes one, the role is removed. A product catalog might add a role for each new partner catalog.

### Slide 7: A grant is also a connection
- **Visual:** [CLIP Auth-07-Grant] Two components. The order component has an unplugged socket (dependent API, "not ready"). An admin grants it a role on the catalog's client. The Dependency Management operator gear turns, and the socket plugs into the catalog's lollipop (exposed API, "ready").
- **On-screen text:** "Role granted → dependency resolved"
- **Speaker notes:**
> Roles are how access is granted. Other systems, or other components, are given roles on a component's client. The reference Canvas can go one step further. Its dependency management operator watches for role grants. Suppose a component is granted a role on another component. The operator then connects its dependent API to the matching exposed API. So a component can only discover an API it has been allowed to call.

## Part B: Live demo

### Slide 8: The scenario
- **Visual:** [NATIVE] Three ODA Component symbols: Product Catalog (pc1), Product Order Capture and Validation (po1) and Product Inventory (pi1). Sockets on po1 point to pc1 (TMF620) and pi1 (TMF637). Above pc1, two role tags: CSP and MVNO.
- **Speaker notes:**
> Here's the scenario. A product catalog holds two catalogs. One is a communication service provider's retail catalog, and one is a wholesale catalog for MVNOs. A product order capture and validation component depends on the catalog, to check what is ordered. It also depends on a product inventory, where the ordered products are created.

### Slide 9: Deploy the product catalog
- **Visual:** [CLIP Auth-09-InstallPc1] Terminal (`auth-install-pc1.cli.json`): `helm install pc1 charts/ProductCatalog -n components -f demo/pc1-values.yaml`, `kubectl get components`, `kubectl get identityconfigs`. Then the Canvas Portal (`auth-portal-pc1.webm`): pc1's detail, Complete, and its APIs tab, where the security function lists the TMF672 roles-and-permissions API.
- **Speaker notes:**
> We start by deploying the product catalog component. In the Canvas Portal we follow it until it is complete. Its security function names a Canvas system role, and exposes the TMF672 roles and permissions API for its other roles.

### Slide 10: Its client appears in Keycloak
- **Visual:** [CLIP Auth-10-Pc1Client] Keycloak (`auth-kc-pc1.webm`, first part): realm `odari` → Clients. `pc1-productcatalogmanagement` is new. Its Roles tab shows `canvasRole`. Highlight `canvasRole` with a callout "Canvas system role". Don't show `service-account-canvassystem` (see the upstream bug note above): slide 5 carries the grant as the intended design.
- **Speaker notes:**
> In Keycloak, the identity config operator has created a client for the new component. It holds the Canvas system role that the component declared. This is the role the Canvas uses to manage the component. Nobody configured any of this by hand.

### Slide 11: Static roles
- **Visual:** [CLIP Auth-11-Static] YAML only (user, 2026-10-17). The `securityFunction` of the test-kit component `feature-definition-and-test-kit/testData/productcatalog-static-roles-v1`, with `canvasSystemRole` and the `componentRole` list (`pcadmin`, `cat1owner`, `cat2owner`, with their descriptions). The three entries light up in turn, then fly into a client card labelled "its client in the identity platform".
- **On-screen text:** "Static roles · from the Canvas test kit"
- **Speaker notes:**
> Before we go further, here is what static roles look like. This example from the Canvas test kit lists three roles in its YAML. There's an administrator and two catalog owners. When a component like this is deployed, the operator adds all three to its client. Our three components use dynamic roles instead.

### Slide 12: Dynamic roles through TMF672
- **Visual:** [CLIP Auth-12-DynamicRoles] Terminal (`auth-roles-pc1.cli.json`): `newman run demo/pc1-RetailandWholesale.postman_collection.json --insecure`, shown up to the two PermissionSpecificationSet requests. Keycloak: pc1's Roles tab refreshes to show `CSP` and `MVNO` next to `canvasRole`.
- **Speaker notes:**
> Now we load the catalog's test data. Along with the products, it creates two permission specification sets through the TMF672 API. One is for the CSP, and one is for MVNOs. The component publishes an event for each. The operator receives them, and the two new roles appear on the component's client in Keycloak.

### Slide 13: Deploy the order and inventory components
- **Visual:** [CLIP Auth-13-InstallRest] Terminal (`auth-install-pi1-po1.cli.json`): `helm install pi1 …` and `helm install po1 …` (po1's values enable its dependent APIs), then `kubectl get components` (po1 `In-Progress-DepApi`) and `kubectl get dependentapis`. Keycloak's client list (`auth-kc-clients.webm`) shows the new clients. Canvas Portal → APIs → Dependent APIs (`auth-portal-unmet.webm`): `downstreamproductcatalog` and `downstreamproductinventory`, both **UNRESOLVED**.
- **Speaker notes:**
> Next we deploy the product inventory and the product order components. Both get their own clients in Keycloak. The order component declares two dependencies, on the product catalog API and the product inventory API. The Canvas Portal shows both dependencies as unmet. The APIs exist, but the order component hasn't been granted access to either of them.

### Slide 14: Grant a catalog role, and the dependency is met
- **Visual:** [CLIP Auth-14-GrantCatalog] Keycloak (`auth-grant-catalog-kc.webm`): Clients → `po1-productordercaptureandvalidation` → Service accounts roles → Assign role → Filter by clients → search CSP → tick `pc1-productcatalogmanagement CSP` → Assign. (Keycloak 20 doesn't list service-account users under Users, so this is the administrator's route.) Then the Canvas Portal (`auth-grant-catalog-portal.webm`): `downstreamproductcatalog` is **RESOLVED**, with pc1's URL filled in.
- **Speaker notes:**
> Now we act as the identity administrator. We open the order component's service account in Keycloak and assign it the CSP role on the product catalog. Within a few seconds, the Canvas Portal shows the catalog dependency as met, with the catalog's address filled in. One grant gave permission and made the connection.

### Slide 15: The same for the inventory
- **Visual:** [CLIP Auth-15-GrantInventory] pi1's roles were loaded first (`auth-roles-pi1.cli.json`, not shown). The same steps for `pi1-productinventory CSP` (`auth-grant-inventory-kc.webm`), then the Portal (`auth-grant-inventory-portal.webm`). The Portal shows `downstreamproductinventory` ready, so both dependencies are now met.
- **Speaker notes:**
> We do the same for the product inventory, granting the order component the CSP role on the inventory's client. The second dependency is now met too. The order component is ready to do its job.

### Slide 16: Send a product order
- **Visual:** [CLIP Auth-16-Order] Terminal (`auth-order.cli.json`): look up the offering in pc1, then POST the order (the body from the po1 `RetailandWholesale` collection) to po1's TMF622 API. The response has `"state": "acknowledged"` and the product created in pi1. (Evidence, not shown: `auth-inventory.cli.json` has the product in pi1 and the order `completed`.)
- **Speaker notes:**
> Now we send a valid product order to the order component. It's a retail customer of the CSP, ordering an unlimited SIM-only plan. The order is accepted and acknowledged.

### Slide 17: What happened behind the scenes
- **Visual:** [CLIP Auth-17-Flow] Animation only (user, 2026-10-17). The order arrives at po1. po1 → pc1 `GET /productOffering/{id}` (a tick: found). po1 → pi1 `POST /product`. A product card lands in pi1, labelled "Unlimited Max SIM Only 24-month". Each arrow carries a small token badge on the CSP role that made the connection.
- **Speaker notes:**
> Behind the scenes, the order component looked up each ordered offering in the product catalog. It used the address it was given when access was granted. The offering was found, so the order was valid. Then it created the product in the product inventory. The customer's new product is now in the inventory, ready to use.

### Slide 18: Automated cleanup
- **Visual:** [CLIP Auth-18-Cleanup] Terminal (`auth-uninstall.cli.json`): `helm uninstall po1 pi1 pc1 -n components`. Then Keycloak's client list (`auth-kc-cleanup.webm`), from 14 clients to 11, with pc1, pi1 and po1 gone.
- **Speaker notes:**
> Finally, the cleanup. As each component is uninstalled, the operator deletes its client from Keycloak, along with every role the component defined. The grants to the Canvas system client and to other components go with them. No orphaned identities or permissions are left behind.

## Part C: Recap

### Slide 19: Answers to the four questions
- **Visual:** [NATIVE] The four cards from slide 2 return with their answers.
- **Speaker notes:**
> So, the answers. Components declare their security needs, and the Canvas configures a shared identity platform. Each component gets a client, its own identity for outbound calls. The Canvas gets access through the Canvas system role. Components define other roles statically, or dynamically through TMF672. And granting a role can also resolve a dependency.

### Slide 20: Find out more
- **Visual:** [NATIVE] Links to oda-canvas `Authentication-design.md`, `usecase-library/UC005` and `UC007`, the TMFOP003 and TMFOP005 operator READMEs, and reference-example-components.
- **Speaker notes:**
> The authentication design, the use cases and the operator documentation are all in the oda-canvas repository on GitHub. The example components and their test data are in the reference example components repository. If you'd like to contribute, please get involved.

---

## Source check

| Claim | Source |
|---|---|
| Component operator extracts IdentityConfig; any IdM via operators; Keycloak and Entra ID | oda-canvas `source/operators/TMFOP003-Identity-Config/README.md` |
| Dynamic roles via TMF672 PermissionSpecificationSet events (create adds, remove deletes, update ignored) | `TMFOP003…/README-PermissionSpecificationSet.md` |
| Static `componentRole` example (pcadmin, cat1owner, cat2owner) | oda-canvas `feature-definition-and-test-kit/testData/productcatalog-static-roles-v1/templates/component-*.yaml` |
| Client deleted from Keycloak on IdentityConfig delete | `TMFOP003…/keycloak/identityConfigOperatorKeycloak.py` (`security_client_delete`) |
| Role grant (`CLIENT_ROLE_MAPPING` admin event) resolves DependentAPI; one dependency operator at a time | `TMFOP005…/dependency-management-using-keycloak-authorization/README.md`, `TMFOP005…/README.md` |
| `canvasSystemRole: canvasRole`, TMF672 exposed API, po1 dependencies TMF620 + TMF637 | reference-example-components `charts/*/templates/component-*.yaml`, `values.yaml` |
| po1 validates offerings in the catalog, creates products in the inventory | reference-example-components `source/ProductOrderCaptureAndValidation/README.md` |
| RedBrand (shown as CSP) and MVNO PermissionSpecificationSets, release names pc1/po1/pi1 | `source/*/tests/RetailandWholesale/README.md` |
| Realm `odari`, client `canvassystem`, Keycloak 20.0.5, admin events on | demo cluster (Keycloak admin API, read-only, 2026-10-17) |
