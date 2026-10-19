"""Native PowerPoint slides for deck 02 (How do I buy or build an ODA Canvas?).

Each builder draws one slide with real PowerPoint shapes and records entrance animations timed to
the narration (seconds from slide start ≈ words before the mention ÷ 2.5). Assets come from
`videos/out/assets` (node videos/scripts/assets.mjs). The clip slides are Remotion compositions
(videos/src/buy/).
"""

from pptx_kit import Kit


def _ico(name, color):
    return f"icon-{name}-{color.lower()}.png"


OP = "1FC7A8"  # operator teal


# Slide 1 — Title (placeholder for the presenter's introduction to camera)
def s01(k: Kit):
    k.background("stage-title.png")
    k.image("Canvas", "canvas-dark.png", 1000, 560, 820)
    k.anim("Canvas", 0.9, "fade", 0.8)
    k.image("Component", "oda.png", 1265, 235, 290)
    k.anim("Component", 1.6, "zoom", 0.8)
    k.image("Gear", _ico("gear", OP), 1600, 250, 130)
    k.anim("Gear", 2.4, "zoom", 0.6)
    k.text("Intro", 120, 300, 900, 60, "Training series · Part 2", size=40, color="muted", bold=True)
    k.text("Name", 120, 360, 1000, 260, [[("How do I ", {}), ("buy", {"color": "canvas"}), (" or ", {}), ("build", {"color": "operator"})],
                                        [("an ODA Canvas?", {})]], size=78, bold=True, line_spacing=1.0)
    for n in ("Intro", "Name"):
        k.anim(n, 0.2, "fade", 0.8)
    k.pill("Live", 124, 600, "With the Canvas running on a real cluster", "operator", size=26)
    k.anim("Live", 38.0, "fade")


# Slide 3 — Three ways to get a Canvas
CLOUDS = ["AWS", "Microsoft Azure", "China Mobile", "Google Cloud", "Oracle Cloud"]


def _route(k: Kit, i, y, title, sub, color, icon, at, line_at):
    parts = [k.rect(None, 820, y, 980, 210, fill="panel", line=color, line_w=3, radius=24),
             k.text(None, 860, y + 24, 80, 60, str(i), size=44, bold=True, color=color),
             k.image(None, icon, 1700, y + 26, 64),
             k.text(None, 930, y + 26, 760, 60, title, size=38, bold=True),
             k.text(None, 930, y + 82, 820, 50, sub, size=26, color="muted")]
    k.group(f"Route {i}", parts)
    k.anim(f"Route {i}", at, "rise", 0.6)
    k.line(f"Arrow {i}", 700, 560, 810, y + 105, color=color, width=4, arrow=True)
    k.anim(f"Arrow {i}", line_at, "fade", 0.5)


def s03(k: Kit):
    k.background()
    k.heading("Three routes", "Three ways to get a Canvas", color="canvas")
    k.image("Canvas", "canvas-dark.png", 100, 400, 590)
    k.anim("Canvas", 0.6, "fade", 0.8)
    _route(k, 1, 250, "Public cloud offerings", "A managed Canvas on the provider's Kubernetes services",
           "canvas", _ico("cloud", "2F6FED"), 3.2, 3.0)
    k.text("PoC label", 930, 380, 290, 40, "PoCs at DTW Copenhagen", size=20, color="muted", bold=True)
    k.anim("PoC label", 6.8, "fade")
    for j, c in enumerate(CLOUDS):
        row = 0 if j < 3 else 1
        x = 1225 + sum(k.pill_width(n, 20) + 12 for n in (CLOUDS[:j] if row == 0 else CLOUDS[3:j]))
        k.pill(f"Cloud {j + 1}", x, 372 + row * 44, c, "canvas", size=20)
        k.anim(f"Cloud {j + 1}", 7.4 + j * 0.5, "zoom", 0.4)
    _route(k, 2, 500, "Roll your own", "The reference implementation · Apache 2.0 · extensible",
           "operator", _ico("layers", OP), 18.0, 17.8)
    k.pill("Repo", 930, 630, "github.com/tmforum-oda/oda-canvas", "operator", size=22,
           link="https://github.com/tmforum-oda/oda-canvas")
    k.anim("Repo", 19.6, "fade")
    _route(k, 3, 750, "Vendor and open-source operators", "Products that already manage themselves on Kubernetes",
           "component", _ico("wrench", "F5A623"), 26.0, 25.8)
    x = 930
    for j, c in enumerate(["Istio", "Kong", "or another product's operator"]):
        w = k.pill_width(c, 22)
        k.pill(f"Vendor {j + 1}", x, 880, c, "component", size=22, w=w)
        k.anim(f"Vendor {j + 1}", 29.0 + j * 0.4, "zoom", 0.4)
        x += w + 12


