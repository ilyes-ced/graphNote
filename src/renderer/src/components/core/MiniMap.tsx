import { For, createSignal, onMount } from "solid-js"
import { store } from "../../shared/store"
import { getBoardBgColor } from "../../shared/utils"
import Controls from "./Controls"

export default (props: { wrapperRef: any }) => {
	const aspectRatio = () => `${store.viewport.width} / ${store.viewport.height}`

	const posX = () => (-store.viewport.x / store.viewport.width / store.viewport.scale) * 100

	const posY = () => (-store.viewport.y / store.viewport.height / store.viewport.scale) * 100

	const width = () => (wrapperSize().width / store.viewport.width / store.viewport.scale) * 100

	const height = () => (wrapperSize().height / store.viewport.height / store.viewport.scale) * 100

	const [wrapperSize, setWrapperSize] = createSignal({
		width: 0,
		height: 0
	})

	onMount(() => {
		const el = props.wrapperRef()?.()
		console.log(el)
		if (!el) return

		const observer = new ResizeObserver((entries) => {
			const rect = entries[0].contentRect
			setWrapperSize({
				width: rect.width,
				height: rect.height
			})
		})

		observer.observe(el)
	})

	const nodesData = () => {
		const nodes = store.nodes[store.activeBoards.at(-1)?.id ?? "home"]
		let nodesData: {
			id: string
			x: number
			y: number
			color: string
			w: number
			h: number
		}[] = []
		if (!nodes) return
		nodes.forEach((n) => {
			const el = document.getElementById(n.id)?.getBoundingClientRect()
			nodesData.push({
				id: n.id,
				x: (n.x / store.viewport.width / store.viewport.scale) * 100,
				y: (n.y / store.viewport.width / store.viewport.scale) * 100,
				color: n.color ?? "",
				w: ((el?.width ?? 0) / store.viewport.width / store.viewport.scale) * 100,
				h: ((el?.height ?? 0) / store.viewport.width / store.viewport.scale) * 100
			})
		})
		return nodesData
	}

	return (
		<div class="absolute bottom-2.5 right-2.5 flex flex-row space-x-2.5 items-end z-100000 pointer-events-none">
			<Controls />
			<div id="minimap" class="w-50 border border-primary p-2.5 bg-background pointer-events-auto" style={{ "aspect-ratio": aspectRatio() }}>
				<div class="relative size-full border-2 border-background z-1000" style={{ background: getBoardBgColor() }}>
					<For each={nodesData()}>
						{(node) => (
							<div
								style={{
									position: "absolute",
									left: `${node.x}%`,
									top: `${node.y}%`,
									width: `${node.w}%`,
									height: `${node.h}%`,
									background: node.color && node.color != "" ? node.color : "var(--color-card)",
									border: `1px solid ${store.selectedNodes.has(node.id) ? "white" : "var(--color-background)"}`
								}}
							></div>
						)}
					</For>
					<div
						class="bg-primary/20 border border-primary"
						style={{
							position: "absolute",
							left: `${posX()}%`,
							top: `${posY()}%`,
							width: `${width()}%`,
							height: `${height()}%`
						}}
					>
						{posX()}//
						{posY()}//
						{width()}//
						{height()}//
					</div>
				</div>
			</div>
		</div>
	)
}
