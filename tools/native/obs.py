"""Native PowerPoint slides for deck 05 (Observability in the ODA Canvas).

Each builder draws one slide with real PowerPoint shapes and records entrance animations timed to
the narration (seconds from slide start ≈ words before the mention ÷ 2.5). Assets come from
`videos/out/assets` (node videos/scripts/assets.mjs). The clip slides are Remotion compositions
(videos/src/obs/).
"""

from pptx_kit import MONO, Kit


def _ico(name, color):
    return f"icon-{name}-{color.lower()}.png"


OBS = "38BDF8"  # observability sky
OP = "1FC7A8"  # operator teal


def _code(k: Kit, name, x, y, w, lines, at, step, size=30, hl=()):
    """A code panel whose lines appear one by one. lines: (indent, text, color or None, at or None)."""
    lh = int(size * 1.55)
    k.rect(f"{name} panel", x, y, w, 60 + lh * len(lines), fill="0D1426", line="panelEdge", line_w=2, radius=18)
    k.anim(f"{name} panel", at, "fade", 0.5)
    for i, (indent, text, color, t) in enumerate(lines):
        n = f"{name} {i + 1}"
        k.text(n, x + 36 + indent * 34, y + 30 + i * lh, w - 60, lh, text, size=size, font=MONO,
               color=color or "text", bold=bool(color) and i in hl)
        k.anim(n, t if t is not None else at + 0.3 + i * step, "fade", 0.4)


# Slide 1 — Title (placeholder for the presenter's introduction to camera)
def s01(k: Kit):
    k.background("stage-title.png")
    k.image("Canvas", "canvas-dark.png", 1000, 600, 820)
    k.anim("Canvas", 0.9, "fade", 0.8)
    k.image("Component", "oda.png", 1255, 250, 300)
    k.anim("Component", 1.6, "zoom", 0.8)
    for i, (icon, x, y) in enumerate([("chart", 1600, 230), ("trace", 1660, 400), ("bell", 1110, 260)]):
        k.image(f"Signal {i + 1}", _ico(icon, OBS), x, y, 110)
        k.anim(f"Signal {i + 1}", 2.4 + i * 0.4, "zoom", 0.5)
    k.text("Intro", 120, 300, 900, 60, "Training series · Part 5", size=40, color="muted", bold=True)
    k.text("Name", 120, 360, 1000, 260, [[("Observability", {"color": "observability"})], [("in the ODA Canvas", {})]],
           size=84, bold=True, line_spacing=1.0)
    for n in ("Intro", "Name"):
        k.anim(n, 0.2, "fade", 0.8)
    x = 124
    for j, label in enumerate(["Prometheus", "Grafana", "Jaeger"]):
        k.pill(f"Tool {j + 1}", x, 610, label, "observability", size=28)
        k.anim(f"Tool {j + 1}", 40.0 + j * 0.5, "fade")
        x += k.pill_width(label, 28) + 14


