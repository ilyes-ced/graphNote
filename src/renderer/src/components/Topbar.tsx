import { For, createSignal, onMount } from "solid-js"
import { Button } from "./ui/button"
import { setStore, store } from "../shared/store"
import { IconChevronsRight, IconDatabaseFilled, IconMoonFilled, IconSettings } from "@tabler/icons-solidjs"

export default () => {
	const [dataSize, setDataSize] = createSignal({
		totalSize: 0,
		imageSize: 0,
		youtubeCacheSize: 0,
		urlMetadataSize: 0
	})

	const breadcrumbsClick = (index: number) => {
		setStore("activeBoards", (items) => items.slice(0, index + 1))
	}

	onMount(async () => {
		const sizes = await window.api.getSizes()
		setDataSize(sizes)
	})

	return (
		<div id="topbar" class="z-100000 absolute w-full flex flex-row justify-between items-center bg-transparent p-2.5 pointer-events-none">
			<div id="breadcrumb" class="flex flex-row space-y-4 overflow-x-visible">
				<div class="flex flex-row">
					<For each={store.activeBoards}>
						{(breadcrumb, index) => {
							return (
								<>
									<div
										class="p-[5px] border-2 border-border transition duration-100 ease-out pointer-events-auto bg-card"
										classList={{
											breadcrumb_path: true,
											"hover:bg-primary": !(index() === store.activeBoards.length - 1),
											"border-primary": index() === store.activeBoards.length - 1
										}}
										onClick={() => (!(index() === store.activeBoards.length - 1) ? breadcrumbsClick(index()) : undefined)}
										style={{
											cursor: !(index() === store.activeBoards.length - 1) ? "pointer" : "default"
										}}
									>
										[logo]{breadcrumb.title}
									</div>
									{!(index() === store.activeBoards.length - 1) && (
										<span class="self-center mx-1 my-0 ">
											<IconChevronsRight />
										</span>
									)}
								</>
							)
						}}
					</For>
				</div>
			</div>

			<div class="flex justify-center items-center space-x-2">
				<Button class="pointer-events-auto" variant={"secondary"} onClick={() => setStore("showStorageMenu", !store.showStorageMenu)}>
					<IconDatabaseFilled />
				</Button>

				<Button class="pointer-events-auto" variant={"secondary"} onClick={() => setStore("settingsModal", !store.settingsModal)}>
					<IconSettings />
				</Button>

				<Button class="pointer-events-auto" variant={"secondary"}>
					<IconMoonFilled />
				</Button>
			</div>

			<div
				class={`z-50 transition-all duration-200 ease-in-out absolute top-[60px] right-[8px] [box-shadow:5px_5px_var(--color-primary)]
          ${store.showStorageMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
			>
				<div class="border border-border p-4 w-fit bg-card space-y-4">
					<div>
						Total storage occupied: <span class="font-extrabold text-primary">{Math.round(dataSize().totalSize / 1000 / 1000)}MB</span> /{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().totalSize / 1024 / 1024)}MiB</span>
					</div>
					<div>
						Images storage occupied: <span class="font-extrabold text-primary">{Math.round(dataSize().imageSize / 1000 / 1000)}MB</span> /{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().imageSize / 1024 / 1024)}MiB</span>
					</div>
					<div>
						Youtube videos storage occupied:{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().youtubeCacheSize / 1000 / 1000)}MB</span> /{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().youtubeCacheSize / 1024 / 1024)}MiB</span>
					</div>
					<div>
						Urls metadata storage occupied:{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().urlMetadataSize / 1000 / 1000)}MB</span> /{" "}
						<span class="font-extrabold text-primary">{Math.round(dataSize().urlMetadataSize / 1024 / 1024)}MiB</span>
					</div>
				</div>
			</div>
		</div>
	)
}
