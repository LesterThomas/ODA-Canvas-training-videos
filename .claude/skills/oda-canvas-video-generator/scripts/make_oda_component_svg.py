"""Generate the standard ODA Component symbol as scalable SVG, traced from images/ODA-Component.png.

Usage: python make_oda_component_svg.py [out_dir]       (default: images/)
Writes:
  ODA-Component.svg       full symbol with segment labels (slides, docs, large sizes)
  ODA-Component-icon.svg  same symbol without text (small sizes, where labels would be unreadable)

The geometry here is mirrored by videos/src/lib/OdaComponent.tsx (the animatable Remotion version).
If you change the shape, colours or interface positions, change both.
"""

import math
import os
import sys

NAVY = "#1A2747"
SEG = {
    "core": "#7E9E54",          # Core Function (green)
    "notification": "#FABB42",  # Notification / Reporting (yellow)
    "security": "#E0141D",      # Security (red)
    "environment": "#D3D4DA",   # Environment Dependence / Requirements (grey)
    "management": "#6596CE",    # Management / Operations (blue)
}
HUB = "#E9E9EE"

CX, CY, R = 400.0, 380.0, 245.0  # pointy-top hexagon in an 800 x 760 box


def vertex(i: int) -> tuple[float, float]:
    """0=top, 1=upper-right, 2=lower-right, 3=bottom, 4=lower-left, 5=upper-left."""
    a = math.radians(-90 + 60 * i)
    return CX + R * math.cos(a), CY + R * math.sin(a)


V = [vertex(i) for i in range(6)]
C = (CX, CY)

# Segment polygons (centre + hexagon vertices). Core Function spans two sides (120 degrees).
SEGMENTS = [
    ("core", [C, V[5], V[0], V[1]]),
    ("notification", [C, V[1], V[2]]),
    ("security", [C, V[2], V[3]]),
    ("environment", [C, V[3], V[4]]),
    ("management", [C, V[4], V[5]]),
]

# Interfaces: (edge start vertex, edge end vertex, fraction along edge, kind)
#   "api"  = exposed API, drawn as a lollipop (line + circle)
#   "dep"  = dependent API, drawn as a socket (line + cup opening outward)
INTERFACES = [
    (5, 0, 0.32, "api"), (5, 0, 0.65, "dep"),
    (0, 1, 0.38, "api"), (0, 1, 0.68, "dep"),
    (1, 2, 0.34, "api"), (1, 2, 0.62, "dep"),
    (2, 3, 0.30, "api"), (2, 3, 0.63, "dep"),
    (4, 5, 0.33, "api"), (4, 5, 0.66, "dep"),
]
STEM, BALL_R, CUP_R = 52.0, 19.0, 22.0

LABELS = [  # (lines, x, y, fill)
    (["Core", "Function"], 400, 228, "#FFFFFF"),
    (["Management", "/Operations"], 268, 378, "#FFFFFF"),
    (["Notification", "/Reporting"], 535, 378, NAVY),
    (["Environment", "Dependence/", "Requirements"], 320, 506, NAVY),
    (["Security"], 482, 512, "#FFFFFF"),
]


def f(v: float) -> str:
    return f"{v:.1f}".rstrip("0").rstrip(".")


def pts(p):
    return " ".join(f"{f(x)},{f(y)}" for x, y in p)


def interface_svg(a: int, b: int, t: float, kind: str) -> str:
    (ax, ay), (bx, by) = V[a], V[b]
    px, py = ax + (bx - ax) * t, ay + (by - ay) * t
    mx, my = (ax + bx) / 2 - CX, (ay + by) / 2 - CY  # outward normal of this edge
    ln = math.hypot(mx, my)
    nx, ny = mx / ln, my / ln
    ex, ey = px + nx * STEM, py + ny * STEM
    stem = f'<line x1="{f(px)}" y1="{f(py)}" x2="{f(ex)}" y2="{f(ey)}"/>'
    if kind == "api":
        cx, cy = ex + nx * BALL_R, ey + ny * BALL_R
        return f'<g class="api">{stem}<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(BALL_R)}" fill="#FFFFFF"/></g>'
    # Socket: semicircle whose bottom touches the stem end and opens away from the hexagon.
    cx, cy = ex + nx * CUP_R, ey + ny * CUP_R
    tx, ty = -ny, nx
    sx, sy = cx + tx * CUP_R, cy + ty * CUP_R
    qx, qy = cx - tx * CUP_R, cy - ty * CUP_R
    # Sweep so the arc passes through the stem end (cx - n*r): angle from start to mid must be +90 deg.
    a0 = math.atan2(sy - cy, sx - cx)
    am = math.atan2(-ny, -nx)
    sweep = 1 if math.isclose((am - a0) % (2 * math.pi), math.pi / 2, abs_tol=1e-6) else 0
    return (
        f'<g class="dep">{stem}<path d="M {f(sx)} {f(sy)} A {f(CUP_R)} {f(CUP_R)} 0 0 {sweep} {f(qx)} {f(qy)}" '
        f'fill="none"/></g>'
    )


