import { createSignal, For, Match, onCleanup, Switch } from "solid-js"
import Svg from "../nodes/Svg"
import { newNode } from "../../shared/update"
import { NodeType } from "../../types"
import { Portal } from "solid-js/web"
import { store } from "../../shared/store"
import { IconMenu2 } from "@tabler/icons-solidjs"

const icons = [
	// basic blocks
	{ name: "note", width: 32, height: 24 },
	{ name: "todo", width: 32, height: 24 },
	//{ name: "comment", width: 32, height: 24 },
	{ name: "table", width: 32, height: 24 },
	{ name: "url", width: 32, height: 24 },

	// layout blocks
	{ name: "arrow", width: 32, height: 32 },
	{ name: "board", width: 32, height: 32 },
	{ name: "column", width: 32, height: 32 },

	// text
	// { name: "code", width: 24, height: 24 },
	// { name: "document", width: 26, height: 32 },
	// { name: "upload", width: 32, height: 32 },

	// artistic maybe
	// { name: "drawing", width: 32, height: 32 },
	// { name: "sketch", width: 32, height: 24 },
	{ name: "color", width: 28, height: 32 },
	{ name: "image", width: 32, height: 32 },
	{ name: "activity", width: 32, height: 32 }
]

const startDragging = (type: string) => (e: MouseEvent) => {
	e.preventDefault()
	setCloneType(type)
	setDragging(true)
	setDragPos({ x: e.clientX, y: e.clientY })

	window.addEventListener("mousemove", handleMouseMove)
	window.addEventListener("mouseup", handleMouseUp)
}

const [dragging, setDragging] = createSignal(false)
const [dragPos, setDragPos] = createSignal({ x: 0, y: 0 })
const [cloneType, setCloneType] = createSignal<string | null>(null)

const handleMouseMove = (e: MouseEvent) => {
	setDragPos({ x: e.clientX, y: e.clientY })
}

const handleMouseUp = () => {
	newNode(
		findType(cloneType() ?? ""),
		(dragPos().x - store.viewport.x) / store.viewport.scale,
		(dragPos().y - store.viewport.y) / store.viewport.scale
	)
	setDragging(false)
	setCloneType(null)

	// here we add to the store
	window.removeEventListener("mousemove", handleMouseMove)
	window.removeEventListener("mouseup", handleMouseUp)
}

const findType = (type: string): NodeType => {
	switch (type) {
		case "note":
			return NodeType.Note
		case "todo":
			return NodeType.Todo
		case "comment":
			return NodeType.Comment
		case "table":
			return NodeType.Table
		case "url":
			return NodeType.Url
		case "arrow":
			return NodeType.Arrow
		case "board":
			return NodeType.Board
		case "column":
			return NodeType.Column
		case "code":
			return NodeType.Code
		case "document":
			return NodeType.Document
		case "upload":
			return NodeType.Upload
		case "drawing":
			return NodeType.Drawing
		case "sketch":
			return NodeType.Sketch
		case "color":
			return NodeType.Color
		case "image":
			return NodeType.Image
		case "activity":
			return NodeType.Activity
		default:
			throw new Error(`Unsupported node type: ${type}`)
	}
}

export default () => {
	onCleanup(() => {
		window.removeEventListener("mousemove", handleMouseMove)
		window.removeEventListener("mouseup", handleMouseUp)
	})

	return (
		<>
			<div class="overflow-hidden bg-transparent flex items-center z-100000 absolute bottom-2.5 left-2.5 group">
				<div class="flex flex-row space-x-4 overflow-x-visible relative items-center py-2">
					<For each={icons} fallback={<div>Loading...</div>}>
						{(icon) => (
							<div
								class="icon cursor-pointer flex flex-col justify-center items-center transition duration-200 ease-out hover:-translate-y-2 z-10 translate-y-[200%] group-hover:translate-y-0"
								onMouseDown={startDragging(icon.name)}
							>
								<Svg width={icon.width} height={icon.height} classes="" icon_name={icon.name} />
								<div class=""></div>

								<span class="text-sm">{icon.name}</span>
							</div>
						)}
					</For>
				</div>
			</div>

			<Portal>
				<div
					class="absolute bg-card z-50 pointer-events-none w-[300px] p-5"
					style={{
						display: dragging() ? "block" : "none",
						top: `${dragPos().y}px`,
						left: `${dragPos().x}px`,
						transform: `scale(${store.viewport.scale})`,
						"transform-origin": "top left"
					}}
				>
					<Switch fallback={<div>Not Found</div>}>
						<Match when={cloneType() === "note"}>
							{dragPos().x} /// {dragPos().y}
							New Note
						</Match>
						<Match when={cloneType() === "todo"}>{Todo()}</Match>

						<Match when={cloneType() === "comment"}></Match>
						<Match when={cloneType() === "table"}></Match>
						<Match when={cloneType() === "url"}></Match>
						<Match when={cloneType() === "arrow"}></Match>
						<Match when={cloneType() === "board"}></Match>
						<Match when={cloneType() === "column"}></Match>
						<Match when={cloneType() === "code"}></Match>
						<Match when={cloneType() === "document"}></Match>
						<Match when={cloneType() === "upload"}></Match>
						<Match when={cloneType() === "drawing"}></Match>
						<Match when={cloneType() === "sketch"}></Match>
						<Match when={cloneType() === "color"}></Match>
						<Match when={cloneType() === "image"}></Match>
						<Match when={cloneType() === "activity"}></Match>
					</Switch>
				</div>
			</Portal>
		</>
	)
}

const Todo = () => {
	return (
		<div class="">
			<div class="sortable group/taskitem flex justify-between">
				<div class="w-full flex items-center">
					<div class="flex items-start justify-between w-full">
						<div class="flex space-x-2 w-full items-start">
							<label class="checkbox-check flex items-center cursor-pointer relative">
								<input
									type="checkbox"
									checked={false}
									class="peer size-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border checked:bg-primary/80 checked:border-primary"
								/>
								<span class="absolute opacity-0 peer-checked:opacity-100 flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="size-3/4"
										viewBox="0 0 20 20"
										fill="currentColor"
										stroke="currentColor"
										stroke-width="1"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</span>
							</label>
							<span class="taskitem-text cursor-text outline-0 overflow-hidden text-ellipsis text-pretty wrap-break-word leading-4 w-full"></span>
						</div>
					</div>
				</div>
				<IconMenu2 class="tasklist_handle size-4 cursor-pointer mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100 " />
			</div>
		</div>
	)
}
