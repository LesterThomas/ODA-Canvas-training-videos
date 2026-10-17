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
    plate = k.rect("Plate", 1060, 640, 700, 98, fill="canvas", radius=16)
    k.text(None, 0, 0, 0, 0, "ODA Canvas", size=35, bold=True, align="center", anchor="middle", shape=plate, spacing=2)
    k.anim("Plate", 0.2, "rise", 0.8)
    k.image("Component", "oda.png", 1220, 342, 380)
    k.anim("Component", 1.1, "zoom", 0.8)
    k.text("Intro", 120, 330, 900, 60, "Introduction to the", size=44, color="muted", bold=True)
    k.text("Name", 120, 380, 1000, 160, [[("ODA ", {}), ("Canvas", {"color": "tmf"})]], size=132, bold=True)
    k.anim("Intro", 1.6, "fade")
    k.anim("Name", 1.6, "rise", 0.8)
    k.text("Subtitle", 124, 560, 900, 50, "Open Digital Architecture · TM Forum", size=36, color="muted")
    k.anim("Subtitle", 2.6, "fade")
    k.pill("Series", 124, 660, "Training series · Part 1", "tmf", size=26)
    k.anim("Series", 3.4, "rise")


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
    k.anim("Component builders", 1.4, "rise", 0.8)
    right = [
        k.rect(None, 1020, 250, 760, 640, fill="panel", line="canvas", line_w=3, radius=28),
        k.image(None, _ico("person", "2F6FED"), 1185, 300, 190),
        k.rect(None, 1405, 430, 230, 46, fill="canvas", radius=10),
        k.text(None, 1020, 520, 760, 140, "Canvas builders & operators", size=52, bold=True, align="center"),
        k.text(None, 1060, 680, 680, 160, "Architects, engineers and SREs building or operating a Canvas platform",
               size=34, color="muted", align="center", line_spacing=1.3),
    ]
    k.group("Canvas builders", right)
    k.anim("Canvas builders", 12.5, "rise", 0.8)
    p1 = k.pill(None, 1080, 920, "CSP-run Canvas", "canvas")
    p2 = k.pill(None, 1350, 920, "Managed Canvas (cloud provider)", "canvas")
    k.group("Canvas options", [p1, p2])
    k.anim("Canvas options", 19.0, "rise")


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
AVAILABLE = [("Component Management", 2.6, "operator"), ("API Management", 3.4, "api"), ("Identity Config", 4.0, "identity"),
             ("Credentials Management", 4.6, "identity"), ("Dependency Management", 5.2, "api"), ("Secrets Management", 5.8, "secrets"),
             ("Disruption Budget", 6.8, "canvas"), ("Carbon Management", 8.2, "carbon"), ("OAuth2 Config", 10.4, "identity", "prototype")]
EXPERIMENTAL = [("AI-Native Canvas", 13.6, "ai", "Model Gateway · MCP")]
PLANNED = [("Event Management", 16.2, "muted"), ("Model-as-a-Service", 17.0, "muted"), ("Cost Control", 18.0, "muted"),
           ("Database Management", 18.8, "muted")]


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
    _column(k, 120, "Available today", "ok", _ico("check", "22C55E"), AVAILABLE, 2.2, "Available")
    _column(k, 690, "Experimental", "ai", _ico("flask", "F472B6"), EXPERIMENTAL, 13.2, "Experimental")
    _column(k, 1260, "Planned", "muted", _ico("rocket", "8F9BB8"), PLANNED, 15.8, "Planned")
    ga = [k.rect(None, 690, 680, 1110, 190, fill="ok", fill_alpha=0.08, line="ok", line_w=3, radius=24),
          k.image(None, _ico("check", "22C55E"), 726, 712, 44),
          k.text(None, 784, 708, 980, 50, "Generally available · regular releases", size=34, bold=True)]
    k.group("GA", ga)
    k.anim("GA", 21.0, "rise")
    bdd = [k.image(None, _ico("flask", "22C55E"), 726, 790, 40),
           k.text(None, 784, 788, 990, 50, "Every change tested by a BDD suite on a real Kubernetes cluster", size=30, color="muted")]
    k.group("BDD", bdd)
    k.anim("BDD", 24.4, "fade")


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
    k.text("Future", 0, 930, 1920, 50, "…and future automations", size=40, bold=True, color="muted", align="center")
    k.anim("Future", 16.2, "fade")