# Slide 2 — One view across many components
def s02(k: Kit):
    k.background()
    k.heading("Operations", "One view across many components", color="observability")
    k.image("Canvas", "canvas-dark.png", 460, 700, 1000)
    k.anim("Canvas", 0.4, "fade", 0.8)
    for i, (x, vendor) in enumerate([(470, "Vendor A"), (850, "Vendor B"), (1230, "Vendor C")]):
        k.group(f"Own {i + 1}", [k.image(None, _ico("chart", "8F9BB8"), x + 78, 300, 64),
                                 k.text(None, x - 10, 368, 240, 30, "its own dashboard", size=20, color="muted", align="center")])
        k.anim(f"Own {i + 1}", 7.0 + i * 0.5, "fade", 0.4)
        k.image(f"Component {i + 1}", "oda.png", x, 420, 220)
        k.anim(f"Component {i + 1}", 0.8 + i * 0.6, "zoom", 0.5)
        k.text(f"Vendor {i + 1}", x, 640, 220, 40, vendor, size=26, color="component", bold=True, align="center")
        k.anim(f"Vendor {i + 1}", 1.0 + i * 0.6, "fade", 0.4)
    # The shared platform covers the per-vendor dashboards when it arrives.
    parts = [k.rect(None, 400, 270, 1120, 130, fill="panel", line=OBS, line_w=3, radius=24),
             k.image(None, _ico("chart", OBS), 440, 297, 76),
             k.text(None, 540, 290, 940, 50, "One observability platform", size=40, bold=True),
             k.text(None, 540, 344, 940, 40, "the same view for every component", size=26, color="muted")]
    k.group("Platform", parts)
    k.anim("Platform", 14.6, "zoom", 0.6)
    for i, x in enumerate([580, 960, 1340]):
        k.line(f"Feed {i + 1}", x, 430, x, 404, color=OBS, width=5, arrow=True)
        k.anim(f"Feed {i + 1}", 16.4 + i * 0.3, "fade", 0.4)
    # One request traced across the components and down into the Canvas services they use.
    k.line("Trace 1", 694, 540, 846, 540, color=OBS, width=5, dash=True, arrow=True)
    k.line("Trace 2", 1074, 540, 1226, 540, color=OBS, width=5, dash=True, arrow=True)
    # Round the right of Vendor C and into the Canvas services.
    k.group("Trace 3", [k.line(None, 1452, 540, 1590, 540, color=OBS, width=5, dash=True),
                        k.line(None, 1590, 540, 1590, 900, color=OBS, width=5, dash=True),
                        k.line(None, 1590, 900, 1440, 900, color=OBS, width=5, dash=True, arrow=True)])
    for i, at in enumerate([19.6, 20.2, 21.0]):
        k.anim(f"Trace {i + 1}", at, "fade", 0.4)
    k.text("Trace label", 80, 470, 360, 140, "One trace across components and Canvas services", size=30,
           color="observability", bold=True)
    k.anim("Trace label", 19.2, "fade", 0.5)


# Slide 3 — Three kinds of observability
KINDS = [
    ("Technical metrics", "How the component is running", ["CPU", "memory", "requests"], "UC011", "chart", 2.8,
     "Component health", 24.6),
    ("Business metrics", "Defined by each component", ["orders", "catalog changes"], "UC012", "people", 9.2,
     "Business performance", 26.6),
    ("Traces", "One request, across components and Canvas services", ["spans", "timings"], "OpenTelemetry", "trace", 15.6,
     "Troubleshoot issues", 29.4),
]


def s03(k: Kit):
    k.background()
    k.heading("Observability", "Three kinds of observability", color="observability")
    for i, (title, sub, tags, uc, icon, at, q, qat) in enumerate(KINDS):
        x = 120 + i * 580
        parts = [k.rect(None, x, 270, 540, 470, fill="panel", line=OBS, line_w=3, radius=26),
                 k.image(None, _ico(icon, OBS), x + 40, 310, 100),
                 k.text(None, x + 40, 440, 470, 60, title, size=44, bold=True),
                 k.text(None, x + 40, 506, 470, 80, sub, size=28, color="muted")]
        px_ = x + 40
        for t in tags:
            parts.append(k.pill(None, px_, 600, t, "observability", size=24))
            px_ += k.pill_width(t, 24) + 10
        parts.append(k.text(None, x + 40, 678, 470, 40, uc, size=24, color="faint", bold=True))
        k.group(f"Kind {i + 1}", parts)
        k.anim(f"Kind {i + 1}", at, "rise", 0.6)
        k.text(f"Question {i + 1}", x, 780, 540, 50, q, size=34, bold=True, color="observability", align="center")
        k.anim(f"Question {i + 1}", qat, "fade", 0.5)


# Slide 4 — Built on open standards
def s04(k: Kit):
    k.background()
    k.heading("Open standards", "Built on open standards", color="observability")
    cards = [("OpenMetrics", "A metrics endpoint the platform scrapes", "pull", "chart", 2.8),
             ("OpenTelemetry", "Traces and telemetry the component sends", "push · OTLP", "trace", 8.4)]
    for i, (title, sub, how, icon, at) in enumerate(cards):
        x = 120 + i * 860
        parts = [k.rect(None, x, 270, 820, 330, fill="panel", line=OBS, line_w=3, radius=26),
                 k.image(None, _ico(icon, OBS), x + 44, 310, 110),
                 k.text(None, x + 190, 316, 600, 70, title, size=56, bold=True),
                 k.text(None, x + 190, 400, 590, 100, sub, size=30, color="muted"),
                 k.pill(None, x + 190, 520, how, "observability", size=24)]
        k.group(f"Standard {i + 1}", parts)
        k.anim(f"Standard {i + 1}", at, "rise", 0.6)
    k.text("Reference", 120, 680, 800, 40, "In the reference Canvas", size=28, color="muted", bold=True)
    k.anim("Reference", 13.0, "fade", 0.4)
    x = 120
    for j, label in enumerate(["Prometheus", "Grafana", "Jaeger"]):
        k.pill(f"Tool {j + 1}", x, 730, label, "observability", size=30)
        k.anim(f"Tool {j + 1}", 13.2 + j * 0.5, "zoom", 0.4)
        x += k.pill_width(label, 30) + 16
    k.text("Or", 120, 840, 1700, 50, "…or a managed cloud service, or another observability platform", size=34,
           color="text", bold=True)
    k.anim("Or", 18.4, "fade", 0.6)


