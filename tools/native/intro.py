"""Native PowerPoint slides for deck 01 (Introduction to the ODA Canvas).

Each builder draws one slide with real PowerPoint shapes and records entrance animations timed to
the narration (seconds from slide start ≈ words before the mention ÷ 2.5). The layouts mirror the
Remotion scenes they replaced, so the deck keeps one visual language. Assets come from
`videos/out/assets` (node videos/scripts/assets.mjs).
"""

from pptx_kit import Kit


def _ico(name, color):
    return f"icon-{name}-{color.lower()}.png"


# Slide 1 — Title card
def s01(k: Kit):
    k.background("stage-title.png")
    # The ODA Canvas picture (images/ODA-Canvas-dark.svg), with a component above its interfaces.
    k.image("Canvas", "canvas-dark.png", 1000, 560, 820)
    k.anim("Canvas", 0.9, "fade", 0.8)
    k.image("Component", "oda.png", 1265, 235, 290)
    k.anim("Component", 1.6, "zoom", 0.8)
    k.text("Intro", 120, 330, 900, 60, "Introduction to the", size=44, color="muted", bold=True)
    k.text("Name", 120, 380, 1000, 160, [[("ODA ", {}), ("Canvas", {"color": "tmf"})]], size=132, bold=True)
    # User feedback: rising from the bottom was distracting here; the titles fade in together.
    k.anim("Intro", 0.2, "fade", 0.8)
    k.anim("Name", 0.2, "fade", 0.8)
    k.text("Subtitle", 124, 560, 900, 50, "Open Digital Architecture · TM Forum", size=36, color="muted")
    k.anim("Subtitle", 0.2, "fade", 0.8)
    k.pill("Series", 124, 660, "Training series · Part 1", "tmf", size=26)
    k.anim("Series", 2.2, "fade")


# Slide 2 — Who this is for
def s02(k: Kit):
    k.background()
    k.heading("Who this is for", "Two audiences, one platform")
    k.line("Divider", 960, 260, 960, 880, color="panelEdge", width=4)
    k.anim("Divider", 1.0, "wipe-down", 1.2)
    left = [
        k.rect(None, 140, 250, 760, 640, fill="panel", line="component", line_w=3, radius=28),
        k.image(None, _ico("person", "F5A623"), 305, 300, 190),
        k.image(None, "oda.png", 525, 300, 210),
        k.text(None, 140, 540, 760, 70, "Component builders", size=52, bold=True, align="center"),
        k.text(None, 190, 630, 660, 220, "Architects and software engineers building software components that meet the ODA standards",
               size=34, color="muted", align="center", line_spacing=1.3),
    ]
    k.group("Component builders", left)
    k.anim("Component builders", 2.2, "rise", 0.8)
    right = [
        k.rect(None, 1020, 250, 760, 640, fill="panel", line="canvas", line_w=3, radius=28),
        k.image(None, _ico("person", "2F6FED"), 1185, 300, 190),
        k.image(None, "canvas-dark.png", 1385, 330, 330),
        k.text(None, 1020, 520, 760, 140, "Canvas builders & operators", size=52, bold=True, align="center"),
        k.text(None, 1060, 680, 680, 160, "Site reliability engineers (SREs) building or operating a Canvas platform",
               size=34, color="muted", align="center", line_spacing=1.3),
    ]
    k.group("Canvas builders", right)
    k.anim("Canvas builders", 14.4, "rise", 0.8)
    p1 = k.pill(None, 1080, 920, "CSP-run Canvas", "canvas")
    p2 = k.pill(None, 1350, 920, "Managed Canvas (cloud provider)", "canvas")
    k.group("Canvas options", [p1, p2])
    k.anim("Canvas options", 20.0, "rise")


# Slide 3 — Roadmap
AGENDA = [("History", 1.2, "doc"), ("Components and Canvas", 4.2, "oda"), ("Business benefits", 8.6, "rocket"),
          ("A tour of the Canvas and its Portal", 11.0, "layers"), ("What's next", 15.6, "spark")]


