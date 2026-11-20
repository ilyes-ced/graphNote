import { createSignal, For, Match, onCleanup, Switch } from "solid-js"
import Svg from "../nodes/Svg"
import { newEdge, newNode } from "../../shared/update"
import { NodeType } from "../../types"
import { Portal } from "solid-js/web"
import { store } from "../../shared/store"
import { MdFillDrag_handle } from 'solid-icons/md'
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

	{ name: "activity", width: 32, height: 24 },
	{ name: "tierList", width: 32, height: 24 }
]

const startDragging = (type: string) => (e: MouseEvent) => {
	e.preventDefault()
	console.log(type)
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
	if (findType(cloneType() ?? "") == NodeType.Arrow) {
		newEdge(
			(dragPos().x - store.viewport.x) / store.viewport.scale,
			(dragPos().y - store.viewport.y) / store.viewport.scale
		)
	} else {
		newNode(
			findType(cloneType() ?? ""),
			(dragPos().x - store.viewport.x) / store.viewport.scale,
			(dragPos().y - store.viewport.y) / store.viewport.scale
		)
	}

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
		case "tierList":
			return NodeType.TierList
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
			<div class="overflow-hidden bg-transparent flex items-center z-100000 absolute bottom-0 left-0 group p-2">
				<div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-100 group flex flex-col items-center cursor-pointer select-none px-6 pt-1 pb-1">
					{/* handle */}
					<svg
						class="size-4 text-primary group-hover:animate-none group-hover:opacity-0 transition-opacity duration-200"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M6 15l6-6 6 6" />
					</svg>
					<div class="w-10 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary group-hover:w-14 transition-all duration-200" />

					{/* panel wrapper: handles centering, so the inner element can use translate-y freely */}
					<div class="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none group-hover:pointer-events-auto">
						<div class="flex flex-row space-x-4 items-center py-2 px-2.5 bg-background border-2 border-primary
                translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                transition duration-200 ease-out">
							{/* your buttons */}
						</div>
					</div>
				</div>

				<div class="flex flex-row space-x-4 overflow-x-visible relative items-center py-2 p-2.5 translate-y-[200%] group-hover:translate-y-0 transition duration-200 ease-out bg-background border-2 border-primary">
					<For each={icons} fallback={<div>Loading...</div>}>
						{(icon) => (
							<div
								class="icon cursor-pointer flex flex-col justify-center items-center  z-10  pointer-events-auto"
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
				<Switch fallback={
					<div
						class="absolute bg-card z-50 pointer-events-none w-[300px]"
						style={{
							display: dragging() ? "block" : "none",
							top: `${dragPos().y}px`,
							left: `${dragPos().x}px`,
							transform: `scale(${store.viewport.scale})`,
							"transform-origin": "top left"
						}}
					>
						<Switch fallback={<div>Not Found: {cloneType()} </div>}>
							<Match when={cloneType() === "note"}>
								New Note
							</Match>
							<Match when={cloneType() === "todo"}>{Todo()}</Match>
							<Match when={cloneType() === "comment"}>test comment</Match>
							<Match when={cloneType() === "table"}>test table</Match>
							<Match when={cloneType() === "url"}>{Url()}</Match>
							<Match when={cloneType() === "column"}>{Column()}</Match>
							<Match when={cloneType() === "code"}>test code</Match>
							<Match when={cloneType() === "document"}>test document</Match>
							<Match when={cloneType() === "upload"}>test upload</Match>
							<Match when={cloneType() === "drawing"}>test drawing</Match>
							<Match when={cloneType() === "sketch"}>test sketch</Match>
							<Match when={cloneType() === "color"}>test color</Match>
							<Match when={cloneType() === "image"}>{Image()}</Match>
							<Match when={cloneType() === "activity"}>test activity</Match>
							<Match when={cloneType() === "tierList"}>{TierList()}</Match>
						</Switch>
					</div>
				}>
					<Match when={cloneType() === "arrow"}>{Arrow()}</Match>
					<Match when={cloneType() === "board"}>{Board()}</Match>
				</Switch>
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
				<MdFillDrag_handle class="tasklist_handle size-4 cursor-pointer mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100 " />
			</div>
		</div>
	)
}


const Arrow = () => {
	return (
		<div
			class="absolute z-50 pointer-events-none w-[300px] p-5"
			style={{
				display: dragging() ? "block" : "none",
				top: `${dragPos().y}px`,
				left: `${dragPos().x}px`,
				transform: `scale(${store.viewport.scale})`,
				"transform-origin": "top left"
			}}
		>

			<svg width="1" height="1" class="overflow-visible">
				<g transform="translate(-220 -220)" data-edge-id="edge_1">
					<path fill="none" stroke="transparent" style="pointer-events:stroke;cursor:pointer" d="M207.07106781186548 207.07106781186548L292.9289321881345 292.9289321881345" stroke-width="14">
					</path>
					<path fill="none" d="M207.07106781186548 207.07106781186548L292.9289321881345 292.9289321881345" stroke="#ffffff" stroke-width="2" stroke-linecap="butt">
					</path>
					<path stroke-linecap="round" stroke-linejoin="round" d="M0 0L-10 -4L-10 4Z" transform="translate(200 200) rotate(-135)" fill="#ffffff" stroke="none" stroke-width="2">
					</path>
					<path stroke-linecap="round" stroke-linejoin="round" d="M0 0L-10 -4L-10 4Z" transform="translate(300 300) rotate(45)" fill="#ffffff" stroke="none" stroke-width="2">
					</path>
					<g style="pointer-events:auto;cursor:grab">
						<circle r="14" fill="transparent" cx="200" cy="200">
						</circle>
						<circle r="5.5" fill="var(--background)" stroke-width="2" cx="200" cy="200" stroke="#ffffff">
						</circle>
					</g>
					<g style="pointer-events:auto;cursor:grab">
						<circle r="14" fill="transparent" cx="300" cy="300">
						</circle>
						<circle r="5.5" fill="var(--background)" stroke-width="2" cx="300" cy="300" stroke="#ffffff">
						</circle>
					</g>
				</g>
			</svg>
		</div>
	)
}

const Board = () => {
	return (
		<div
			class="absolute z-50 pointer-events-none w-[300px]"
			style={{
				display: dragging() ? "block" : "none",
				top: `${dragPos().y}px`,
				left: `${dragPos().x}px`,
				transform: `scale(${store.viewport.scale})`,
				"transform-origin": "top left"
			}}
		>
			<div class="board flex flex-col justify-center items-center outline outline-transparent -outline-offset-2 node px-[40px] py-[10px] pb-[12px]" style="background: transparent; outline: 2px solid var(--color-primary); width: 60px;">
				<div class="board_icon flex flex-col justify-center items-center cursor-pointer border-2 border-transparent" style="width: 60px; height: 60px; background: var(--color-primary);">
					<svg fill="currentColor" viewBox="0 0 16 16" class="size-full p-2" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="M9.803 3.043a.5.5 0 0 1 .254.66l-4 9a.5.5 0 1 1-.914-.406l4-9a.5.5 0 0 1 .66-.254Zm-5.47 2.333a.5.5 0 0 1 .04.706L2.67 8l1.705 1.918a.5.5 0 0 1-.748.664l-2-2.25a.5.5 0 0 1 0-.664l2-2.25a.5.5 0 0 1 .706-.042Zm7.335 0a.5.5 0 0 1 .706.042l2 2.25a.5.5 0 0 1 0 .664l-2 2.25a.5.5 0 1 1-.748-.664L13.331 8l-1.705-1.918a.5.5 0 0 1 .042-.706Z">
						</path>
					</svg>
				</div>
				<div class="text_container flex flex-col justify-center items-center" style="color: var(--color-foreground);">
					<div class="board_text mt-2.5 mb-1.5 text-nowrap">
						<div class="outline-0" contenteditable="false">New Board</div>
					</div>
					<div class="board_content text-grey">
						<div class="subtitle text-center text-nowrap">0 cards</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const Url = () => {
	return (
		<div style="background: transparent; width: 300px; color: var(--color-foreground);" class="url border-2 border-transparent node group/resize group/extend" >
			<div class="" style="background: var(--color-card);">
				<div class="padding_div" style="padding-bottom: 3px;">
				</div>
				<div class="child_div">
					<div class="space-y-2">
						<div class="flex items-center space-x-2 px-5">
							<svg viewBox="0 0 1024 1024" fill="currentColor" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
								<path d="M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z">
								</path>
							</svg>
							<input type="text" placeholder="input your URL here" class="url_input p-5 size-full outline-0" />
						</div>
					</div>
				</div>
				<div class="padding_div" style="padding-bottom: 3px;">
				</div>
				<div class="z-50 resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out">
					<svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8">
						</path>
					</svg>
				</div>
				<div class="z-50 resize_handle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out">
					<svg viewBox="0 0 1024 1024" fill="currentColor" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="m855 160.1-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L863.9 169a7.9 7.9 0 0 0-8.9-8.9zM416.6 562.3a8.03 8.03 0 0 0-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z">
						</path>
					</svg>
				</div>
			</div>
		</div>
	)
}


const Column = () => {
	return (
		<div style="background: transparent; width: 300px; color: var(--color-foreground)" class="column border-2 border-transparent node group/resize group/collapse">
			<div class="" style="background: var(--color-card);">
				<div class="padding_div" style="padding-bottom: 0.25px;">
				</div>
				<div class="child_div">
					<div class="content flex flex-col p-2">
						<div class="collapse_icon self-end w-6 h-6 collapse_icon cursor-pointer flex justify-center items-center hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/collapse:opacity-100 pointer-events-none group-hover/collapse:pointer-events-auto transition-all duration-200 ease-in-out">
							<svg class="" width="16" height="16" viewBox="0 0 16 16">
								<path fill="#fff" fill-opacity="1" fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 .5.5z">

								</path>
							</svg>
						</div>
						<div class="title text-xl font-extrabold mb-2 text-center focus:outline-0 titleHandle">
							<div class="outline-0" contenteditable="false">New Column</div>
						</div>
						<div class="subtitle mb-4 text-center">0 cards</div>
						<div class="children_container flex flex-col" style="position:relative">
							<div class="empty_children_containe h-[65px] w-full bg-background">
							</div>
						</div>
					</div>
				</div>
				<div class="padding_div" style="padding-bottom: 0.25px;">
				</div>
				<div class="z-50 resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out">
					<svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8">
						</path>
					</svg>
				</div>
			</div>
		</div>
	)
}

const Image = () => {
	return (
		<div style="background: transparent; width: 300px; color: var(--color-foreground)" class="image border-2 border-transparent node group/resize" >
			<div class="" style="background: var(--color-card);">
				<div class="padding_div" style="padding-bottom: 4.96875px;">
				</div>
				<div class="child_div">
					<div>
						<div class="w-full aspect-video flex items-center justify-center cursor-pointer">
							<svg viewBox="0 0 24 24" fill="currentColor" class="size-1/3" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
								<path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z">
								</path>
							</svg>
						</div>
					</div>
				</div>
				<div class="padding_div" style="padding-bottom: 4.96875px;">
				</div>
				<div class="z-50 resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out">
					<svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8">
						</path>
					</svg>
				</div>
				<div class="z-50 resize_handle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out">
					<svg viewBox="0 0 1024 1024" fill="currentColor" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
						<path d="m855 160.1-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L863.9 169a7.9 7.9 0 0 0-8.9-8.9zM416.6 562.3a8.03 8.03 0 0 0-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z">
						</path>
					</svg>
				</div>
			</div>
		</div>
	)
}



const TierList = () => {
	return (<div style="background: transparent; width: 1001px; color: var(--color-foreground)" class="tierlist border-2 border-transparent node group/resize" ><div class="" style="background: var(--color-card);"><div class="padding_div" style="padding-bottom: 1.5px;"></div><div class="child_div"><div class="flex flex-col"><div class="divide-y-2 divide-amber-800"><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(255, 127, 127);">S</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-0" style="background: rgb(17, 17, 17);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(255, 191, 127);">A</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-1" style="background: rgb(8, 8, 8);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(255, 223, 127);">B</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-2" style="background: rgb(17, 17, 17);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(255, 255, 127);">C</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-3" style="background: rgb(8, 8, 8);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(191, 255, 127);">D</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-4" style="background: rgb(17, 17, 17);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div><div><div class="flex flex-row"><div class="min-h-20 w-40 shrink-0 flex items-center justify-center text-background" style="background: rgb(127, 255, 127);">F</div><div class="tierlist_row w-full flex items-center justify-between border-2 border-transparent" id="node_895315-5" style="background: rgb(8, 8, 8);"><div class="flex flex-row flex-wrap gap-1 p-1"></div><div class="flex flex-row items-center h-20 aspect-square shrink-0"><div class="w-1/2 h-1/2"><svg viewBox="0 0 512 512" fill="currentColor" class="tier_list_settings cursor-pointer size-full border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M256 176a80 80 0 1 0 80 80 80.24 80.24 0 0 0-80-80Zm172.72 80a165.53 165.53 0 0 1-1.64 22.34l48.69 38.12a11.59 11.59 0 0 1 2.63 14.78l-46.06 79.52a11.64 11.64 0 0 1-14.14 4.93l-57.25-23a176.56 176.56 0 0 1-38.82 22.67l-8.56 60.78a11.93 11.93 0 0 1-11.51 9.86h-92.12a12 12 0 0 1-11.51-9.53l-8.56-60.78A169.3 169.3 0 0 1 151.05 393L93.8 416a11.64 11.64 0 0 1-14.14-4.92L33.6 331.57a11.59 11.59 0 0 1 2.63-14.78l48.69-38.12A174.58 174.58 0 0 1 83.28 256a165.53 165.53 0 0 1 1.64-22.34l-48.69-38.12a11.59 11.59 0 0 1-2.63-14.78l46.06-79.52a11.64 11.64 0 0 1 14.14-4.93l57.25 23a176.56 176.56 0 0 1 38.82-22.67l8.56-60.78A11.93 11.93 0 0 1 209.94 26h92.12a12 12 0 0 1 11.51 9.53l8.56 60.78A169.3 169.3 0 0 1 361 119l57.2-23a11.64 11.64 0 0 1 14.14 4.92l46.06 79.52a11.59 11.59 0 0 1-2.63 14.78l-48.69 38.12a174.58 174.58 0 0 1 1.64 22.66Z"></path></svg></div><div class="flex flex-col h-full w-1/2"><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path></svg><svg viewBox="0 0 448 512" fill="currentColor" class="tier_list_chevron cursor-pointer w-full h-1/2 border border-transparent hover:bg-white/10" color="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg></div></div></div></div></div></div></div></div><div class="padding_div" style="padding-bottom: 1.5px;"></div><div class="z-50 resize_handle cursor-pointer absolute bottom-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out"><svg fill="currentColor" viewBox="0 0 16 16" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="M8 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"></path></svg></div><div class="z-50 resize_handle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/resize:opacity-100 pointer-events-none group-hover/resize:pointer-events-auto transition-all duration-200 ease-in-out"><svg viewBox="0 0 1024 1024" fill="currentColor" color="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;"><path d="m855 160.1-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 0 0 0 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0 0 13.5-4.7L863.9 169a7.9 7.9 0 0 0-8.9-8.9zM416.6 562.3a8.03 8.03 0 0 0-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 0 0-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z"></path></svg></div></div></div>)
}