# Slide 8 — The operator catalogue
AVAILABLE = [("001 Component Management", 4.8, "operator"), ("002 API Management", 5.2, "api"),
             ("003 Identity Config", 5.6, "identity"), ("004 Credentials Management", 6.0, "identity"),
             ("005 Dependency Management", 6.4, "api"), ("007 Secrets Management", 6.8, "secrets"),
             ("010 Disruption Budget", 7.6, "canvas"), ("008 OAuth2 Config", 8.8, "identity", "prototype")]
EXPERIMENTAL = [("009 Model-as-a-Service", 13.6, "ai"), ("Data Product", 16.0, "ai"), ("011 Carbon-aware", 17.6, "carbon")]
PLANNED = [("006 Event Management", 19.6, "muted"), ("Cost Control", 20.4, "muted"), ("Database Management", 21.6, "muted")]


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
                 k.text(None, x + 26, y, 360 if note else 500, 60, label, size=26, bold=True, anchor="middle")]
        if note:
            parts.append(k.text(None, x + 330, y, 192, 60, note, size=22, color="muted", align="right", anchor="middle"))
        k.group(f"{tag} {i + 1}", parts)
        k.anim(f"{tag} {i + 1}", t, "zoom", 0.5)


def s08(k: Kit):
    k.background()
    k.heading("Canvas operators", "The operator catalogue", color="operator")
    _column(k, 120, "Available now", "ok", _ico("check", "22C55E"), AVAILABLE, 2.4, "Available")
    _column(k, 690, "Experimental", "ai", _ico("flask", "F472B6"), EXPERIMENTAL, 11.2, "Experimental")
    _column(k, 1260, "Planned", "muted", _ico("rocket", "8F9BB8"), PLANNED, 19.6, "Planned")
    note = [k.rect(None, 690, 680, 1110, 130, fill="operator", fill_alpha=0.08, line="operator", line_w=3, radius=24),
            k.image(None, _ico("gear", OP), 726, 717, 56),
            k.text(None, 800, 700, 980, 90, "Not a fixed list. New operator types are added as the Canvas matures.",
                   size=30, bold=True, anchor="middle")]
    k.group("Not fixed", note)
    k.anim("Not fixed", 23.6, "rise")