def s03(k: Kit):
    k.background()
    k.heading("In this video", "Roadmap")
    k.rect("Track", 250, 300, 6, 600, fill="panelEdge", radius=3)
    k.rect("Progress", 250, 300, 6, 600, fill="tmf", radius=3)
    k.anim("Progress", 0.8, "wipe-down", 15.5)
    for i, (label, at, icon) in enumerate(AGENDA):
        y = 270 + i * 140
        num = k.circle(None, 253, y + 39, 78, fill="panel", line="tmf", line_w=4)
        k.text(None, 0, 0, 0, 0, str(i + 1), size=34, bold=True, align="center", anchor="middle", shape=num)
        ico = k.image(None, "oda-icon.png", 352, y + 9, 52) if icon == "oda" else k.image(None, _ico(icon, "E6007E"), 348, y + 9, 60)
        lbl = k.text(None, 448, y + 4, 1300, 70, label, size=50, bold=True)
        k.group(f"Agenda {i + 1}", [num, ico, lbl])
        k.anim(f"Agenda {i + 1}", at, "rise")
    k.pill("Deep dives", 1040, 880, "Deep dives on each area follow in later videos", "operator")
    k.anim("Deep dives", 19.0, "rise")


# Slide 13 — Six benefits
PILLARS = [
    ("Customer experience", "Zero touch, zero wait, zero trouble", "smile", "tmf", "E6007E", 7.0),
    ("Simplicity", "Hundreds of ops teams → one SRE team", "people", "canvas", "2F6FED", 11.2),
    ("Innovation", "Agility, faster AI-native adoption", "spark", "ai", "F472B6", 18.6),
    ("Operational efficiency", "Integration fully automated", "bolt", "operator", "1FC7A8", 22.6),
    ("Security", "Zero trust, security as code", "shield", "identity", "FF6B6B", 25.4),
    ("Technical debt", "Continuous upgrade of every component", "wrench", "component", "F5A623", 29.6),
]


def s13(k: Kit):
    k.background()
    k.heading("Benefits", "Why ODA Components and Canvas?")
    pills, x = [], 120
    for who in ["Service providers", "Software vendors", "Systems integrators", "Cloud providers"]:
        p = k.pill(None, x, 245, who, "muted", size=26)
        pills.append(p)
        x += int(len(who) * 26 * 0.56 + 44) + 16
    k.group("Stakeholders", pills)
    k.anim("Stakeholders", 2.0, "fade")
    for i, (label, sub, icon, color, hexc, at) in enumerate(PILLARS):
        x = 110 + i * 285
        parts = [
            k.rect(None, x, 340, 272, 600, fill=color, fill_alpha=0.16, radius=22),
            k.rect(None, x, 340, 272, 8, fill=color, radius=0),
            k.image(None, _ico(icon, hexc), x + 22, 374, 80),
            k.text(None, x + 22, 474, 232, 100, label, size=36, bold=True, line_spacing=1.05),
            k.text(None, x + 22, 576, 232, 220, sub, size=27, color="muted", line_spacing=1.3),
        ]
        k.group(f"Pillar {i + 1}", parts)
        k.anim(f"Pillar {i + 1}", at, "wipe-up", 1.0)


# Slide 14 — An order-of-magnitude goal
def s14(k: Kit):
    k.background("stage-ai.png")
    k.heading("Benefits", "Not incremental — an order of magnitude")
    k.rect("Baseline", 260, 940, 1400, 4, fill="panelEdge", radius=0)
    k.rect("Small bar", 460, 841, 300, 99, fill="muted", radius=12)
    k.anim("Small bar", 0.8, "wipe-up", 1.4)
    k.text("Small label", 460, 760, 300, 70, "+30%", size=54, bold=True, color="muted", align="center")
    k.anim("Small label", 1.6, "fade")
    k.rect("Big bar", 1060, 347, 380, 593, fill="tmf", radius=16)
    k.anim("Big bar", 3.8, "wipe-up", 2.6)
    k.text("Big label", 1060, 380, 380, 170, "10×", size=150, bold=True, align="center")
    k.anim("Big label", 5.6, "zoom")
    k.text("What", 1480, 420, 380, 110, ["efficiency", "& agility"], size=34, bold=True)
    k.anim("What", 6.0, "fade")
    k.text("Telco", 0, 960, 1920, 60, "… and a faster transformation to an AI-native telco", size=40, bold=True, color="ai", align="center")
    k.anim("Telco", 8.6, "rise")


