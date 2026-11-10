import { updateNodeDesc, updateZIndex } from "../../shared/update"
import { debounce } from "../../shared/utils"
import StarterKit from "@tiptap/starter-kit"
import { createTiptapEditor } from "solid-tiptap"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import { TextStyle } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import { createEffect, onCleanup, untrack } from "solid-js"

export default (props: { id: string; desc: string }) => {
	let editorRef!: HTMLDivElement
	const updateText = debounce((newValue: string) => {
		updateNodeDesc(props.id, newValue)
	}, 300)


	//? needed for when Url is created, the description is loaded 
	createEffect(() => {
		const incoming = props.desc
		const ed = editor()
		if (!ed || !incoming) return

		const next = typeof incoming === "string" ? JSON.parse(incoming) : incoming
		const current = ed.getJSON()

		if (JSON.stringify(current) !== JSON.stringify(next)) {
			ed.commands.setContent(next, false)
		}
	})

	const editor = createTiptapEditor(() => ({
		element: editorRef!,
		editable: true,
		onFocus() {
			updateZIndex(props.id)
		},
		// onBlur({ event }) { },
		onSelectionUpdate() { },
		onUpdate({ editor }) {
			updateText(JSON.stringify(editor.getJSON()))
		},
		extensions: [StarterKit, Highlight, Typography, TextStyle, TextAlign],
		content: JSON.parse(untrack(() => props.desc)) ?? "test"
	}))

	onCleanup(() => {
		editor()?.destroy()
	})

	return <div id="secondaryEditor" class="p-5" ref={editorRef}></div>
}
