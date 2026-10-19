# Research and fact-checking

## Get the upstream repo

```bash
cd <scratchpad> && git clone --depth 1 https://github.com/tmforum-oda/oda-canvas.git
cd oda-canvas && git config core.longpaths true && git reset -q --hard HEAD   # Windows: long paths break checkout
git log -1 --format='%H %cd'                                                  # pin this in the script
```

## Where the facts live (as of c39da63, Oct 2026)

| Topic | Authoritative source |
|---|---|
| Canvas version, release history | `charts/canvas-oda/Chart.yaml` (`version`, `appVersion`), `README.md` release table, `release-notes/ReleaseNotes.md` (component spec changes) |
| Operator catalogue and status | `source/operators/README.md` (TMFOP001–011, plus planned ones) and each `TMFOP0xx-*/README.md` ("Implementation Planned" means not built) |
| API gateway options | `source/operators/TMFOP002-API-Management/README.md`, `installation/README.md` (one API operator at a time; **there is no default**, per the user, 2026-10-17: never call Istio the default) |
| Observability | `TMFOP002…/istio/README.md` (`openMetricsImplementation`: ServiceMonitor, DataDogAnnotations, PrometheusAnnotation), `charts/observability-stack/README.md` (Prometheus, Grafana, Jaeger, OpenTelemetry Collector) |
| What installs by default | `charts/canvas-oda/values.yaml` (`enabled:` flags) |
| Identity | `TMFOP003-Identity-Config/README.md` (Keycloak, Entra ID; dynamic roles via TMF672), realm `odari` and client `canvassystem` in `charts/canvas-oda/values.yaml` |
| Portal screens | `canvas-portal-v2/frontend/src/layout/Sidebar.tsx` (sections and routes), `pages/*` |
| AI-Native | `AI-Native-Canvas-design.md`, portal `api/modelGateway.ts` (ModelGatewayService CRD, v1alpha1) |
| Use cases | `usecase-library/README.md` (UC001–UC016) |
| Example components | `feature-definition-and-test-kit/testData/*/templates/component-*.yaml` (real YAML to show on screen) |
| Buy or build | `Canvas-design.md` |

## Known traps

- **Observability "operators".** Older videos and the `About ODA Canvas.pptx` deck list
  Prometheus/Grafana/Kiali, Google, Microsoft and Datadog observability operators. The repo has no
  observability operator. The API operator configures scraping, and Kiali is gone from the docs.
- **Carbon** is *implemented* (TMFOP011, KEDA-based, `CarbonManagement` CRD, TMF628 data). Older
  material calls it "planned".
- **Model-as-a-Service (TMFOP009)** is "Implementation Planned", even though the Portal has a Model
  Gateway page. Call it experimental. The model gateway that gives components governed access to AI models *is*
  the Model-as-a-Service operator: say so, and never list it as planned (user, deck 02 review, 2026-10-18).
- **AI model dependencies are the experimental `DependentAIModel` sub-resource** (`dependentAIModels`), built
  as its own CRD first and added to the main Component CRD later. Don't show `dependentModels` inside the
  Component spec (user, deck 04, 2026-10-19).
- **`controllerRole` was renamed `canvasSystemRole`** (v1beta4). The TMF669 party-role API is being
  replaced by TMF672. `TMFOP003…/keycloak/README.md` still says TMF669, so trust the parent README.
- **The `README.md:25` intro-video embed** shows the buy-or-build thumbnail but links to the intro
  video.
- Open API adoption figures come from TM Forum's site, and their dates are inconsistent. Always mark
  them [VERIFY].

## Find the recorded videos the docs link to

```bash
git grep -n -i -E 'youtu|vimeo|\.mp4|video' -- '*.md'
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"   # title
```

The current inventory, with links and update status, is in `specs/video-update-plan.md`.

## Fetch transcripts

```bash
pip install --target <scratchpad>/pylib youtube-transcript-api
```

Then use `YouTubeTranscriptApi().fetch(id, languages=['en','en-GB','en-US'])` with `sys.path` pointed
at that folder. On this machine, Norton intercepts TLS. Concatenate certifi's bundle with
`C:\ProgramData\Norton\Antivirus\wscert.pem` and set `REQUESTS_CA_BUNDLE` to the combined file. Save
transcripts to `presentations/transcripts/NN-<deck>.md` with timestamps. Expect caption errors: the
captions write "Oda" for ODA and "Kali" for Kiali.

## Operator status and terms (confirmed by the user, 2026-10-17)

- **Experimental:** Model-as-a-Service, Data Product and carbon-aware (Carbon Management) operators,
  in that order.
- **Planned:** Event Management, Cost Control, Database Management.
- Say "disruption budget" (the Kubernetes term), not "availability during maintenance".
- There is no default API operator (Istio is one option of six).
- Who shapes what: software vendors and systems integrators are most influential for the components; communication service providers and cloud providers for the Canvas.

## External figures

Confirmed by the user (2026-10-17): the TM Forum Open API programme launched formally in **2015** (after
experiments and hackathons from 2013). As of **September 2026** there have been **1,383,661 downloads
by 71,916 developers**. Use these, not older figures. In narration, round them ("almost one point four
million downloads", "nearly seventy-two thousand developers"); show the exact figures on screen.


Use web search for figures that aren't in the repo, cite the URL in the source check, and mark the
figure **[VERIFY]** for the user.