# Slide 26 — Built together
ROLES = [("Communication service providers", "globe", "tmf", "E6007E", 120, 220),
         ("Cloud providers", "cloud", "canvas", "2F6FED", 1400, 220),
         ("Software vendors", "cube", "component", "F5A623", 120, 540),
         ("Systems integrators", "handshake", "operator", "1FC7A8", 1400, 540)]


def s26(k: Kit):
    k.background()
    k.heading("Conclusion", "Built together")
    for i, (label, icon, color, hexc, x, y) in enumerate(ROLES):
        parts = [k.circle(None, x + 200, y + 70, 140, fill=color, fill_alpha=0.15, line=color, line_w=4),
                 k.image(None, _ico(icon, hexc), x + 160, y + 30, 80),
                 k.text(None, x, y + 152, 400, 80, label, size=30, bold=True, align="center")]
        k.group(f"Role {i + 1}", parts)
        k.anim(f"Role {i + 1}", 1.2 + i * 0.6, "zoom")
        # Elbow connectors from the icon's side to the plate's side, routed clear of the labels.
        sx = x + 270 if x < 960 else x + 130
        ex = 610 if x < 960 else 1310
        k.line(f"Link {i + 1}", sx, y + 70, ex, 616, color=color, width=3, arrow=True, elbow=True)
        k.anim(f"Link {i + 1}", 5.0 + i * 0.3, "fade", 0.5)
    canvas = [k.image(None, "oda.png", 665, 410, 190), k.image(None, "oda-agent.png", 865, 410, 190),
              k.image(None, "oda.png", 1065, 410, 190)]
    plate = k.rect(None, 610, 567, 700, 98, fill="canvas", radius=16)
    k.text(None, 0, 0, 0, 0, "ODA Canvas", size=35, bold=True, align="center", anchor="middle", shape=plate, spacing=2)
    k.group("Canvas", canvas + [plate])
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
        ("Carbon-aware software", "leaf", "carbon", "34D399")]


def s27(k: Kit):
    k.background("stage-title.png")
    k.heading("Coming up in the series", "What's next")
    for i, (label, icon, color, hexc) in enumerate(NEXT):
        x = 120 + i * 430
        parts = [k.rect(None, x, 300, 400, 330, fill="panel", line=color, line_w=3, radius=26),
                 k.text(None, x + 34, 334, 300, 34, f"PART {i + 2}", size=24, bold=True, color="muted"),
                 k.image(None, _ico(icon, hexc), x + 34, 380, 84),
                 k.text(None, x + 34, 484, 332, 130, label, size=34, bold=True, line_spacing=1.1)]
        k.group(f"Part {i + 2}", parts)
        k.anim(f"Part {i + 2}", 2.4 + i * 1.6, "rise", 0.7)
    links = [k.text(None, 120, 740, 1400, 44, "Reference implementation, docs and use-case library", size=30, color="muted"),
             k.pill(None, 120, 796, "github.com/tmforum-oda/oda-canvas", "tmf", size=36,
                    link="https://github.com/tmforum-oda/oda-canvas"),
             k.pill(None, 120 + Kit.pill_width("github.com/tmforum-oda/oda-canvas", 36) + 24, 796, "tmforum.org/oda/directory", "component", size=36,
                    link="https://www.tmforum.org/oda/directory/components-map")]
    k.group("Links", links)
    k.anim("Links", 10.5, "rise")
    k.text("Welcome", 120, 930, 1200, 60, "Contributions welcome.", size=40, bold=True, color="operator")
    k.anim("Welcome", 15.0, "fade")


BUILDERS = {1: s01, 2: s02, 3: s03, 13: s13, 14: s14, 15: s15, 24: s24, 25: s25, 26: s26, 27: s27}
