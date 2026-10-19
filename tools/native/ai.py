"""Native PowerPoint slides for deck 04 (The AI-Native ODA Canvas).

Each builder draws one slide with real PowerPoint shapes and records entrance animations timed to
the narration (seconds from slide start ≈ words before the mention ÷ 2.5). Assets come from
`videos/out/assets` (node videos/scripts/assets.mjs). The clip slides are Remotion compositions
(videos/src/ai/).
"""

from pptx_kit import Kit


def _ico(name, color):
    return f"icon-{name}-{color.lower()}.png"


AI = "F472B6"  # AI pink
OP = "1FC7A8"  # operator teal
CV = "2F6FED"  # canvas blue


# Slide 1 — Title (placeholder for the presenter's introduction to camera)
def s01(k: Kit):
    k.background("stage-ai.png")
    k.image("Canvas", "canvas-dark.png", 1000, 560, 820)
    k.anim("Canvas", 0.9, "fade", 0.8)
    k.image("Agent", "oda-agent.png", 1265, 235, 290)
    k.anim("Agent", 1.6, "zoom", 0.8)
    k.image("Spark", _ico("spark", AI), 1600, 250, 130)
    k.anim("Spark", 2.4, "zoom", 0.6)
    k.text("Intro", 120, 300, 900, 60, "Training series · Part 4", size=40, color="muted", bold=True)
    k.text("Name", 120, 360, 1000, 260, [[("The ", {}), ("AI-Native", {"color": "ai"})], [("ODA Canvas", {})]],
           size=78, bold=True, line_spacing=1.0)
    for n in ("Intro", "Name"):
        k.anim(n, 0.2, "fade", 0.8)
    k.pill("Topics", 124, 600, "Agents · models · governance · AI-assisted development", "ai", size=26)
    k.anim("Topics", 30.4, "fade")


# Slide 2 — Four questions
QUESTIONS = [
    ("How do we expose components as tools for agents?", "MCP", _ico("link", AI), "ai", 3.6),
    ("How do we deploy agents themselves as components?", "Agentic components", "oda-agent.png", "ai", 8.0),
    ("How do we operate many agents, from many vendors?", "Governance at scale", _ico("gateway", AI), "ai", 11.6),
    ("How can AI help us build the Canvas?", "AI-assisted development", _ico("wrench", OP), "operator", 19.2),
]