# Slide 15 — The component standard in two layers
GOLDEN = [("TMFC001", "Product Catalog"), ("TMFC002", "Product Order"), ("TMFC005", "Product Inventory"),
          ("TMFC031", "Bill Calculation"), ("TMFC043", "Fault Management")]


def s15(k: Kit):
    k.background()
    k.heading("A tour of the Canvas", "The component standard: two layers", color="component")
    slab = [k.rect(None, 160, 730, 1600, 210, fill="panel", line="operator", line_w=3, radius=24),
            k.text(None, 200, 756, 1500, 40, "LAYER 1 · DESIGN PATTERNS", size=30, bold=True, color="operator", spacing=3)]
    k.group("Layer 1", slab)
    k.anim("Layer 1", 2.6, "rise", 0.8)
    x = 200
    for name, label, color, at in [("Pattern 1", "Self-describing, modular software", "operator", 4.2),
                                   ("Pattern 2", "Security as code", "identity", 7.6),
                                   ("Pattern 3", "Management as code", "observability", 9.0)]:
        k.pill(name, x, 812, label, color, size=32)
        k.anim(name, at, "rise")
        x += int(len(label) * 32 * 0.56 + 44) + 22
    k.text("Layer 2", 160, 290, 1600, 40, "LAYER 2 · STANDARD “GOLDEN” COMPONENTS", size=30, bold=True, color="component", spacing=3)
    k.anim("Layer 2", 11.0, "fade")
    for i, (tid, name) in enumerate(GOLDEN):
        x = 175 + i * 322
        parts = [k.image(None, "oda.png", x + 30, 360, 230),
                 k.text(None, x - 10, 585, 310, 44, name, size=30, bold=True, align="center"),
                 k.text(None, x, 627, 290, 34, tid, size=24, bold=True, color="component", align="center")]
        k.group(f"Golden {i + 1}", parts)
        k.anim(f"Golden {i + 1}", 12.2 + i * 0.9, "rise", 0.7)
    k.pill("Directory", 1180, 978, "tmforum.org/oda/directory", "tmf", size=30,
           link="https://www.tmforum.org/oda/directory/components-map")
    k.anim("Directory", 19.8, "rise")


# Slide 24 — Available today, experimental, planned
# Slide 24 — timings are word positions in the narration / 2.5
AVAILABLE = [("Component Management", 5.2, "operator"), ("API Management", 6.0, "api"), ("Identity Config", 6.8, "identity"),
             ("Credentials Management", 7.2, "identity"), ("Dependency Management", 7.6, "api"), ("Secrets Management", 8.0, "secrets"),
             ("Disruption Budget", 8.8, "canvas"), ("OAuth2 Config", 9.6, "identity", "prototype")]
EXPERIMENTAL = [("Model-as-a-Service", 16.0, "ai"), ("Data Product", 16.4, "ai"), ("Carbon-aware", 17.6, "carbon")]
PLANNED = [("Event Management", 18.4, "muted"), ("Cost Control", 19.2, "muted"), ("Database Management", 20.4, "muted")]


def _column(k: Kit, x, title, color, icon_file, items, at, tag):
    head = [k.image(None, icon_file, x, 236, 44), k.text(None, x + 56, 234, 480, 50, title, size=34, bold=True, color=color)]
    k.group(f"{tag} header", head)
    k.anim(f"{tag} header", at, "fade")
    for i, it in enumerate(items):
        label, t, c = it[0], it[1], it[2]
        note = it[3] if len(it) > 3 else None
        y = 310 + i * 72
        parts = [k.rect(None, x, y, 540, 60, fill=c, fill_alpha=0.14, radius=12),
                 k.rect(None, x, y, 8, 60, fill=c, radius=0),
                 k.text(None, x + 26, y, 330 if note else 500, 60, label, size=28, bold=True, anchor="middle")]
        if note:
            parts.append(k.text(None, x + 300, y, 222, 60, note, size=22, color="muted", align="right", anchor="middle"))
        k.group(f"{tag} {i + 1}", parts)
        k.anim(f"{tag} {i + 1}", t, "zoom", 0.5)


