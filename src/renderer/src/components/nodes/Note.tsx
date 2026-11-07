import { Note } from "../../types"
import { Show, createSignal, onCleanup } from "solid-js"
import { Toolbar, Editor } from "../ui/Editor"
import { MdFillEdit } from 'solid-icons/md'

export type NoteProps = Note & {
	is_child?: boolean
}

export default (node: NoteProps) => {
	let editorRef!: HTMLDivElement
	const [toolbar, setToolbar] = createSignal(false)
	const [editable, setEditable] = createSignal(false)

	const editor = Editor(node, () => editorRef, editable)

	onCleanup(() => {
		editor()?.destroy()
	})

	return (
		<div class="p-5">
			<div
				onClick={() => setToolbar(!toolbar())}
				class="z-50 edit_toggle cursor-pointer absolute top-0 left-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/edit:opacity-100 pointer-events-none group-hover/edit:pointer-events-auto transition-all duration-200 ease-in-out"
			>
				<MdFillEdit />
			</div>

			<Show when={toolbar()}>
				<Toolbar node={node} editor={editor} />
			</Show>

			<div
				id="editor"
				class="border p-2"
				style={{
					"border-color": editable() ? "" : "transparent"
				}}
				onDblClick={() => {
					setEditable(true)
					editor()?.commands.focus("end")
				}}
				ref={editorRef}
			></div>
		</div>
	)
}
