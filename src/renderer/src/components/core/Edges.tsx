import { For, Show, createMemo, onCleanup, onMount, createSignal } from "solid-js"

import { setStore, store } from "../../shared/store"
import { Edge, EdgeType } from "../../types"
import { computeEdge, Pt } from "./edge-geometry.ts"
import { rects, trackNodes, Rect } from "./node-rects.ts"
import { saveChanges } from "../../shared/utils.ts"

/* ---------- arrowheads: drawn with tip at (0,0) pointing +x ---------- */
const headSize = (sw: number) => Math.max(10, sw * 4.5)

const HEADS: Record<string, { inset: (s: number) => number; path: (s: number) => string; filled: boolean }> = {
	arrow: { filled: true, inset: (s) => s, path: (s) => `M0 0L${-s} ${-s * 0.4}L${-s} ${s * 0.4}Z` },
	diamond: { filled: true, inset: (s) => s, path: (s) => `M0 0L${-s / 2} ${-s / 2}L${-s} 0L${-s / 2} ${s / 2}Z` },
	circle: { filled: true, inset: (s) => s, path: (s) => `M0 0A${s / 2} ${s / 2} 0 1 0 ${-s} 0A${s / 2} ${s / 2} 0 1 0 0 0Z` },
	open: { filled: false, inset: () => 0, path: (s) => `M${-s} ${-s * 0.5}L0 0L${-s} ${s * 0.5}` },
	bar: { filled: false, inset: () => 0, path: (s) => `M0 ${-s / 2}L0 ${s / 2}` },
}

const ALIASES: Record<string, string> = {
	normal: "arrow", arrow: "arrow", triangle: "arrow", default: "arrow", "arrow-head": "arrow", arrowhead: "arrow",
	diamond: "diamond",
	circle: "circle", dot: "circle",
	open: "open", "open-arrow": "open", vee: "open",
	bar: "bar", tee: "bar",
}

/** returns a key of HEADS, or "none" */
function resolveHead(raw: string | undefined, fallback: string): string {
	if (raw === undefined || raw === null) return fallback
	const k = String(raw).trim().toLowerCase()
	if (k === "") return fallback
	if (k === "none") return "none"
	const resolved = ALIASES[k]
	if (!resolved) console.warn(`[edges] unknown arrowhead "${raw}", using arrow`)
	return resolved ?? "arrow"
}

const headInset = (kind: string, sw: number) => HEADS[kind]?.inset(headSize(sw)) ?? 0

function Head(props: { kind: string; tip: Pt; dir: Pt; color: string; stroke: number }) {
	const def = () => HEADS[props.kind]
	const angle = () => (Math.atan2(props.dir.y, props.dir.x) * 180) / Math.PI
	return (
		<Show when={def()}>
			<path
				d={def()!.path(headSize(props.stroke))}
				transform={`translate(${props.tip.x} ${props.tip.y}) rotate(${angle()})`}
				fill={def()!.filled ? props.color : "none"}
				stroke={def()!.filled ? "none" : props.color}
				stroke-width={props.stroke}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</Show>
	)
}

/* ---------- single edge ---------- */
function dash(style: string | undefined, sw: number) {
	switch (style) {
		case "dashed": return `${sw * 4} ${sw * 3}`
		case "dotted": return `0 ${sw * 2.5}`
		default: return undefined
	}
}

type End = "src" | "dist"

const boardId = () => store.activeBoards.at(-1)?.id ?? "home"

function updateEdge(id: string, patch: Partial<Edge>) {
	// undefined values delete the key in a Solid store
	setStore("edges", boardId(), (e: Edge) => e.id === id, patch)
	saveChanges()
}

const pointRect = (p: Pt): Rect => ({ x: p.x, y: p.y, w: 0, h: 0 })