# Slide 6 — A component declares its metrics API
def s06(k: Kit):
    k.background()
    k.heading("Component specification", "A component declares its metrics API", color="observability")
    k.image("Component", "oda.png", 120, 300, 420)
    k.anim("Component", 0.4, "zoom", 0.6)
    k.pill("Segment", 196, 720, "Management function", "observability", size=28)
    k.anim("Segment", 2.6, "fade")
    lines = [
        (0, "spec:", "muted", 1.2),
        (1, "managementFunction:", OBS, 3.0),
        (2, "exposedAPIs:", None, 4.6),
        (2, "- name: metrics", None, 6.4),
        (3, "apiType: openmetrics", OBS, 9.6),
        (3, "path: /obs-productcatalogmanagement/metrics", None, 14.8),
        (3, "port: 4000", None, 16.0),
    ]
    _code(k, "Spec", 640, 280, 1160, lines, 0.8, 0.0, size=30, hl=(1, 4))
    k.text("Note", 640, 760, 1160, 60, "No observability platform named. That is the Canvas's job.", size=34,
           color="observability", bold=True)
    k.anim("Note", 20.4, "fade", 0.5)


# Slide 8 — Choose how metrics are collected
MODES = [
    ("ServiceMonitor", "default", "A ServiceMonitor resource, for the Prometheus operator", 6.6),
    ("PrometheusAnnotation", "", "Pod annotations, read by some managed Prometheus services", 11.0),
    ("DataDogAnnotation", "", "Pod annotations in Datadog's format", 15.8),
]


def s08(k: Kit):
    k.background()
    k.heading("API operator setting", "Choose how metrics are collected", color="observability")
    k.group("Operator", [k.image(None, _ico("gear", OP), 120, 290, 120),
                         k.text(None, 270, 296, 700, 50, "API operator", size=34, bold=True),
                         k.text(None, 270, 346, 700, 50, "openMetricsImplementation", size=30, font=MONO, color="observability")])
    k.anim("Operator", 2.4, "fade", 0.5)
    for i, (mode, tag, desc, at) in enumerate(MODES):
        y = 460 + i * 150
        parts = [k.rect(None, 120, y, 1680, 126, fill="panel", line=OBS, line_w=3, radius=22),
                 k.text(None, 160, y + 38, 640, 50, mode, size=36, font=MONO, color="observability", bold=True),
                 k.text(None, 820, y + 40, 940, 50, desc, size=30)]
        if tag:
            parts.append(k.pill(None, 540, y + 36, tag, "ok", size=22))
        k.group(f"Mode {i + 1}", parts)
        k.anim(f"Mode {i + 1}", at, "rise", 0.5)
    k.text("Same", 120, 930, 1680, 50, "The component specification is the same in every case", size=32,
           color="muted", bold=True)
    k.anim("Same", 18.6, "fade", 0.5)


# Slide 16 — Pointing a component at the collector
def s16(k: Kit):
    k.background()
    k.heading("Traces", "Pointing a component at the collector", color="observability")
    lines = [
        (0, "# Helm values for release obs", "muted", 0.8),
        (0, "api:", None, 1.0),
        (1, "otlp:", OBS, 1.4),
        (2, "protobuffCollector:", None, 10.4),
        (3, "enabled: true", OBS, 11.4),
        (3, "url: http://observability-opentelemetry-collector", None, 13.4),
        (4, ".monitoring.svc.cluster.local:4318/v1/traces", None, 13.8),
    ]
    _code(k, "Values", 120, 280, 1680, lines, 0.6, 0.0, size=32, hl=(2, 4))
    k.pill("Install", 120, 760, "Set at install time, in the Helm values", "observability", size=28)
    k.anim("Install", 2.4, "fade")
    k.pill("Not spec", 120, 830, "Not part of the Component specification", "muted", size=28)
    k.anim("Not spec", 7.0, "fade")
    k.pill("Namespace", 1080, 760, "collector in the monitoring namespace", "observability", size=28)
    k.anim("Namespace", 15.0, "fade")


