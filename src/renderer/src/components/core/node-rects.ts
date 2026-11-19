import { batch } from "solid-js"
import { createStore } from "solid-js/store"

export interface Rect { x: number; y: number; w: number; h: number }

export const [rects, setRects] = createStore<Record<string, Rect>>({})

const TRANSLATE = /translate3d\(\s*(-?[\d.e+-]+)px,\s*(-?[\d.e+-]+)px/

function read(el: HTMLElement): Rect {
    let x = 0, y = 0
    const m = TRANSLATE.exec(el.style.transform)
    if (m) {
        x = parseFloat(m[1])
        y = parseFloat(m[2])
    } else {
        const t = new DOMMatrixReadOnly(getComputedStyle(el).transform)
        x = t.m41
        y = t.m42
    }
    // offsetWidth/Height ignore ancestor scale, which is what we want (world coords)
    return { x: x + el.offsetLeft, y: y + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
}

function measure(root: ParentNode) {
    batch(() => {
        const seen = new Set<string>()
        root.querySelectorAll<HTMLElement>('[id^="node_"]').forEach((el) => {
            seen.add(el.id)
            const r = read(el)
            const o = rects[el.id]
            if (!o || o.x !== r.x || o.y !== r.y || o.w !== r.w || o.h !== r.h) setRects(el.id, r)
        })
        for (const id in rects) if (!seen.has(id)) setRects(id, undefined as any)
    })
}

/** root = the world div that contains the nodes (and the #edges layer) */
export function trackNodes(root: HTMLElement) {
    const run = () => measure(root)
    const ro = new ResizeObserver(run)
    const observe = () =>
        root.querySelectorAll('[id^="node_"]').forEach((n) => ro.observe(n))

    const mo = new MutationObserver((muts) => {
        // ignore our own edge layer
        const relevant = muts.filter((m) => !(m.target as Element).closest?.("#edges"))
        if (!relevant.length) return
        if (relevant.some((m) => m.type === "childList")) observe()
        run()
    })
    mo.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["style"] })

    observe()
    run()
    return () => { mo.disconnect(); ro.disconnect() }
}