/** screen px -> world coords, includes the pan/zoom transform of the world div */
function toWorld(svg: SVGSVGElement, clientX: number, clientY: number): Pt {
	const p = new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM()!.inverse())
	return { x: p.x, y: p.y }
}
function EdgeView(props: { edge: Edge }) {
	const stroke = () => props.edge.stroke ?? 2
	const color = () => props.edge.color ?? "var(--foreground)"
	const srcHead = () => resolveHead(props.edge.srcArrowHead, "none")
	const dstHead = () =>
		resolveHead(props.edge.DistArrowHead ?? (props.edge as any).distArrowHead, "arrow")
	const isSelected = () => store.selectedEdge === props.edge.id

	const [drag, setDrag] = createSignal<{ end: End; pt: Pt; hover?: string } | null>(null)

	const nodeId = (end: End) => (end === "src" ? props.edge.srcNodeId : props.edge.distNodeId)
	const storedPoint = (end: End) => (end === "src" ? props.edge.srcPoint : props.edge.distPoint)
	const otherEnd = (end: End): End => (end === "src" ? "dist" : "src")

	const endRect = (end: End): Rect | null => {
		// 1. being dragged: follow the pointer, or snap to the hovered node
		const d = drag()
		if (d?.end === end) return d.hover && rects[d.hover] ? rects[d.hover] : pointRect(d.pt)

		// 2. attached to a node
		const id = nodeId(end)
		if (id) return rects[id] ?? null

		// 3. free end with a stored point
		const p = storedPoint(end)
		if (p) return pointRect(p)

		// 4. free end with no point yet: float beside the other node
		const oid = nodeId(otherEnd(end))
		const o = oid ? rects[oid] : null
		if (!o) return null
		const sign = end === "src" ? -1 : 1
		return pointRect({ x: o.x + o.w / 2 + sign * (o.w / 2 + 120), y: o.y + o.h / 2 })
	}

	const geo = createMemo(() => {
		const s = endRect("src"), d = endRect("dist")
		if (!s || !d) return null
		return computeEdge(
			s, d, props.edge.type ?? EdgeType.fluid,
			headInset(srcHead(), stroke()),
			headInset(dstHead(), stroke()),
		)
	})
	const g = () => geo()!

	/** handle sits on the arrow tip, or on the pointer while dragging */
	const handlePos = (end: End): Pt | null => {
		const d = drag()
		if (d?.end === end) return d.pt
		const x = geo()
		return x ? (end === "src" ? x.start : x.end) : null
	}

	function startDrag(end: End, e: PointerEvent) {
		e.stopPropagation()
		e.preventDefault()
		const el = e.currentTarget as SVGGElement
		const svg = el.ownerSVGElement!
		el.setPointerCapture(e.pointerId)
		setStore("selectedEdge", props.edge.id)

		const otherId = nodeId(otherEnd(end))
		const nodeAt = (cx: number, cy: number): string | undefined => {
			for (const n of document.elementsFromPoint(cx, cy)) {
				const node = n.closest?.('[id^="node_"]')
				if (node && node.id !== otherId) return node.id // no self-loops
			}
		}
		const state = (ev: PointerEvent) => ({
			end,
			pt: toWorld(svg, ev.clientX, ev.clientY),
			hover: nodeAt(ev.clientX, ev.clientY),
		})

		setDrag(state(e))
		const move = (ev: PointerEvent) => setDrag(state(ev))
		const up = (ev: PointerEvent) => {
			el.removeEventListener("pointermove", move)
			el.removeEventListener("pointerup", up)
			el.removeEventListener("pointercancel", up)
			el.releasePointerCapture?.(ev.pointerId)

			const { pt, hover } = state(ev)
			setDrag(null)
			const idKey = end === "src" ? "srcNodeId" : "distNodeId"
			const ptKey = end === "src" ? "srcPoint" : "distPoint"
			updateEdge(
				props.edge.id,
				hover
					? { [idKey]: hover, [ptKey]: undefined }   // attach to node
					: { [idKey]: undefined, [ptKey]: pt },     // detach, free point
			)
		}
		el.addEventListener("pointermove", move)
		el.addEventListener("pointerup", up)
		el.addEventListener("pointercancel", up)
	}

	const Handle = (p: { end: End }) => (
		<Show when={(isSelected() || !nodeId(p.end)) && handlePos(p.end)}>
			{(pos) => (
				<g style={{ "pointer-events": "auto", cursor: "grab" }}
					onPointerDown={(e) => startDrag(p.end, e as any)}>
					<circle cx={pos().x} cy={pos().y} r="14" fill="transparent" />
					<circle cx={pos().x} cy={pos().y} r="5.5"
						fill="var(--background)" stroke={color()} stroke-width="2" />
				</g>
			)}
		</Show>
	)

	return (
		<Show when={geo()}>
			<g data-edge-id={props.edge.id}>
				{/* selection glow */}
				<Show when={isSelected()}>
					<path d={g().d} fill="none" stroke={color()} stroke-opacity="0.25"
						stroke-width={stroke() + 8} stroke-linecap="round" />
				</Show>

				{/* hit area: click selects */}
				<path d={g().d} fill="none" stroke="transparent"
					stroke-width={Math.max(stroke(), 14)}
					style={{ "pointer-events": "stroke", cursor: "pointer" }}
					onPointerDown={(e) => {
						e.stopPropagation()
						setStore("selectedEdge", props.edge.id)
						setStore("selectedNodes", new Set())
					}} />

				<path
					d={g().d} fill="none" stroke={color()} stroke-width={stroke()}
					stroke-dasharray={dash(props.edge.style, stroke())}
					stroke-linecap={props.edge.style === "dotted" ? "round" : "butt"}
				/>
				<Head kind={srcHead()} tip={g().start} dir={g().startDir} color={color()} stroke={stroke()} />
				<Head kind={dstHead()} tip={g().end} dir={g().endDir} color={color()} stroke={stroke()} />

				{/* snap target outline while dragging over a node */}
				<Show when={drag()?.hover && rects[drag()!.hover!]}>
					{(r) => (
						<rect x={r().x - 4} y={r().y - 4} width={r().w + 8} height={r().h + 8}
							rx="8" fill="none" stroke={color()} stroke-width="2"
							stroke-dasharray="6 4" />
					)}
				</Show>

				<Handle end="src" />
				<Handle end="dist" />

				<Show when={props.edge.label}>
					{/* your existing label <foreignObject> block, unchanged */}
				</Show>
			</g>
		</Show>
	)
}

/* ---------- layer ---------- */
export default () => {
	let el!: HTMLDivElement

	onMount(() => {
		onCleanup(trackNodes(el.parentElement!))

		// capture phase so it still runs when other handlers stopPropagation
		const down = (e: PointerEvent) => {
			if (!(e.target as Element).closest?.("[data-edge-id]")) setStore("selectedEdge", null)
		}
		const key = (e: KeyboardEvent) => e.key === "Escape" && setStore("selectedEdge", null)
		document.addEventListener("pointerdown", down, true)
		document.addEventListener("keydown", key)
		onCleanup(() => {
			document.removeEventListener("pointerdown", down, true)
			document.removeEventListener("keydown", key)
		})
	})

	const edges = () => store.edges[boardId()] ?? []

	return (
		<div id="edges" ref={el} class="pointer-events-none absolute left-0 top-0 z-10000">
			<svg width="1" height="1" class="overflow-visible">
				<For each={edges()}>{(edge) => <EdgeView edge={edge} />}</For>
			</svg>
		</div>
	)
}