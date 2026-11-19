import { EdgeType } from "../../types"
import type { Rect } from "./node-rects"

export interface Pt { x: number; y: number }
export interface EdgeGeometry {
    d: string
    start: Pt      // arrowhead tip at source
    end: Pt        // arrowhead tip at destination
    startDir: Pt   // direction the source head points (into the source node)
    endDir: Pt     // direction the dest head points (into the dest node)
    mid: Pt        // label position
}

type Side = "left" | "right" | "top" | "bottom"
const NORMAL: Record<Side, Pt> = {
    right: { x: 1, y: 0 }, left: { x: -1, y: 0 },
    bottom: { x: 0, y: 1 }, top: { x: 0, y: -1 },
}

const add = (a: Pt, b: Pt, k = 1): Pt => ({ x: a.x + b.x * k, y: a.y + b.y * k })
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y)
const unit = (a: Pt, b: Pt): Pt => {
    const d = dist(a, b) || 1
    return { x: (b.x - a.x) / d, y: (b.y - a.y) / d }
}
const neg = (a: Pt): Pt => ({ x: -a.x, y: -a.y })
const center = (r: Rect): Pt => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 })

function anchor(r: Rect, s: Side): Pt {
    switch (s) {
        case "left": return { x: r.x, y: r.y + r.h / 2 }
        case "right": return { x: r.x + r.w, y: r.y + r.h / 2 }
        case "top": return { x: r.x + r.w / 2, y: r.y }
        case "bottom": return { x: r.x + r.w / 2, y: r.y + r.h }
    }
}

function borderPoint(r: Rect, toward: Pt): Pt {
    const c = center(r)
    const dx = toward.x - c.x, dy = toward.y - c.y
    const kx = r.w ? Math.abs(dx) / (r.w / 2) : 0
    const ky = r.h ? Math.abs(dy) / (r.h / 2) : 0
    const k = Math.max(kx, ky)
    if (!k) return c // zero-size rect (free end) -> the point itself
    return { x: c.x + dx / k, y: c.y + dy / k }
}

function pickSides(a: Rect, b: Rect): [Side, Side] {
    const dx = b.x + b.w / 2 - (a.x + a.w / 2)
    const dy = b.y + b.h / 2 - (a.y + a.h / 2)
    const nx = Math.abs(dx) / Math.max((a.w + b.w) / 2, 1)
    const ny = Math.abs(dy) / Math.max((a.h + b.h) / 2, 1)
    if (nx >= ny) return dx >= 0 ? ["right", "left"] : ["left", "right"]
    return dy >= 0 ? ["bottom", "top"] : ["top", "bottom"]
}

/* ---------- individual geometries ---------- */

function line(p1: Pt, p2: Pt, insetS: number, insetD: number): EdgeGeometry {
    const u = unit(p1, p2)
    const a = add(p1, u, insetS), b = add(p2, u, -insetD)
    return {
        d: `M${a.x} ${a.y}L${b.x} ${b.y}`,
        start: p1, end: p2,
        startDir: neg(u), endDir: u,
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    }
}

function arc(src: Rect, dst: Rect, insetS: number, insetD: number): EdgeGeometry {
    const c1 = center(src), c2 = center(dst)
    const L = dist(c1, c2)
    const u = unit(c1, c2)
    const perp = { x: -u.y, y: u.x }
    const bulge = Math.min(L * 0.2, 100)
    const m = { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 }
    const c = add(m, perp, bulge * 2) // control point

    // each end sits where the ray from its node's center toward `c` leaves the node,
    // so the curve's tangent there points straight at the center
    const p1 = borderPoint(src, c), p2 = borderPoint(dst, c)

    const t1 = unit(p1, c), t2 = unit(c, p2)
    const a = add(p1, t1, insetS), b = add(p2, t2, -insetD)
    return {
        d: `M${a.x} ${a.y}Q${c.x} ${c.y} ${b.x} ${b.y}`,
        start: p1, end: p2,
        startDir: neg(t1), endDir: t2,
        mid: { x: 0.25 * a.x + 0.5 * c.x + 0.25 * b.x, y: 0.25 * a.y + 0.5 * c.y + 0.25 * b.y },
    }
}

function fluid(p1: Pt, p2: Pt, n1: Pt, n2: Pt, insetS: number, insetD: number): EdgeGeometry {
    const a = add(p1, n1, insetS), b = add(p2, n2, insetD)
    const k = Math.min(Math.max(dist(a, b) * 0.5, 40), 200)
    const c1 = add(a, n1, k), c2 = add(b, n2, k)
    return {
        d: `M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`,
        start: p1, end: p2,
        startDir: neg(n1), endDir: neg(n2),
        mid: { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 },
    }
}

function grid(p1: Pt, p2: Pt, s1: Side, n1: Pt, n2: Pt, insetS: number, insetD: number): EdgeGeometry {
    const a = add(p1, n1, insetS), b = add(p2, n2, insetD)
    const horizontal = s1 === "left" || s1 === "right"
    const pts: Pt[] = horizontal
        ? (() => { const mx = (a.x + b.x) / 2; return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b] })()
        : (() => { const my = (a.y + b.y) / 2; return [a, { x: a.x, y: my }, { x: b.x, y: my }, b] })()
    return {
        d: "M" + pts.map((p) => `${p.x} ${p.y}`).join("L"),
        start: p1, end: p2,
        startDir: neg(n1), endDir: neg(n2),
        mid: { x: (pts[1].x + pts[2].x) / 2, y: (pts[1].y + pts[2].y) / 2 },
    }
}

/* ---------- entry point ---------- */

/** insetS / insetD = how much to shorten the line so it doesn't poke through the arrowheads */
export function computeEdge(
    src: Rect, dst: Rect, type: EdgeType, insetS: number, insetD: number,
): EdgeGeometry {
    // center-aimed types
    if (type === EdgeType.straight || type === EdgeType.magnet) {
        return line(borderPoint(src, center(dst)), borderPoint(dst, center(src)), insetS, insetD)
    }
    if (type === EdgeType.arc) return arc(src, dst, insetS, insetD)

    // side-based types
    const [s1, s2] = pickSides(src, dst)
    const p1 = anchor(src, s1), p2 = anchor(dst, s2)
    const n1 = NORMAL[s1], n2 = NORMAL[s2]

    switch (type) {
        case EdgeType.grid: return grid(p1, p2, s1, n1, n2, insetS, insetD)
        case EdgeType.fluid:
        default: return fluid(p1, p2, n1, n2, insetS, insetD)
    }
}

