// had many issues fixed by Claude
import { batch, For, onCleanup, Show, untrack } from "solid-js"
import { createStore, produce, unwrap } from "solid-js/store"
import { DragDropProvider, DragDropSensors, SortableProvider, createSortable, closestCenter, useDragDropContext } from "@thisbeyond/solid-dnd"
import { Task, Todo as TodoType } from "../../types"
import { reorderTasks, updateTask } from "../../shared/update"
import { MdFillDrag_handle } from 'solid-icons/md'
import EditableTitle from "./EditableTitle"

// === Types ===
type TodoProps = TodoType & {
	is_child?: boolean
	nested?: number
}

type TaskWithId = Task & { _id: string }

type KeyHandler = (e: KeyboardEvent, id: string) => void
type PasteHandler = (e: ClipboardEvent, id: string) => void

type SortableItemProps = {
	task: TaskWithId
	onKeyDown: KeyHandler
	onPaste: PasteHandler
	onInput: (id: string, text: string) => void
	onToggle: (id: string, checked: boolean) => void
}

type TaskItemProps = SortableItemProps

// === Helpers ===
const generateId = (() => {
	let counter = 0
	return () => `task-id-${counter++}`
})()

/** Start/end character offsets of the current selection inside `el`. */
const getSelectionOffsets = (el: HTMLElement): [number, number] => {
	const sel = window.getSelection()
	if (!sel || sel.rangeCount === 0 || !el.contains(sel.anchorNode)) {
		const len = el.textContent?.length ?? 0
		return [len, len]
	}
	const range = sel.getRangeAt(0)
	const pre = range.cloneRange()
	pre.selectNodeContents(el)
	pre.setEnd(range.startContainer, range.startOffset)
	const start = pre.toString().length
	return [start, start + range.toString().length]
}

/** Focus `el` and put the caret at `offset` (or at the end when omitted). */
const placeCaret = (el: HTMLElement, offset?: number) => {
	el.focus()
	const sel = window.getSelection()
	if (!sel) return
	const range = document.createRange()
	const textNode = el.firstChild
	if (offset === undefined || !textNode) {
		range.selectNodeContents(el)
		range.collapse(false)
	} else {
		range.setStart(textNode, Math.min(offset, textNode.textContent?.length ?? 0))
		range.collapse(true)
	}
	sel.removeAllRanges()
	sel.addRange(range)
}