def s02(k: Kit):
    k.background("stage-ai.png")
    k.heading("The AI-Native Canvas", "Four questions", color="ai")
    for i, (q, tag, icon, color, at) in enumerate(QUESTIONS):
        x, y = 120 + (i % 2) * 860, 270 + (i // 2) * 340
        parts = [k.rect(None, x, y, 820, 300, fill="panel", line=color, line_w=3, radius=26),
                 k.image(None, icon, x + 36, y + 36, 96),
                 k.text(None, x + 160, y + 40, 620, 150, q, size=38, bold=True, line_spacing=1.1)]
        parts.append(k.pill(None, x + 160, y + 218, tag, color, size=24))
        k.group(f"Question {i + 1}", parts)
        k.anim(f"Question {i + 1}", at, "rise", 0.6)
    k.text("Design tag", 120, 950, 1680, 40, "Questions 1–3 · AI-Native Canvas design     Question 4 · new in this video",
           size=24, color="muted")
    k.anim("Design tag", 19.8, "fade")


# Slide 3 — What the 2026 Catalysts show (counts from the script's "DTW 2026 Catalyst tally")
CATALYSTS = [
    ("Use AI", 53, "ai", 8.0),
    ("Built from AI agents", 29, "ai", 10.0),
    ("Target autonomous networks", 37, "canvas", 14.8),
    ("Trust, security and governance for agents", 13, "ai", 17.2),
    ("Agent platform: registry, runtime, lifecycle, model gateway", 5, "ai", 21.6),
]


def s03(k: Kit):
    k.background("stage-ai.png")
    k.heading("TM Forum Catalysts", "What the 2026 Catalysts show", color="ai")
    big = [k.text(None, 120, 290, 460, 260, "59", size=240, bold=True, color="ai", align="center"),
           k.text(None, 120, 560, 460, 100, "Catalyst projects at DTW 2026", size=34, bold=True, align="center")]
    k.group("Total", big)
    k.anim("Total", 4.0, "zoom", 0.7)
    maxw = 1060
    for i, (label, n, color, at) in enumerate(CATALYSTS):
        y = 268 + i * 132
        w = max(40, int(maxw * n / 59))
        parts = [k.text(None, 660, y, 1160, 44, label, size=28, bold=True),
                 k.rect(None, 660, y + 50, maxw, 46, fill="panel", radius=10),
                 k.rect(None, 660, y + 50, w, 46, fill=color, fill_alpha=0.85, radius=10),
                 k.text(None, 660 + w + 16, y + 50, 300, 46, f"{n} of 59", size=28, bold=True, color=color, anchor="middle")]
        k.group(f"Bar {i + 1}", parts)
        k.anim(f"Bar {i + 1}", at, "fade", 0.6)
    lesson = [k.rect(None, 120, 912, 1680, 70, fill="ai", fill_alpha=0.12, line="ai", line_w=2, radius=16),
              k.text(None, 120, 912, 1680, 70, "Much of the AI-Native Canvas is lessons learned from these Catalysts",
                     size=30, bold=True, align="center", anchor="middle")]
    k.group("Lessons", lesson)
    k.anim("Lessons", 27.2, "rise", 0.6)
    k.text("Source", 120, 1000, 1680, 40, "Source: tmforum.org/catalysts · projects C26.0 · read October 2026 · classified by topic and summary",
           size=22, color="muted")
    k.anim("Source", 4.0, "fade")


# Slide 6 — Agents as components: four assumptions
ASSUMPTIONS = [
    ("Models are services, reached by API", _ico("cloud", AI), 5.6),
    ("Approved model catalogues", _ico("check", AI), 10.8),
    ("Non-deterministic, so evaluate continuously", _ico("chart", AI), 13.6),
    ("Extra services: vector databases, anonymisation, chunking", _ico("database", AI), 18.8),
]


def s06(k: Kit):
    k.background("stage-ai.png")
    k.heading("Agentic components", "Agents as components", color="ai")
    agent = [k.image(None, "oda-agent.png", 150, 320, 420),
             k.text(None, 110, 740, 500, 60, "Agentic ODA Component", size=32, bold=True, align="center")]
    k.group("Agent", agent)
    k.anim("Agent", 0.6, "zoom", 0.7)
    k.text("Assumptions", 760, 250, 1000, 50, "Four assumptions", size=34, bold=True, color="ai")
    k.anim("Assumptions", 3.6, "fade")
    for i, (t, icon, at) in enumerate(ASSUMPTIONS):
        y = 320 + i * 150
        parts = [k.rect(None, 760, y, 1040, 128, fill="ai", fill_alpha=0.08, line="ai", line_w=2, radius=20),
                 k.image(None, icon, 790, y + 30, 68),
                 k.text(None, 890, y, 880, 128, t, size=32, bold=True, anchor="middle")]
        k.group(f"Assumption {i + 1}", parts)
        k.anim(f"Assumption {i + 1}", at, "rise", 0.6)


# Slide 9 — Three options (GB1085 Architecture Strategy Evaluation)
OPTIONS = [
    ("One hyperscaler's AI service", "Model lock-in becomes platform lock-in", "Rejected", "danger", _ico("cloud", "8F9BB8"), 2.0, 5.2),
    ("Wait for an industry standard", "The market is moving too fast", "Premature", "muted", _ico("doc", "8F9BB8"), 9.2, 10.6),
    ("Model as a Service", "An internal standard layer, today", "Selected", "ai", _ico("gateway", AI), 15.2, 17.6),
]


def s09(k: Kit):
    k.background("stage-ai.png")
    k.heading("Model as a Service", "Three options", color="ai")
    for i, (title, why, verdict, color, icon, at, vat) in enumerate(OPTIONS):
        x = 120 + i * 570
        sel = verdict == "Selected"
        parts = [k.rect(None, x, 270, 540, 560, fill="ai" if sel else "panel", fill_alpha=0.12 if sel else 1.0,
                        line=color if sel else "panelEdge", line_w=4 if sel else 2, radius=26),
                 k.image(None, icon, x + 40, 310, 96),
                 k.text(None, x + 40, 440, 460, 130, title, size=40, bold=True, line_spacing=1.1)]
        k.group(f"Option {i + 1}", parts)
        k.anim(f"Option {i + 1}", at, "rise", 0.6)
        v = [k.pill(None, x + 40, 620, verdict, color, size=30),
             k.text(None, x + 40, 700, 460, 110, why, size=28, color="muted", line_spacing=1.15)]
        k.group(f"Verdict {i + 1}", v)
        k.anim(f"Verdict {i + 1}", vat, "fade", 0.5)
    k.text("Source", 120, 900, 1680, 40, "TM Forum GB1085 Model-as-a-Service (MODaaS) · Introductory Guide · alpha",
           size=24, color="muted")
    k.anim("Source", 0.6, "fade")


# Slide 10 — What the control plane provides (GB1085 §2.1)
SERVICES = [
    ("One API to every model", "Internal or external", _ico("link", AI), 3.6),
    ("Model catalogue", "The most efficient model", _ico("doc", AI), 7.2),
    ("Routing and failover", "When a provider goes down", _ico("gateway", AI), 12.4),
    ("Quality checks", "Golden datasets catch drift", _ico("check", AI), 15.6),
    ("End-to-end tracing", "Every request, every provider", _ico("trace", AI), 18.0),
    ("Guardrails", "Prompt attacks blocked · PII redacted", _ico("shield", AI), 20.8),
    ("Cost and budgets", "Stops a runaway agent", _ico("coin", AI), 24.0),
]


def s10(k: Kit):
    k.background("stage-ai.png")
    k.heading("Model as a Service", "What the control plane provides", color="ai")
    plate = [k.rect(None, 120, 250, 1680, 100, fill="ai", fill_alpha=0.18, line="ai", line_w=3, radius=20),
             k.text(None, 120, 250, 1680, 100, "Model as a Service · control plane between agents and models",
                    size=34, bold=True, align="center", anchor="middle")]
    k.group("Plate", plate)
    k.anim("Plate", 0.4, "fade")
    for i, (t, sub, icon, at) in enumerate(SERVICES):
        row, col = (0, i) if i < 4 else (1, i - 4)
        w = 405
        x = 120 + col * (w + 20) + (0 if row == 0 else (w + 20) // 2)
        y = 400 + row * 260
        parts = [k.rect(None, x, y, w, 230, fill="panel", line="ai", line_w=2, radius=22),
                 k.image(None, icon, x + 28, y + 26, 64),
                 k.text(None, x + 28, y + 104, w - 56, 50, t, size=29, bold=True),
                 k.text(None, x + 28, y + 160, w - 56, 50, sub, size=23, color="muted")]
        k.group(f"Service {i + 1}", parts)
        k.anim(f"Service {i + 1}", at, "rise", 0.5)
    k.text("Source", 120, 960, 1680, 40, "TM Forum GB1085 §2 · alpha", size=22, color="muted")
    k.anim("Source", 0.4, "fade")


# Slide 13 — Six levers of inference cost (GB1085 §2.5.1)
LEVERS = [
    ("Capability", "Fit for the task", _ico("check", AI)),
    ("Accuracy", "Is the last nine percent worth it?", _ico("chart", AI)),
    ("Latency", "Time to first token", _ico("bolt", AI)),
    ("Throughput", "Tokens per second", _ico("rocket", AI)),
    ("Context window", "Memory is expensive", _ico("layers", AI)),
    ("Token efficiency", "Verbose models cost more", _ico("coin", AI)),
]


def s13(k: Kit):
    k.background("stage-ai.png")
    k.heading("Model as a Service", "Six levers of inference cost", color="ai")
    for i, (t, sub, icon) in enumerate(LEVERS):
        x, y = 120 + (i % 3) * 570, 260 + (i // 3) * 290
        parts = [k.rect(None, x, y, 540, 260, fill="panel", line="ai", line_w=2, radius=22),
                 k.image(None, icon, x + 32, y + 32, 72),
                 k.text(None, x + 32, y + 124, 480, 56, t, size=38, bold=True),
                 k.text(None, x + 32, y + 186, 480, 50, sub, size=26, color="muted")]
        k.group(f"Lever {i + 1}", parts)
        k.anim(f"Lever {i + 1}", (7.6, 8.0, 8.8, 10.8, 11.2, 12.0)[i], "zoom", 0.5)
    foot = [k.rect(None, 120, 860, 1680, 100, fill="ai", fill_alpha=0.12, line="ai", line_w=3, radius=20),
            k.text(None, 120, 860, 1680, 100, "Sufficient intelligence at optimal cost", size=40, bold=True,
                   align="center", anchor="middle")]
    k.group("Aim", foot)
    k.anim("Aim", 23.2, "rise", 0.6)


# Slide 14 — Canvas services for AI (redrawn from images/AI-Native Canvas/Canvas AI Capabilities.PNG)
AI_SERVICES = [
    ("Language, embedding and multimodal models", _ico("spark", AI), 5.6),
    ("Classical ML with MLOps", _ico("flask", AI), 9.2),
    ("Vector databases, anonymisation, chunking", _ico("database", AI), 12.4),
    ("AI observability: LangSmith, OpenLLMetry or another platform", _ico("trace", AI), 15.6),
    ("Model gateway", _ico("gateway", AI), 20.0),
    ("Evaluation", _ico("check", AI), 21.2),
    ("Registry of agents, tools and use cases", _ico("doc", AI), 22.4),
]


def s14(k: Kit):
    k.background("stage-ai.png")
    k.heading("Running AI at scale", "Canvas services for AI", color="ai")
    for i, (t, icon, at) in enumerate(AI_SERVICES):
        col, row = i % 2, i // 2
        w = 830
        x = 120 + col * (w + 20) if i < 6 else 120 + (w + 20) // 2
        y = 260 + row * 165
        parts = [k.rect(None, x, y, w, 140, fill="ai", fill_alpha=0.08, line="ai", line_w=2, radius=20),
                 k.image(None, icon, x + 28, y + 34, 72),
                 k.text(None, x + 124, y, w - 150, 140, t, size=30, bold=True, anchor="middle")]
        k.group(f"Service {i + 1}", parts)
        k.anim(f"Service {i + 1}", at, "rise", 0.5)


# Slide 19 — Why ODA suits AI development
ODA_FIT = [
    ("Modular components", "Small, well bounded tasks", _ico("layers", OP), 4.4),
    ("Open APIs and data models", "Clear contracts to code against", _ico("link", OP), 8.0),
    ("Component specification", "Declarative, so results can be checked", _ico("doc", OP), 13.2),
    ("Use cases and BDD tests", "The agent verifies its own work", _ico("check", OP), 17.6),
]


def s19(k: Kit):
    k.background()
    k.heading("AI building the Canvas", "Why ODA suits AI development", color="operator")
    k.text("Col 1", 120, 250, 760, 40, "ODA gives…", size=28, bold=True, color="muted")
    k.text("Col 2", 1040, 250, 760, 40, "…so a coding agent gets", size=28, bold=True, color="muted")
    for n in ("Col 1", "Col 2"):
        k.anim(n, 0.6, "fade")
    for i, (a, b, icon, at) in enumerate(ODA_FIT):
        y = 310 + i * 165
        parts = [k.rect(None, 120, y, 760, 135, fill="panel", line="operator", line_w=3, radius=20),
                 k.image(None, icon, 150, y + 32, 72),
                 k.text(None, 250, y, 610, 135, a, size=34, bold=True, anchor="middle"),
                 k.rect(None, 1040, y, 760, 135, fill="operator", fill_alpha=0.12, line="operator", line_w=2, radius=20),
                 k.text(None, 1080, y, 700, 135, b, size=32, anchor="middle")]
        k.group(f"Row {i + 1}", parts)
        k.anim(f"Row {i + 1}", at, "rise", 0.6)
        k.line(f"Arrow {i + 1}", 900, y + 68, 1020, y + 68, color="operator", width=5, arrow=True)
        k.anim(f"Arrow {i + 1}", at + 0.6, "fade")


# Slide 23 — What's available today
STATUS = [
    ("MCP as an exposed API type", "Available", "ok", 1.6),
    ("Resource inventory MCP server, with Helm tools", "Available", "ok", 4.0),
    ("Model-as-a-Service operator and model gateway", "Experimental", "ai", 7.6),
    ("Data product operator", "Experimental", "ai", 10.4),
    ("DependentAIModel resource · joins the Component spec later", "Experimental", "ai", 14.0),
    ("Model manager for classical ML", "Proposal", "muted", 19.6),
    ("AGENTS.md files and agent skills", "Available", "ok", 24.0),
]


def s23(k: Kit):
    k.background("stage-ai.png")
    k.heading("Status", "What's available today", color="ai")
    for i, (t, st, color, at) in enumerate(STATUS):
        y = 260 + i * 98
        parts = [k.rect(None, 120, y, 1680, 82, fill="panel", line="panelEdge", line_w=2, radius=16),
                 k.rect(None, 120, y, 10, 82, fill=color, radius=0),
                 k.text(None, 160, y, 1280, 82, t, size=30, bold=True, anchor="middle")]
        parts.append(k.pill(None, 1520, y + 18, st, color, size=24, w=250))
        k.group(f"Status {i + 1}", parts)
        k.anim(f"Status {i + 1}", at, "fade", 0.5)


# Slide 24 — Find out more
LINKS = [
    ("AI-Native Canvas design", "github.com/tmforum-oda/oda-canvas › AI-Native-Canvas-design.md",
     "https://github.com/tmforum-oda/oda-canvas/blob/main/AI-Native-Canvas-design.md", "ai", 0.6),
    ("Model-as-a-Service guide", "TM Forum GB1085 · Model-as-a-Service (MODaaS) Introductory Guide", None, "ai", 6.0),
    ("Contribute with AI", "github.com/tmforum-oda/oda-canvas › AGENTS.md · skills/",
     "https://github.com/tmforum-oda/oda-canvas/tree/main/skills", "operator", 14.4),
    ("ODA agent skills marketplace", "github.com/tmforum-oda/oda-agent-skills-marketplace · agent skills plugins for ODA",
     "https://github.com/tmforum-oda/oda-agent-skills-marketplace", "operator", 19.2),
]


def s24(k: Kit):
    k.background("stage-title.png")
    k.heading("Find out more", "Design, guide and code", color="ai")
    for i, (label, sub, url, color, at) in enumerate(LINKS):
        y = 270 + i * 150
        parts = [k.rect(None, 120, y, 1680, 126, fill="panel", line=color, line_w=3, radius=22),
                 k.text(None, 160, y + 18, 1200, 50, label, size=38, bold=True),
                 k.text(None, 160, y + 72, 1500, 40, sub, size=28, color="muted")]
        if url:
            for p in parts:  # the whole card is clickable
                p.click_action.hyperlink.address = url
        k.group(f"Link {i + 1}", parts)
        k.anim(f"Link {i + 1}", at, "rise", 0.6)
    k.text("Hub", 120, 900, 1680, 50, "Developed in the open in the TM Forum Innovation Hub", size=30, color="muted", bold=True)
    k.anim("Hub", 9.6, "fade")


BUILDERS = {1: s01, 2: s02, 3: s03, 6: s06, 9: s09, 10: s10, 13: s13, 14: s14, 19: s19, 23: s23, 24: s24}
