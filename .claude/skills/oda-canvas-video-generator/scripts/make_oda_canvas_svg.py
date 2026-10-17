"""Generate the ODA Canvas picture as scalable SVG, traced from images/AI-Native-Canvas.webp.

Usage: python make_oda_canvas_svg.py [out_dir]       (default: images/)
Writes:
  ODA-Canvas.svg        the platform labelled "ODA Canvas" (decks about the Canvas in general)
  ODA-Canvas-dark.svg   the same with light outlines, for dark slide backgrounds (the deck stage)
  AI-Native-Canvas.svg  the original's label, "AI-Native Canvas" (AI-Native material)

The picture: a platform (tray) of eight capability modules, with ODA Component interfaces
(exposed-API lollipops and dependent-API sockets) along its top edge, standing on a navy base
that carries the label. Render to PNG for native slides with tools/svg_to_png.mjs.
"""

import os
import sys

NAVY = "#10284C"
TRAY = "#E8EDF5"
BASE = "#13294F"
BEVEL = "#2B4677"
ACCENT = "#3B82F6"
WHITE = "#FFFFFF"
DARK_EDGE = "#B9C8E3"                # outlines for the dark-background variant
FONT = "Segoe UI, Inter, Arial, sans-serif"

TOP_Y, FLOOR_Y = 298, 628            # tray top edge and floor
TOP_L, TOP_R = 122, 1550             # tray top corners
FLOOR_L, FLOOR_R = 22, 1650          # tray floor corners
ROWS = [(326, 458), (484, 614)]      # tile rows (top, bottom)

# name, label lines, fill, icon, row, inner x-bounds (None = follows the tray's slanted side)
TILES = [
    ("component", ["Component", "Mgmt"], "#1E5AA0", "cube", 0, (None, 473)),
    ("api", ["API Mgmt"], "#2B55A8", "gear", 0, (483, 828)),
    ("observability", ["Observability"], "#2D7FD3", "chart", 0, (842, 1188)),
    ("identity", ["Identity &", "Credentials"], "#1B8B8F", "person", 0, (1198, None)),
    ("cost", ["Cost"], "#7F8CA3", "tag", 1, (None, 462)),
    ("carbon", ["Carbon"], "#2F8F72", "leaf", 1, (472, 828)),
    ("model", ["Model", "Operator"], "#5A5AA3", "network", 1, (842, 1200)),
    ("data", ["Data", "Operator"], "#3A2F7D", "database", 1, (1210, None)),
]
CONNECTORS = [213, 375, 545, 730, 930, 1100, 1270, 1460]  # lollipop, socket, lollipop, ...


def side_x(y: float, left: bool, inset: float = 28) -> float:
    """x of the tray's slanted side at height y, moved `inset` inwards."""
    t = (y - TOP_Y) / (FLOOR_Y - TOP_Y)
    if left:
        return TOP_L + (FLOOR_L - TOP_L) * t + inset
    return TOP_R + (FLOOR_R - TOP_R) * t - inset


def f(v: float) -> str:
    return f"{v:.1f}".rstrip("0").rstrip(".")