def s24(k: Kit):
    k.background()
    k.heading("Where things stand", "Available · experimental · planned")
    _column(k, 120, "Available today", "ok", _ico("check", "22C55E"), AVAILABLE, 1.6, "Available")
    _column(k, 690, "Experimental", "ai", _ico("flask", "F472B6"), EXPERIMENTAL, 14.6, "Experimental")
    _column(k, 1260, "Planned", "muted", _ico("rocket", "8F9BB8"), PLANNED, 18.2, "Planned")
    ga = [k.rect(None, 690, 680, 1110, 190, fill="ok", fill_alpha=0.08, line="ok", line_w=3, radius=24),
          k.image(None, _ico("check", "22C55E"), 726, 712, 44),
          k.text(None, 784, 708, 980, 50, "Generally available · regular releases", size=34, bold=True)]
    k.group("GA", ga)
    k.anim("GA", 22.0, "rise")
    bdd = [k.image(None, _ico("flask", "22C55E"), 726, 790, 40),
           k.text(None, 784, 788, 990, 50, "Every change tested by a BDD suite on a real Kubernetes cluster", size=30, color="muted")]
    k.group("BDD", bdd)
    k.anim("BDD", 25.2, "fade")


# Slide 25 — Measuring Canvas adoption
LIGHTS = [("API exposure", 9.8), ("Observability", 10.8), ("Identity", 11.6), ("Secrets", 12.2),
          ("Responsible AI", 14.2), ("Cost", 15.0), ("Carbon", 15.6)]


def s25(k: Kit):
    k.background()
    k.heading("A tour of the Canvas", "How do you measure Canvas adoption?")
    k.text("Outcome", 0, 290, 1920, 60,
           [[("Outcome: ", {}), ("automated component deployment & lifecycle management", {"color": "ok"})]],
           size=44, bold=True, align="center")
    k.anim("Outcome", 2.4, "fade")
    for i, (label, at) in enumerate(LIGHTS):
        cx = 250 + i * 240
        off = [k.circle(None, cx, 545, 150, fill="panel", line="panelEdge", line_w=5),
               k.text(None, cx - 110, 646, 220, 80, label, size=30, bold=True, align="center")]
        k.group(f"Light {i + 1}", off)
        k.anim(f"Light {i + 1}", 6.5 + i * 0.15, "fade")
        k.circle(f"Light {i + 1} on", cx, 545, 150, fill="ok")
        k.anim(f"Light {i + 1} on", at, "zoom", 0.5)
    k.text("Future", 0, 830, 1920, 50, "…and future automations", size=40, bold=True, color="muted", align="center")
    k.anim("Future", 16.2, "fade")
    k.text("Modular", 0, 915, 1920, 50, "Modular · deploy the Canvas incrementally", size=34, bold=True, color="canvas", align="center")
    k.anim("Modular", 16.8, "fade")


# Slide 26 — Built together
# Vendors and integrators shape the components (top row, arrows to the components); service providers
# and cloud providers shape the Canvas (bottom row, arrows to the Canvas). Last two values: the point the
# arrow aims at; the arrow itself stops well short of it.
ROLES = [("Software vendors", "cube", "component", "F5A623", 120, 220, 775, 440),
         ("Systems integrators", "handshake", "operator", "1FC7A8", 1400, 220, 1145, 440),
         ("Communication service providers", "globe", "tmf", "E6007E", 120, 540, 700, 690),
         ("Cloud providers", "cloud", "canvas", "2F6FED", 1400, 540, 1220, 690)]


