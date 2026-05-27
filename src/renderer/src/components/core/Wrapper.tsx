import { Show, createEffect, createSignal, onMount } from 'solid-js'
import ColorSelectMenu from '../ui/ColorSelectMenu'
import Controls from './Controls'
import EventHandler from './EventHandler'
import Nodes from './Nodes'
import Pan from './Pan'
import ViewPort from './ViewPort'
import Zoom from './Zoom'
import { setStore, store } from '../../shared/store'
import { updateArrowsPositions } from '../../shared/utils'
import MiniMap from './MiniMap'

export default () => {
	const [wrapperRef, setWrapperRef] = createSignal(null)

	createEffect(() => {
		const g0 = store.viewport.scale
		const g1 = store.viewport.x
		const g2 = store.viewport.y
		const g3 = store.viewport.width
		const g4 = store.viewport.height
		updateArrowsPositions()
	})

	onMount(() => {
		setTimeout(() => {
			Object.entries(store.edges).forEach(([nodeId, edges]) => {
				//TODO: maybe later do this only for the active board and, and make it a functiona that is called each time a board is changed
				edges.forEach((edge) => {
					//@ts-ignore //? because its loaded in the index as a .min.js file
					const ourLine = new LeaderLine(document.getElementById(edge.srcNodeId), document.getElementById(edge.distNodeId), {
						color: edge.color,
						middleLabel: LeaderLine.captionLabel(edge.label, {
							color: 'white',
							outlineColor: edge.color,
							fontWeight: 'bold',
							fontSize: '14px'
						}),
						path: edge.type
					})

					setStore('arrowLines', (prev) => {
						const next = new Map(prev)
						next.set(edge.srcNodeId, [...(next.get(edge.srcNodeId) || []), ourLine])
						return next
					})
					setStore('arrowLines', (prev) => {
						const next = new Map(prev)
						next.set(edge.distNodeId, [...(next.get(edge.distNodeId) || []), ourLine])
						return next
					})
				})
			})
		}, 2000)
	})

	// wrapper width and lenght are defined in the store
	return (
		<div id="wrapper">
			<ColorSelectMenu />
			<EventHandler>
				<Zoom>
					<Pan>
						<ViewPort wrapperRef={setWrapperRef}>
							<Nodes />
							<div id="edges"></div>
						</ViewPort>
						<Show when={store.userConfig.showMiniMap}>
							<MiniMap wrapperRef={() => wrapperRef} />
						</Show>
						<Controls />
					</Pan>
				</Zoom>
			</EventHandler>
		</div>
	)
}