export default (node: TodoProps) => {
	let containerRef!: HTMLDivElement

	// A store (instead of a signal) so text/check/nestLevel edits update in place:
	// rows are not re-created, so focus and caret survive, and the data stays
	// in sync with what is on screen.
	const [store, setStore] = createStore<{ tasks: TaskWithId[] }>({
		tasks: node.tasks.map((task) => ({ ...task, _id: generateId() }))
	})

	const ids = () => store.tasks.map((task) => task._id)
	const indexOf = (id: string) => store.tasks.findIndex((task) => task._id === id)
	const snapshot = () => unwrap(store.tasks).map(({ _id, ...keepAttrs }) => keepAttrs)

	// === Persistence ===
	// Text edits are debounced per task (and resolved to an index at fire time,
	// so structural changes can't make them hit the wrong task).
	const pending = new Map<string, { timer: number; run: () => void }>()

	const scheduleTextSave = (id: string) => {
		const existing = pending.get(id)
		if (existing) clearTimeout(existing.timer)
		const run = () => {
			pending.delete(id)
			const index = indexOf(id)
			if (index === -1) return
			updateTask(node.id, store.tasks[index].text, index)
		}
		pending.set(id, { timer: window.setTimeout(run, 300), run })
	}

	const cancelPending = () => {
		pending.forEach((p) => clearTimeout(p.timer))
		pending.clear()
	}

	const flushPending = () => {
		const runs = [...pending.values()]
		cancelPending()
		runs.forEach((p) => p.run())
	}

	// Don't lose the last keystrokes when the component unmounts.
	onCleanup(flushPending)

	// Structural change: the store already holds the latest text, so a full save
	// supersedes any pending per-task save.
	const persistStructure = () => {
		cancelPending()
		reorderTasks(node.id, snapshot())
	}

	// === Focus ===
	const focusTask = (id: string, offset?: number) => {
		queueMicrotask(() => {
			const el = containerRef.querySelector<HTMLElement>(`[data-task-id="${id}"] .taskitem-text`)
			if (el) placeCaret(el, offset)
		})
	}

	// === Nesting ===
	// End (exclusive) of the item at `index` plus all its nested children.
	const subtreeEnd = (index: number) => {
		const level = store.tasks[index].nestLevel
		let end = index + 1
		while (end < store.tasks.length && store.tasks[end].nestLevel > level) end++
		return end
	}

	const shiftLevel = (index: number, delta: number) => {
		const end = subtreeEnd(index)
		batch(() => {
			for (let i = index; i < end; i++) {
				setStore("tasks", i, "nestLevel", (level) => level + delta)
			}
		})
	}

	// === Item events ===
	const handleInput = (id: string, text: string) => {
		const index = indexOf(id)
		if (index === -1) return
		setStore("tasks", index, "text", text)
		scheduleTextSave(id)
	}

	const handleToggle = (id: string, checked: boolean) => {
		const index = indexOf(id)
		if (index === -1) return
		setStore("tasks", index, "check", checked)
		updateTask(node.id, checked, index)
	}

	const handleKeyDown: KeyHandler = (e, id) => {
		const index = indexOf(id)
		if (index === -1) return
		const el = e.currentTarget as HTMLElement

		switch (e.key) {
			case "Enter": {
				if (e.isComposing) return // IME confirmation, not a new task
				e.preventDefault()

				// Split at the caret: text after it moves to the new task
				const text = el.textContent ?? ""
				const [start, end] = getSelectionOffsets(el)
				const before = text.slice(0, start)
				const after = text.slice(end)
				const newTask: TaskWithId = {
					_id: generateId(),
					text: after,
					check: false,
					nestLevel: store.tasks[index].nestLevel
				}

				batch(() => {
					el.textContent = before
					setStore("tasks", index, "text", before)
					setStore("tasks", produce((tasks) => void tasks.splice(index + 1, 0, newTask)))
				})
				persistStructure()
				focusTask(newTask._id, 0)
				return
			}

			case "Backspace": {
				if ((el.textContent ?? "").trim() !== "") return // normal editing

				// Empty nested task: outdent
				if (store.tasks[index].nestLevel > 0) {
					e.preventDefault()
					shiftLevel(index, -1)
					persistStructure()
					return
				}

				// Empty top-level task: delete it (keep at least one)
				if (store.tasks.length > 1) {
					e.preventDefault() // otherwise the default delete hits the newly focused task
					const focusId = store.tasks[index > 0 ? index - 1 : 1]._id
					setStore("tasks", produce((tasks) => void tasks.splice(index, 1)))
					persistStructure()
					focusTask(focusId)
				}
				return
			}

			case "Tab": {
				if (e.ctrlKey || e.metaKey || e.altKey) return
				e.preventDefault()

				if (e.shiftKey) {
					if (store.tasks[index].nestLevel === 0) return
					shiftLevel(index, -1)
				} else {
					// Can only nest one level deeper than the task above
					if (index === 0 || store.tasks[index].nestLevel > store.tasks[index - 1].nestLevel) return
					shiftLevel(index, 1)
				}
				persistStructure()
				return
			}

			case "ArrowUp":
			case "ArrowDown": {
				if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return // keep selection / shortcuts working
				e.preventDefault()

				const target = store.tasks[e.key === "ArrowUp" ? index - 1 : index + 1]
				if (target) focusTask(target._id)
				return
			}
		}
	}

	const handlePaste: PasteHandler = (e, id) => {
		e.preventDefault()
		const index = indexOf(id)
		if (index === -1) return

		const lines = (e.clipboardData?.getData("text") ?? "").split(/\r?\n/).filter((line) => line.length > 0)
		if (lines.length === 0) return

		const el = e.currentTarget as HTMLElement
		const text = el.textContent ?? ""
		const [start, end] = getSelectionOffsets(el)
		const before = text.slice(0, start)
		const after = text.slice(end)
		const level = store.tasks[index].nestLevel

		let focusId = id
		let caret = 0

		if (lines.length === 1) {
			// Single line: insert at the caret like a normal paste
			const merged = before + lines[0] + after
			batch(() => {
				el.textContent = merged
				setStore("tasks", index, "text", merged)
			})
			caret = before.length + lines[0].length
			scheduleTextSave(id)
		} else {
			const first = before + lines[0]
			const lastIndex = lines.length - 1
			const newTasks: TaskWithId[] = lines.slice(1).map((line, i) => ({
				_id: generateId(),
				text: i === lastIndex - 1 ? line + after : line, // text after the caret ends up behind the last pasted line
				check: false,
				nestLevel: level
			}))

			batch(() => {
				el.textContent = first
				setStore("tasks", index, "text", first)
				setStore("tasks", produce((tasks) => void tasks.splice(index + 1, 0, ...newTasks)))
			})
			focusId = newTasks[newTasks.length - 1]._id
			caret = lines[lastIndex].length
			persistStructure()
		}

		focusTask(focusId, caret)
	}

	// === Drag & drop ===
	const onDragEnd = ({ draggable, droppable }: any) => {
		if (!draggable || !droppable) return

		const from = indexOf(draggable.id)
		const to = indexOf(droppable.id)
		if (from === -1 || to === -1 || from === to) return

		// Move the dragged task together with its nested children
		const end = subtreeEnd(from)
		if (to > from && to < end) return // can't drop a task inside its own children

		const updated = [...unwrap(store.tasks)]
		const moved = updated.splice(from, end - from)
		// Moving down: the target index shifted by the removed block
		const insertAt = to > from ? to - moved.length + 1 : to
		updated.splice(insertAt, 0, ...moved)

		setStore("tasks", updated)
		persistStructure()
	}

	return (
		<div class="p-5" ref={containerRef}>
			<Show when={node.showTitle}>
				<div class="text-2xl font-bold mb-4">
					<EditableTitle nodeId={node.id} title={node.title || ""} />
				</div>
			</Show>

			<DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCenter}>
				<DragDropSensors />

				<SortableProvider ids={ids()}>
					<div class="flex flex-col gap-2">
						<For each={store.tasks}>
							{(task) => (
								<SortableItem
									task={task}
									onKeyDown={handleKeyDown}
									onPaste={handlePaste}
									onInput={handleInput}
									onToggle={handleToggle}
								/>
							)}
						</For>
					</div>
				</SortableProvider>
			</DragDropProvider>
		</div>
	)
}