# Centre badge: a data disc above an exposed-API lollipop and a dependent-API socket whose stems
# cross, i.e. the component's own data plus the two interface symbols overlapped.
HUB_DISC = (CX, CY - 28, 25.0, 6.5, 11.0)  # cx, cy, rx, ry, body height
HUB_IFACES = [  # (base x, base y, angle degrees, stem length, radius, kind)
    (CX - 11, CY + 62, -104.0, 41.0, 12.0, "api"),
    (CX - 60, CY + 58, -30.0, 70.0, 14.0, "dep"),
]


def mini_interface(bx, by, ang, length, r, kind) -> str:
    nx, ny = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    ex, ey = bx + nx * length, by + ny * length
    stem = f'<line x1="{f(bx)}" y1="{f(by)}" x2="{f(ex)}" y2="{f(ey)}"/>'
    cx, cy = ex + nx * r, ey + ny * r
    if kind == "api":
        return stem + f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{SEG["environment"]}"/>'
    tx, ty = -ny, nx
    sx, sy, qx, qy = cx + tx * r, cy + ty * r, cx - tx * r, cy - ty * r
    a0 = math.atan2(sy - cy, sx - cx)
    am = math.atan2(-ny, -nx)
    sweep = 1 if math.isclose((am - a0) % (2 * math.pi), math.pi / 2, abs_tol=1e-6) else 0
    return stem + f'<path d="M {f(sx)} {f(sy)} A {f(r)} {f(r)} 0 0 {sweep} {f(qx)} {f(qy)}"/>'


def hub_svg() -> str:
    dx, dy, rx, ry, hgt = HUB_DISC
    return (
        # The hub is grey and its outline is open over the Environment segment (90 to 150 degrees),
        # so hub and segment read as one shape, as in the original artwork.
        f'<circle cx="{f(CX)}" cy="{f(CY)}" r="52" fill="{SEG["environment"]}"/>'
        f'<path d="M {f(CX)} {f(CY + 52)} A 52 52 0 1 0 {f(CX + 52 * math.cos(math.radians(150)))} '
        f'{f(CY + 52 * math.sin(math.radians(150)))}" fill="none" stroke="{NAVY}" stroke-width="7" stroke-linecap="round"/>'
        f'<g fill="none" stroke="{NAVY}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">'
        f'<path d="M {f(dx - rx)} {f(dy)} v {f(hgt)} a {f(rx)} {f(ry)} 0 0 0 {f(2 * rx)} 0 v {f(-hgt)}" fill="{HUB}"/>'
        f'<ellipse cx="{f(dx)}" cy="{f(dy)}" rx="{f(rx)}" ry="{f(ry)}" fill="{HUB}"/>'
        + "".join(mini_interface(*i) for i in HUB_IFACES)
        + "</g>"
    )


def build(labels: bool) -> str:
    out = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 40 720 680" role="img" '
        'aria-label="ODA Component: core function, management/operations, notification/reporting, '
        'security and environment dependence, with exposed APIs (lollipops) and dependent APIs (sockets)">',
        "<title>ODA Component</title>",
        f'<g stroke="{NAVY}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">',
    ]
    out += [interface_svg(*i) for i in INTERFACES]
    out.append("</g>")
    out.append(f'<g stroke="{NAVY}" stroke-width="6" stroke-linejoin="round">')
    out += [f'<polygon class="seg-{k}" points="{pts(p)}" fill="{SEG[k]}"/>' for k, p in SEGMENTS]
    out.append("</g>")
    out.append(f'<polygon points="{pts(V)}" fill="none" stroke="{NAVY}" stroke-width="12" stroke-linejoin="round"/>')
    out.append(hub_svg())
    if labels:
        out.append('<g font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-size="21" font-weight="600" text-anchor="middle">')
        for lines, x, y, fill in LABELS:
            y0 = y - (len(lines) - 1) * 12
            tspans = "".join(f'<tspan x="{x}" y="{f(y0 + i * 25)}">{l}</tspan>' for i, l in enumerate(lines))
            out.append(f'<text fill="{fill}">{tspans}</text>')
        out.append("</g>")
    out.append("</svg>")
    return "\n".join(out) + "\n"


def main() -> None:
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "images"
    for name, labels in (("ODA-Component.svg", True), ("ODA-Component-icon.svg", False)):
        path = os.path.join(out_dir, name)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(build(labels))
        print("wrote", path)


if __name__ == "__main__":
    main()