# Slide 20 — Tested with BDD features
FEATURES = [
    ("UC012-F002", "Configure Open-Metrics collection", "@ServiceMonitor",
     [("Install productcatalog-v1", 4.0), ("A ServiceMonitor exists", 6.0), ("Uninstall", 7.6), ("It is removed", 8.4)], 2.0),
    ("UC012-F001", "OpenTelemetry Collector configuration", "@OpenTelemetryCollector",
     [("Install productcatalog-v1", 10.2), ("Add category data", 11.2), ("New events in the collector", 13.4)], 9.2),
]


def s20(k: Kit):
    k.background()
    k.heading("Tested", "Tested with BDD features", color="observability")
    for i, (fid, title, tag, steps, at) in enumerate(FEATURES):
        x = 120 + i * 860
        parts = [k.rect(None, x, 270, 820, 600, fill="panel", line=OBS, line_w=3, radius=26),
                 k.image(None, _ico("flask", OBS), x + 40, 306, 80),
                 k.text(None, x + 140, 300, 640, 50, fid, size=30, color="observability", bold=True, font=MONO),
                 k.text(None, x + 140, 344, 660, 100, title, size=34, bold=True, line_spacing=1.05)]
        k.group(f"Feature {i + 1}", parts)
        k.anim(f"Feature {i + 1}", at, "rise", 0.6)
        for j, (s, t) in enumerate(steps):
            n = f"Feature {i + 1} step {j + 1}"
            k.group(n, [k.image(None, _ico("check", OBS), x + 50, 480 + j * 80, 44),
                        k.text(None, x + 116, 480 + j * 80, 680, 50, s, size=30)])
            k.anim(n, t, "fade", 0.4)
        k.pill(f"Tag {i + 1}", x + 44, 790, tag, "muted", size=24)
        k.anim(f"Tag {i + 1}", 14.6 + i * 0.4, "fade")
    k.text("Skip", 120, 920, 1680, 50, "No ServiceMonitor or collector in a Canvas? The tagged scenarios are skipped.",
           size=30, color="muted", bold=True)
    k.anim("Skip", 16.6, "fade", 0.5)


# Slide 21 — Summary
RECAP = [
    ("chart", "A component declares its metrics API, and sends traces with OpenTelemetry", 0.8),
    ("gear", "The Canvas configures the observability platform, and cleans up on uninstall", 7.2),
    ("check", "Prometheus, Grafana and Jaeger, or another platform that supports the open standards", 14.0),
]
LINKS = [
    ("github.com/tmforum-oda/oda-canvas", "https://github.com/tmforum-oda/oda-canvas"),
    ("Observability-design.md", "https://github.com/tmforum-oda/oda-canvas/blob/main/Observability-design.md"),
    ("charts/observability-stack", "https://github.com/tmforum-oda/oda-canvas/tree/main/charts/observability-stack"),
]


def s21(k: Kit):
    k.background()
    k.heading("Summary", "Observability in the ODA Canvas", color="observability")
    for i, (icon, text, at) in enumerate(RECAP):
        y = 280 + i * 140
        k.group(f"Recap {i + 1}", [k.image(None, _ico(icon, OBS), 120, y, 84),
                                   k.text(None, 240, y + 12, 1560, 70, text, size=36, bold=True)])
        k.anim(f"Recap {i + 1}", at, "rise", 0.5)
    k.text("More", 120, 740, 1000, 40, "Find out more", size=28, color="muted", bold=True)
    k.anim("More", 22.0, "fade", 0.4)
    for j, (label, url) in enumerate(LINKS):
        k.pill(f"Link {j + 1}", 120, 800 + j * 66, label, "observability", size=26, link=url)
        k.anim(f"Link {j + 1}", 22.4 + j * 0.6, "fade")


BUILDERS = {2: s02, 3: s03, 4: s04, 6: s06, 8: s08, 16: s16, 20: s20, 21: s21}