def icon(kind: str, cx: float, cy: float) -> str:
    s = f'stroke="{NAVY}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"'
    if kind == "cube":
        top = f"{f(cx)},{f(cy - 34)} {f(cx + 30)},{f(cy - 17)} {f(cx)},{f(cy)} {f(cx - 30)},{f(cy - 17)}"
        left = f"{f(cx - 30)},{f(cy - 17)} {f(cx)},{f(cy)} {f(cx)},{f(cy + 34)} {f(cx - 30)},{f(cy + 17)}"
        right = f"{f(cx + 30)},{f(cy - 17)} {f(cx)},{f(cy)} {f(cx)},{f(cy + 34)} {f(cx + 30)},{f(cy + 17)}"
        return (f'<polygon points="{top}" fill="{WHITE}" {s}/><polygon points="{left}" fill="#DCE4F0" {s}/>'
                f'<polygon points="{right}" fill="{WHITE}" {s}/>')
    if kind == "gear":
        import math
        pts = []
        for i in range(16):
            r = 36 if i % 2 == 0 else 27
            for da in (-7, 7):
                a = math.radians(i * 22.5 + da)
                pts.append(f"{f(cx + r * math.cos(a))},{f(cy + r * math.sin(a))}")
        return (f'<polygon points="{" ".join(pts)}" fill="{WHITE}" {s}/>'
                f'<circle cx="{f(cx)}" cy="{f(cy)}" r="11" fill="{NAVY}"/>')
    if kind == "chart":
        bars = [(-30, 14), (-8, 30), (14, 48)]
        out = "".join(f'<rect x="{f(cx + x)}" y="{f(cy + 26 - h)}" width="17" height="{h}" rx="2" fill="{WHITE}" {s}/>'
                      for x, h in bars)
        return out + f'<line x1="{f(cx - 36)}" y1="{f(cy + 29)}" x2="{f(cx + 37)}" y2="{f(cy + 29)}" {s}/>'
    if kind == "person":
        return (f'<circle cx="{f(cx)}" cy="{f(cy - 14)}" r="16" fill="{WHITE}" {s}/>'
                f'<path d="M {f(cx - 30)} {f(cy + 32)} Q {f(cx - 30)} {f(cy + 6)} {f(cx)} {f(cy + 6)} '
                f'Q {f(cx + 30)} {f(cy + 6)} {f(cx + 30)} {f(cy + 32)} Z" fill="{WHITE}" {s}/>')
    if kind == "tag":
        return (f'<g transform="rotate(-45 {f(cx)} {f(cy)})">'
                f'<path d="M {f(cx - 34)} {f(cy - 17)} L {f(cx + 14)} {f(cy - 17)} L {f(cx + 34)} {f(cy)} '
                f'L {f(cx + 14)} {f(cy + 17)} L {f(cx - 34)} {f(cy + 17)} Z" fill="{WHITE}" {s}/>'
                f'<circle cx="{f(cx + 13)}" cy="{f(cy)}" r="5" fill="{NAVY}"/></g>')
    if kind == "leaf":
        w = f'stroke="{WHITE}" stroke-width="6" stroke-linecap="round" fill="none"'
        return (f'<path d="M {f(cx - 26)} {f(cy + 30)} C {f(cx - 30)} {f(cy - 10)} {f(cx)} {f(cy - 34)} {f(cx + 30)} {f(cy - 34)} '
                f'C {f(cx + 32)} {f(cy)} {f(cx + 6)} {f(cy + 26)} {f(cx - 26)} {f(cy + 30)} Z" {w}/>'
                f'<path d="M {f(cx - 30)} {f(cy + 38)} Q {f(cx - 4)} {f(cy - 2)} {f(cx + 22)} {f(cy - 24)}" {w}/>')
    if kind == "network":
        import math
        nodes = [(cx + 32 * math.cos(math.radians(a)), cy + 32 * math.sin(math.radians(a))) for a in range(-90, 270, 60)]
        lines = "".join(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{WHITE}" stroke-width="6"/>'
                        for (x1, y1), (x2, y2) in zip(nodes, nodes[1:] + nodes[:1]))
        lines += f'<line x1="{f(nodes[0][0])}" y1="{f(nodes[0][1])}" x2="{f(nodes[3][0])}" y2="{f(nodes[3][1])}" stroke="{WHITE}" stroke-width="5"/>'
        dots = "".join(f'<circle cx="{f(x)}" cy="{f(y)}" r="9" fill="{WHITE}" {s}/>' for x, y in nodes)
        return lines + dots
    if kind == "database":
        out = f'<path d="M {f(cx - 30)} {f(cy - 24)} L {f(cx - 30)} {f(cy + 24)} A 30 11 0 0 0 {f(cx + 30)} {f(cy + 24)} L {f(cx + 30)} {f(cy - 24)}" fill="{WHITE}" {s}/>'
        for dy in (-8, 8):
            out += f'<path d="M {f(cx - 30)} {f(cy + dy)} A 30 11 0 0 0 {f(cx + 30)} {f(cy + dy)}" fill="none" {s}/>'
        return out + f'<ellipse cx="{f(cx)}" cy="{f(cy - 24)}" rx="30" ry="11" fill="{WHITE}" {s}/>'
    raise ValueError(kind)


