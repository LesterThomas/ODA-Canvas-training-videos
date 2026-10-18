"""Native PowerPoint slides for deck 03 (Authentication and Authorization in the ODA Canvas).

Each builder draws one slide with real PowerPoint shapes and records entrance animations timed to
the narration (seconds from slide start ≈ words before the mention ÷ 2.5). Assets come from
`videos/out/assets` (node videos/scripts/assets.mjs). The clip slides are Remotion compositions
(videos/src/auth/).
"""

from pptx_kit import Kit


def _ico(name, color):
    return f"icon-{name}-{color.lower()}.png"


ID = "FF6B6B"  # identity coral


# Slide 1 — Title
def s01(k: Kit):
    k.background("stage-title.png")
    k.image("Canvas", "canvas-dark.png", 1000, 560, 820)
    k.anim("Canvas", 0.9, "fade", 0.8)
    k.image("Component", "oda.png", 1265, 235, 290)
    k.anim("Component", 1.6, "zoom", 0.8)
    k.image("Shield", _ico("shield", ID), 1600, 250, 130)
    k.anim("Shield", 2.4, "zoom", 0.6)
    k.text("Intro", 120, 300, 900, 60, "Training series · Part 3", size=40, color="muted", bold=True)
    k.text("Name", 120, 360, 900, 260, [[("Authentication", {})], [("and ", {}), ("Authorization", {"color": "identity"})]],
           size=96, bold=True, line_spacing=1.0)
    k.text("Subtitle", 124, 640, 860, 50, "in the ODA Canvas", size=44, color="muted", bold=True)
    for n in ("Intro", "Name", "Subtitle"):
        k.anim(n, 0.2, "fade", 0.8)
    k.pill("Demo", 124, 740, "With a live demo: three components and Keycloak", "identity", size=26)
    k.anim("Demo", 13.2, "fade")


# Slide 2 — Four questions
QUESTIONS = [
    ("Who does what?", "The job of the component, and the job of the Canvas", "people", 1.6),
    ("How does the Canvas get in?", "Permission to manage a component", "key", 8.0),
    ("How are roles defined?", "Roles that others can be granted", "doc", 12.4),
    ("How does a grant connect components?", "From a role grant to a working dependency", "link", 17.6),
]