def s26(k: Kit):
    k.background()
    k.heading("Conclusion", "Built together")
    # Drawn first, so the arrows sit on top of it. The ODA Canvas picture (house standard), with three components (one agentic) on its interfaces
    canvas = [k.image(None, "canvas-dark.png", 610, 535, 700),
              k.image(None, "oda.png", 690, 365, 170), k.image(None, "oda-agent.png", 875, 365, 170),
              k.image(None, "oda.png", 1060, 365, 170)]
    k.group("Canvas", canvas)
    for i, (label, icon, color, hexc, x, y, tx, ty) in enumerate(ROLES):
        parts = [k.circle(None, x + 200, y + 70, 140, fill=color, fill_alpha=0.15, line=color, line_w=4),
                 k.image(None, _ico(icon, hexc), x + 160, y + 30, 80),
                 k.text(None, x, y + 152, 400, 80, label, size=30, bold=True, align="center")]
        k.group(f"Role {i + 1}", parts)
        k.anim(f"Role {i + 1}", 1.2 + i * 0.6, "zoom")
        # Straight arrow from the circle's edge towards what this group shapes most, stopping well short.
        cx, cy = x + 200, y + 70
        dx, dy = tx - cx, ty - cy
        d = (dx * dx + dy * dy) ** 0.5
        ux, uy = dx / d, dy / d
        k.line(f"Link {i + 1}", cx + 78 * ux, cy + 78 * uy, tx - 150 * ux, ty - 150 * uy, color=color, width=4, arrow=True)
        k.anim(f"Link {i + 1}", 5.0 + i * 0.3, "fade", 0.5)
    k.anim("Canvas", 6.0, "rise", 0.8)
    m = [k.text(None, 0, 820, 1920, 40, "ODA MANIFESTO", size=26, bold=True, color="tmf", align="center", spacing=4),
         k.text(None, 0, 860, 1920, 60, "A standard execution environment for ODA Components", size=40, bold=True, align="center")]
    k.group("Manifesto", m)
    k.anim("Manifesto", 9.6, "fade")
    k.text("Together", 0, 960, 1920, 50, "Adopting new capabilities — including AI — faster, together", size=32, color="ai", align="center")
    k.anim("Together", 15.5, "fade")


# Slide 27 — What's next
NEXT = [("How do I buy or build an ODA Canvas?", "layers", "canvas", "2F6FED"),
        ("Authentication & authorization", "shield", "identity", "FF6B6B"),
        ("AI-Native ODA Canvas", "spark", "ai", "F472B6"),
        ("Observability", "chart", "observability", "38BDF8"),
        ("Carbon-aware software", "leaf", "carbon", "34D399")]


def s27(k: Kit):
    k.background("stage-title.png")
    k.heading("Coming up in the series", "What's next")
    for i, (label, icon, color, hexc) in enumerate(NEXT):
        x = 120 + i * 340  # five parts across (observability became part 5, 2026-10-24)
        parts = [k.rect(None, x, 300, 320, 330, fill="panel", line=color, line_w=3, radius=26),
                 k.text(None, x + 30, 334, 260, 34, f"PART {i + 2}", size=24, bold=True, color="muted"),
                 k.image(None, _ico(icon, hexc), x + 30, 380, 84),
                 k.text(None, x + 30, 484, 268, 130, label, size=30, bold=True, line_spacing=1.1)]
        k.group(f"Part {i + 2}", parts)
        # Each part appears as the narration names it (words before the mention / 2.5).
        k.anim(f"Part {i + 2}", [6.0, 8.8, 10.8, 12.8, 13.8][i], "rise", 0.7)
    links = [k.text(None, 120, 740, 1400, 44, "Reference implementation, docs and use-case library", size=30, color="muted"),
             k.pill(None, 120, 796, "github.com/tmforum-oda/oda-canvas", "tmf", size=36,
                    link="https://github.com/tmforum-oda/oda-canvas"),
             k.pill(None, 120 + Kit.pill_width("github.com/tmforum-oda/oda-canvas", 36) + 24, 796, "tmforum.org/oda/directory", "component", size=36,
                    link="https://www.tmforum.org/oda/directory/components-map")]
    k.group("Links", links)
    k.anim("Links", 15.4, "rise")
    k.text("Welcome", 120, 930, 1200, 60, "Contributions welcome.", size=40, bold=True, color="operator")
    k.anim("Welcome", 22.4, "fade")


BUILDERS = {2: s02, 3: s03, 13: s13, 14: s14, 15: s15, 24: s24, 25: s25, 26: s26, 27: s27}
