import { store } from "../../shared/store"
import NodeStyles from "./NodeStyles"

export default () => {
	const showingStyles = () => store.activeSidebar === "nodeStyles"

	return (
		<div class="absolute left-0 top-0 h-full z-[1000] w-[65px] pointer-events-none">
			<div class="relative h-full flex overflow-hidden pointer-events-none w-fit">
				<div
					class="h-full transition-transform duration-300 ease-in-out pointer-events-auto flex items-center"
					classList={{
						"-translate-x-full": !showingStyles(),
						"translate-x-0": showingStyles()
					}}
				>
					<NodeStyles />
				</div>
			</div>
		</div>
	)
}