def _cards(k: Kit, answers=None):
    for i, (q, sub, icon, at) in enumerate(QUESTIONS):
        x, y = 120 + (i % 2) * 850, 270 + (i // 2) * 330
        body, bat = (answers[i][0], answers[i][1]) if answers else (sub, at)
        parts = [k.rect(None, x, y, 820, 300, fill="panel", line="identity", line_w=3, radius=26),
                 k.text(None, x + 34, y + 30, 120, 40, f"Q{i + 1}", size=30, bold=True, color="identity"),
                 k.image(None, _ico(icon, ID), x + 700, y + 30, 84),
                 k.text(None, x + 34, y + 84, 660, 60, q, size=34, bold=True, line_spacing=1.05)]
        k.group(f"Card {i + 1}", parts)
        k.anim(f"Card {i + 1}", 0.5 + i * 0.3 if answers else at, "rise" if not answers else "fade", 0.7)
        k.text(f"Body {i + 1}", x + 34, y + 160, 750, 120, body, size=28,
               color="text" if answers else "muted", bold=bool(answers), line_spacing=1.15)
        k.anim(f"Body {i + 1}", bat, "fade", 0.6)


def s02(k: Kit):
    k.background()
    k.heading("In this video", "Four questions", color="identity")
    _cards(k)


# Slide 8 — The scenario
def s08(k: Kit):
    k.background()
    k.heading("Live demo", "The scenario", color="identity")
    pc1 = [k.image(None, "oda.png", 1240, 250, 300),
           k.text(None, 1140, 540, 500, 50, "Product Catalog · pc1", size=32, bold=True, align="center"),
           k.text(None, 1140, 585, 500, 40, "TMFC001", size=24, color="muted", align="center")]
    k.group("Catalog", pc1)
    k.anim("Catalog", 1.2, "zoom", 0.7)
    k.pill("CSP", 1180, 660, "CSP · retail catalog", "identity", size=26)
    k.anim("CSP", 3.8, "rise")
    k.pill("MVNO", 1180, 720, "MVNO · wholesale catalog", "identity", size=26)
    k.anim("MVNO", 5.6, "rise")
    po1 = [k.image(None, "oda.png", 230, 420, 340),
           k.text(None, 20, 750, 760, 50, "Product Order Capture and Validation · po1", size=28, bold=True, align="center"),
           k.text(None, 20, 795, 760, 40, "TMFC002", size=24, color="muted", align="center")]
    k.group("Order", po1)
    k.anim("Order", 10.0, "zoom", 0.7)
    k.line("Dep catalog", 600, 520, 1210, 400, color="api", width=5, arrow=True)
    k.anim("Dep catalog", 12.0, "fade", 0.6)
    k.pill("TMF620", 760, 380, "depends on TMF620 · catalog", "api", size=24)
    k.anim("TMF620", 12.4, "fade")
    pi1 = [k.image(None, "oda.png", 1240, 790, 220),
           k.text(None, 1480, 840, 420, 50, "Product Inventory · pi1", size=32, bold=True),
           k.text(None, 1480, 885, 420, 40, "TMFC005", size=24, color="muted")]
    k.group("Inventory", pi1)
    k.anim("Inventory", 16.4, "zoom", 0.7)
    k.line("Dep inventory", 600, 700, 1220, 890, color="api", width=5, arrow=True)
    k.anim("Dep inventory", 17.4, "fade", 0.6)
    k.pill("TMF637", 620, 890, "depends on TMF637 · inventory", "api", size=24)
    k.anim("TMF637", 17.8, "fade")


# Slide 19 — Answers to the four questions
ANSWERS = [
    ("Components declare their needs. The Canvas configures the identity platform, with a client per component.", 1.2),
    ("Every component names a Canvas system role, which is granted to the Canvas system client.", 10.8),
    ("Statically in the YAML, or dynamically through TMF672 roles and permissions.", 14.4),
    ("Granting a component a role can also resolve its dependency on that API.", 18.0),
]


def s19(k: Kit):
    k.background()
    k.heading("Recap", "Answers to the four questions", color="identity")
    _cards(k, ANSWERS)


# Slide 20 — Find out more
LINKS = [
    ("Authentication design", "github.com/tmforum-oda/oda-canvas › Authentication-design.md",
     "https://github.com/tmforum-oda/oda-canvas/blob/main/Authentication-design.md", "identity", 0.6),
    ("Use cases", "UC005 Configure clients and roles · UC007 Configure dependent APIs",
     "https://github.com/tmforum-oda/oda-canvas/tree/main/usecase-library", "canvas", 2.6),
    ("Operators", "TMFOP003 Identity Config · TMFOP005 Dependency Management",
     "https://github.com/tmforum-oda/oda-canvas/tree/main/source/operators", "operator", 4.6),
    ("Example components and test data", "github.com/tmforum-oda/reference-example-components",
     "https://github.com/tmforum-oda/reference-example-components", "component", 7.2),
]


def s20(k: Kit):
    k.background("stage-title.png")
    k.heading("Find out more", "Docs, use cases and examples", color="identity")
    for i, (label, sub, url, color, at) in enumerate(LINKS):
        y = 270 + i * 150
        parts = [k.rect(None, 120, y, 1680, 126, fill="panel", line=color, line_w=3, radius=22),
                 k.text(None, 160, y + 18, 1200, 50, label, size=38, bold=True),
                 k.text(None, 160, y + 72, 1500, 40, sub, size=28, color="muted")]
        for p in parts:  # the whole card is clickable
            p.click_action.hyperlink.address = url
        k.group(f"Link {i + 1}", parts)
        k.anim(f"Link {i + 1}", at, "rise", 0.6)
    k.text("Welcome", 120, 900, 1600, 60, "Comments and contributions welcome.", size=40, bold=True, color="operator")
    k.anim("Welcome", 12.8, "fade")


BUILDERS = {1: s01, 2: s02, 8: s08, 19: s19, 20: s20}