# Slide 14 — Example 4: secrets
def s14(k: Kit):
    k.background()
    k.heading("Example 4 · TMFOP007", "Secrets", color="secrets")
    comp = [k.image(None, "oda.png", 120, 300, 300),
            k.text(None, 70, 600, 400, 50, "ODA Component", size=30, bold=True, align="center")]
    k.group("Component", comp)
    k.anim("Component", 0.8, "zoom", 0.6)
    k.pill("Needs", 95, 670, "declares: a secrets store", "secrets", size=24)
    k.anim("Needs", 2.4, "fade")
    k.line("Arrow 1", 470, 440, 620, 440, color="secrets", width=5, arrow=True)
    k.anim("Arrow 1", 3.4, "fade")
    op = [k.rect(None, 640, 330, 520, 220, fill="panel", line="secrets", line_w=3, radius=24),
          k.image(None, _ico("gear", OP), 670, 360, 70),
          k.text(None, 760, 360, 380, 100, "Secrets management operator", size=32, bold=True),
          k.text(None, 670, 470, 470, 60, "provides the store for the component", size=24, color="muted")]
    k.group("Operator", op)
    k.anim("Operator", 3.6, "rise", 0.6)
    k.line("Arrow 2", 1170, 440, 1320, 440, color="secrets", width=5, arrow=True)
    k.anim("Arrow 2", 7.0, "fade")
    vault = [k.rect(None, 1340, 330, 460, 220, fill="secrets", fill_alpha=0.12, line="secrets", line_w=3, radius=24),
             k.image(None, _ico("lock", "E9C46A"), 1370, 360, 70),
             k.text(None, 1460, 360, 320, 60, "HashiCorp Vault", size=32, bold=True),
             k.text(None, 1370, 450, 410, 80, "or another secrets platform", size=26, color="muted", bold=True)]
    k.group("Vault", vault)
    k.anim("Vault", 7.2, "rise", 0.6)
    note = [k.rect(None, 640, 680, 1160, 140, fill="panel", line="operator", line_w=3, radius=24),
            k.image(None, _ico("key", "E9C46A"), 676, 720, 60),
            k.text(None, 760, 690, 1000, 120,
                   [[("Signs in with its own Kubernetes identity", {"bold": True})],
                    [("No bootstrap passwords · JWT/OIDC based (UC014)", {"color": "muted", "size": 26})]], size=32)]
    k.group("Identity", note)
    k.anim("Identity", 12.4, "rise", 0.6)


# Slide 16 — Build your own operator
BUILD = [
    ("Any language", "Follows the Kubernetes operator pattern. The reference operators use Python with KOPF, and Go.",
     _ico("wrench", OP), 2.8),
    ("Same custom resources", "Component · ExposedAPI · DependentAPI · IdentityConfig · SecretsManagement",
     _ico("doc", OP), 12.4),
    ("Help to start", "The create-oda-operator AI coding-assistant skill, and the BDD test kit to check it.",
     _ico("spark", OP), 18.8),
]


def s16(k: Kit):
    k.background()
    k.heading("Building your own", "Build your own operator", color="operator")
    for i, (title, body, icon, at) in enumerate(BUILD):
        x = 120 + i * 570
        parts = [k.rect(None, x, 280, 540, 520, fill="panel", line="operator", line_w=3, radius=26),
                 k.image(None, icon, x + 36, 316, 84),
                 k.text(None, x + 36, 430, 470, 60, title, size=38, bold=True),
                 k.text(None, x + 36, 510, 470, 260, body, size=28, color="muted", line_spacing=1.2)]
        k.group(f"Card {i + 1}", parts)
        k.anim(f"Card {i + 1}", at, "rise", 0.6)
    k.text("Repo", 120, 860, 1680, 50, "github.com/tmforum-oda/oda-canvas › source/operators · skills/create-oda-operator",
           size=28, color="operator", bold=True)
    k.anim("Repo", 21.0, "fade")


# Slide 17 — What's next
AI_ITEMS = [("Components declare the AI models they need", 4.0),
            ("Governed access through a model gateway", 7.2),
            ("Guardrails and usage records", 12.0), ("MCP tools and agentic components", 13.6)]
ROADMAP = [("Event Management", 18.8), ("Cost Control", 19.6), ("Database Management", 20.4)]


