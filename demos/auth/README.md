# Deck 03 live demo: identity, roles and dependencies

`record-demo.mjs` records the whole live demo for deck 03 (Authentication and Authorization) on the
local demo cluster. It **changes the cluster** (installs, role grants, an order, uninstalls), so run
it only when the user has approved that.

## Before you run it

- The Canvas runs the Keycloak-authorization dependency operator (release `depmgmt-keycloak-authz` in
  `canvas`), and the simple one is scaled to 0. See the script's "Demo environment" section.
- `demos/.env` has `PORTAL_*` and `KEYCLOAK_*` (gitignored).
- A checkout of `tmforum-oda/reference-example-components` at `be11fd0`. The on-screen commands run
  there, so they read `helm install pc1 charts/ProductCatalog …`. The script copies this folder's
  values files and Postman collections into its `demo/` folder.

## Files

| File | What |
|---|---|
| `pc1-values.yaml`, `pi1-values.yaml`, `po1-values.yaml` | The `hostpath` storage class, and each image's `republishedFrom` source, because the charts' `tmforumodacanvas/*:1.0.0` images aren't on Docker Hub yet. po1's also enables its two dependent APIs. |
| `postman/*.postman_collection.json` | Copies of the upstream `RetailandWholesale` collections, with the RedBrand permission set renamed **CSP** (the user's choice). Nothing else changes. |
| `record-demo.mjs` | The phases, in order: `reset pc1 pc1-roles install-rest unmet grant-catalog grant-inventory order cleanup`. `restore` rebuilds the pre-cleanup state off camera. |

## Run

```bash
REFERENCE_COMPONENTS_DIR=<checkout> node demos/auth/record-demo.mjs            # everything
REFERENCE_COMPONENTS_DIR=<checkout> node demos/auth/record-demo.mjs restore cleanup   # retake the cleanup
```

Captures land in `videos/public/captures/auth-*` (`.webm` + `.marks.json`, and `.cli.json` for the
real command output). A run leaves the Canvas with none of the three components installed.