// === Sortable Wrapper ===
const SortableItem = (props: SortableItemProps) => {
	const sortable = createSortable(props.task._id)
	const [state] = useDragDropContext()!

	return (
		<div
			ref={sortable.ref}
			data-task-id={props.task._id}
			class="sortable group/taskitem flex justify-between"
			classList={{
				"opacity-25": sortable.isActiveDraggable,
				"transition-transform": !!state.active.draggable
			}}
		>
			<TaskItem {...props} />
			{/* Only the handle starts a drag, so selecting text with the mouse doesn't drag the task */}
			<div
				class="tasklist_handle cursor-grab mt-1 transition-opacity duration-200 ease-out opacity-0 group-hover/taskitem:opacity-100"
				{...sortable.dragActivators}
			>
				<MdFillDrag_handle class="size-4" />
			</div>
		</div>
	)
}

// === Task UI ===
const TaskItem = (props: TaskItemProps) => {
	return (
		<div
			class="w-full flex items-center"
			style={{
				"margin-left": `${props.task.nestLevel * 18}px`
			}}
		>
			<div class="flex items-start justify-between w-full">
				<div class="flex space-x-2 w-full items-start">
					<Checkbox checked={props.task.check} onToggle={(checked) => props.onToggle(props.task._id, checked)} />
					<span
						class="taskitem-text cursor-text outline-0 overflow-hidden text-ellipsis text-pretty wrap-break-word leading-4 w-full"
						contentEditable={true}
						onKeyDown={(e) => props.onKeyDown(e, props.task._id)}
						onInput={(e) => props.onInput(props.task._id, e.currentTarget.textContent || "")}
						onPaste={(e) => props.onPaste(e, props.task._id)}
					>
						{/* Rendered once: the DOM owns the text while editing. Re-binding it on every
						    keystroke makes Solid overwrite the text node and the caret jumps. */}
						{untrack(() => props.task.text)}
					</span>
				</div>
			</div>
		</div>
	)
}

const Checkbox = (props: { checked: boolean; onToggle: (checked: boolean) => void }) => {
	return (
		<label class="checkbox-check flex items-center cursor-pointer relative">
			<input
				type="checkbox"
				checked={props.checked}
				onChange={(e) => props.onToggle(e.currentTarget.checked)}
				class="peer size-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border checked:bg-primary/80 checked:border-primary"
			/>
			<span class="absolute opacity-0 peer-checked:opacity-100 flex items-center justify-center ">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="size-full"
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
	)
}