def s17(k: Kit):
    k.background("stage-ai.png")
    k.heading("Looking ahead", "What's next", color="ai")
    ai = [k.rect(None, 120, 260, 1000, 600, fill="ai", fill_alpha=0.08, line="ai", line_w=3, radius=26),
          k.image(None, "oda-agent.png", 150, 290, 120),
          k.text(None, 300, 300, 780, 70, "The AI-Native Canvas", size=46, bold=True)]
    k.group("AI", ai)
    k.anim("AI", 0.4, "rise", 0.6)
    for i, (t, at) in enumerate(AI_ITEMS):
        y = (450, 545, 690, 785)[i]
        row = [k.image(None, _ico("spark", "F472B6"), 160, y + 4, 44),
               k.text(None, 230, y, 860, 50, t, size=32)]
        k.group(f"AI {i + 1}", row)
        k.anim(f"AI {i + 1}", at, "fade")
    k.pill("Experimental", 300, 380, "Experimental · its own video", "ai", size=24)
    k.anim("Experimental", 14.8, "zoom", 0.5)
    k.pill("MaaS", 230, 604, "Model-as-a-Service operator · TMFOP009 · experimental", "ai", size=22)
    k.anim("MaaS", 8.4, "fade")
    k.text("Planned", 1200, 260, 600, 60, "Planned", size=40, bold=True, color="muted")
    k.anim("Planned", 17.6, "fade")
    for i, (t, at) in enumerate(ROADMAP):
        parts = [k.rect(None, 1200, 340 + i * 100, 600, 80, fill="muted", fill_alpha=0.12, radius=14),
                 k.rect(None, 1200, 340 + i * 100, 8, 80, fill="muted", radius=0),
                 k.text(None, 1230, 340 + i * 100, 560, 80, t, size=30, bold=True, anchor="middle")]
        k.group(f"Roadmap {i + 1}", parts)
        k.anim(f"Roadmap {i + 1}", at, "zoom", 0.5)


# Slide 18 — Recap
RECAP = [("Buy, build, or mix and match", _ico("layers", OP), 0.8),
         ("Operators are the modules, chosen by configuration", _ico("gear", OP), 5.2),
         ("The test kit checks any Canvas", _ico("check", "22C55E"), 9.2)]


def s18(k: Kit):
    k.background()
    k.heading("Recap", "How do I buy or build an ODA Canvas?", color="canvas")
    for i, (t, icon, at) in enumerate(RECAP):
        y = 300 + i * 190
        parts = [k.rect(None, 120, y, 1680, 160, fill="panel", line="panelEdge", line_w=2, radius=24),
                 k.image(None, icon, 160, y + 40, 80),
                 k.text(None, 280, y, 1480, 160, t, size=46, bold=True, anchor="middle")]
        k.group(f"Point {i + 1}", parts)
        k.anim(f"Point {i + 1}", at, "rise", 0.6)


# Slide 19 — Find out more
LINKS = [
    ("Open Digital Architecture", "tmforum.org/oda", "https://www.tmforum.org/oda/", "tmf", 0.6),
    ("ODA Component Directory", "tmforum.org/oda/directory", "https://www.tmforum.org/oda/directory", "component", 6.0),
    ("ODA Canvas reference implementation", "github.com/tmforum-oda/oda-canvas › Canvas-design.md · source/operators",
     "https://github.com/tmforum-oda/oda-canvas", "operator", 8.0),
    ("ODA Component Design Guidelines", "github.com/tmforum-oda/oda-ca-docs",
     "https://github.com/tmforum-oda/oda-ca-docs/blob/master/ODAComponentDesignGuidelines.md", "canvas", 10.0),
]


def s19(k: Kit):
    k.background("stage-title.png")
    k.heading("Find out more", "Docs, components and code", color="canvas")
    for i, (label, sub, url, color, at) in enumerate(LINKS):
        y = 270 + i * 150
        parts = [k.rect(None, 120, y, 1680, 126, fill="panel", line=color, line_w=3, radius=22),
                 k.text(None, 160, y + 18, 1200, 50, label, size=38, bold=True),
                 k.text(None, 160, y + 72, 1500, 40, sub, size=28, color="muted")]
        for p in parts:  # the whole card is clickable
            p.click_action.hyperlink.address = url
        k.group(f"Link {i + 1}", parts)
        k.anim(f"Link {i + 1}", at, "rise", 0.6)


BUILDERS = {1: s01, 3: s03, 8: s08, 14: s14, 16: s16, 17: s17, 18: s18, 19: s19}
