import NodeStyles from "./NodeStyles"
import EdgeStyles from "./EdgeStyles"
import { createEffect } from "solid-js"
import { setStore, store } from "../../shared/store"


export default () => {
	const showingStyles = () =>
		store.activeSidebar === "nodeStyles" ||
		store.activeSidebar === "edgeStyles"

	createEffect(() => {
		if (store.selectedNodes.size > 0) {
			setStore("activeSidebar", "nodeStyles")
		} else if (store.selectedEdge) {
			setStore("activeSidebar", "edgeStyles")
		} else {
			setStore("activeSidebar", "nodes")
		}
	})

	return (
		<div class="absolute left-0 top-0 h-full z-[1000] w-[65px] pointer-events-none">
			<div class="relative h-full flex pointer-events-none w-fit" style={{ "clip-path": "inset(0 -1000px 0 0)" }}>
				<div
					class="h-full transition-transform duration-300 ease-in-out pointer-events-none flex items-center"
					classList={{
						"-translate-x-full": !showingStyles(),
						"translate-x-0": showingStyles()
					}}
				>
					{store.activeSidebar === "nodeStyles" && <NodeStyles />}
					{store.activeSidebar === "edgeStyles" && <EdgeStyles />}
				</div>
			</div>
		</div>
	)
}