def tile(name, lines, fill, kind, row, bounds) -> str:
    top, bot = ROWS[row]
    gap = 7  # half the light gap between neighbouring tiles
    xl0 = side_x(top, True) if bounds[0] is None else bounds[0] + gap
    xl1 = side_x(bot, True) if bounds[0] is None else bounds[0] + gap
    xr0 = side_x(top, False) if bounds[1] is None else bounds[1] - gap
    xr1 = side_x(bot, False) if bounds[1] is None else bounds[1] - gap
    poly = f"{f(xl0)},{top} {f(xr0)},{top} {f(xr1)},{bot} {f(xl1)},{bot}"
    mid = (top + bot) / 2
    left = max(xl0, xl1)
    ix = left + 62
    tx = ix + 58
    size = 32
    first = mid - (len(lines) - 1) * size * 0.58
    text = "".join(f'<text x="{f(tx)}" y="{f(first + i * size * 1.16 + size * 0.36)}" font-size="{size}">{t.replace("&", "&amp;")}</text>'
                   for i, t in enumerate(lines))
    return (f'<g id="{name}"><polygon points="{poly}" fill="{fill}" stroke="{NAVY}" stroke-width="8" stroke-linejoin="round"/>'
            f'{icon(kind, ix, mid)}<g fill="{WHITE}" font-family="{FONT}" font-weight="700">{text}</g></g>')


def connectors(line: str = NAVY, head: str = WHITE) -> str:
    out = []
    for i, x in enumerate(CONNECTORS):
        if i % 2 == 0:  # exposed API: lollipop
            out.append(f'<line x1="{x}" y1="250" x2="{x}" y2="{TOP_Y}" stroke="{line}" stroke-width="11"/>'
                       f'<circle cx="{x}" cy="222" r="28" fill="{head}" stroke="{line}" stroke-width="11"/>')
        else:           # dependent API: socket
            out.append(f'<line x1="{x}" y1="241" x2="{x}" y2="{TOP_Y}" stroke="{line}" stroke-width="11"/>'
                       f'<path d="M {x - 34} 205 A 34 34 0 0 0 {x + 34} 205" fill="none" stroke="{line}" '
                       f'stroke-width="11" stroke-linecap="round"/>')
    return "".join(out)


def svg(label: str, dark: bool = False) -> str:
    """dark=True: light outlines on the interfaces and tray, for dark slide backgrounds."""
    edge = DARK_EDGE if dark else NAVY
    tray = f"{TOP_L},{TOP_Y} {TOP_R},{TOP_Y} {FLOOR_R},{FLOOR_Y} {FLOOR_L},{FLOOR_Y}"
    base = f"{FLOOR_L},{FLOOR_Y} {FLOOR_R},{FLOOR_Y} {FLOOR_R},748 {FLOOR_R - 30},778 {FLOOR_L + 30},778 {FLOOR_L},748"
    bevel_l = f"{FLOOR_L},{FLOOR_Y} {FLOOR_L + 40},{FLOOR_Y + 14} {FLOOR_L + 40},768 {FLOOR_L + 30},778 {FLOOR_L},748"
    bevel_r = f"{FLOOR_R},{FLOOR_Y} {FLOOR_R - 40},{FLOOR_Y + 14} {FLOOR_R - 40},768 {FLOOR_R - 30},778 {FLOOR_R},748"
    body = (
        connectors(edge, "#0F1B33" if dark else WHITE)
        + f'<polygon points="{tray}" fill="{TRAY}" stroke="{edge}" stroke-width="11" stroke-linejoin="round"/>'
        + "".join(tile(*t) for t in TILES)
        + f'<polygon points="{base}" fill="{BASE}" stroke="{edge}" stroke-width="8" stroke-linejoin="round"/>'
        + f'<polygon points="{bevel_l}" fill="{BEVEL}"/><polygon points="{bevel_r}" fill="{BEVEL}"/>'
        + f'<line x1="105" y1="712" x2="450" y2="712" stroke="{ACCENT}" stroke-width="6" stroke-linecap="round"/>'
        + f'<line x1="1222" y1="712" x2="1567" y2="712" stroke="{ACCENT}" stroke-width="6" stroke-linecap="round"/>'
        + f'<text x="836" y="737" text-anchor="middle" fill="{WHITE}" font-family="{FONT}" font-weight="800" '
          f'font-size="70">{label}</text>'
    )
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 180 1652 610" width="1652" height="610" '
            f'role="img" aria-label="{label}: a platform of capability modules with ODA Component interfaces">'
            f"<title>{label}</title>{body}</svg>\n")


def main() -> None:
    out = sys.argv[1] if len(sys.argv) > 1 else "images"
    for label, name, dark in (("ODA Canvas", "ODA-Canvas.svg", False), ("ODA Canvas", "ODA-Canvas-dark.svg", True),
                              ("AI-Native Canvas", "AI-Native-Canvas.svg", False)):
        with open(os.path.join(out, name), "w", encoding="utf-8") as fh:
            fh.write(svg(label, dark))
        print("wrote", os.path.join(out, name))


if __name__ == "__main__":
    main()
