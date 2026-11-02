import { store } from "../../shared/store"
import { Editor } from "@tiptap/core"
import { For } from "solid-js"



import { BsBlockquoteLeft } from 'solid-icons/bs'
import { FaSolidBold, FaSolidItalic, FaSolidStrikethrough, FaSolidUnderline } from 'solid-icons/fa'
import { VsCode } from 'solid-icons/vs'
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from 'solid-icons/bs'
import { AiOutlineUnorderedList, AiOutlineOrderedList } from 'solid-icons/ai'
import { ImPilcrow } from 'solid-icons/im'
import { TbOutlineSpacingVertical } from 'solid-icons/tb'
import { AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineAlignRight } from 'solid-icons/ai'
import { FaSolidAlignJustify } from 'solid-icons/fa'

const stylesIcons = [
	{ name: "bold", icon: FaSolidBold },
	{ name: "italic", icon: FaSolidUnderline },
	{ name: "underline", icon: FaSolidItalic },
	{ name: "strike", icon: FaSolidStrikethrough },
	{ name: "paragraph", icon: ImPilcrow },
	{ name: "header 1", icon: BsTypeH1, attrs: { level: 1 } },
	{ name: "header 2", icon: BsTypeH2, attrs: { level: 2 } },
	{ name: "header 3", icon: BsTypeH3, attrs: { level: 3 } },
	{ name: "header 4", icon: BsTypeH4, attrs: { level: 4 } },
	{ name: "header 5", icon: BsTypeH5, attrs: { level: 5 } },
	{ name: "header 6", icon: BsTypeH6, attrs: { level: 6 } },
	{ name: "list", icon: AiOutlineUnorderedList },
	{ name: "numberedList", icon: AiOutlineOrderedList },
	{ name: "codeBlock", icon: VsCode },
	{ name: "blockQuote", icon: BsBlockquoteLeft },
	{ name: "verticalRule", icon: TbOutlineSpacingVertical },

	{ name: "alignLeft", icon: AiOutlineAlignLeft },
	{ name: "alignCenter", icon: AiOutlineAlignCenter },
	{ name: "alignRight", icon: AiOutlineAlignRight },
	{ name: "alignJustify", icon: FaSolidAlignJustify }
]

export default () => {
	return (
		<div class="h-full overflow-hidden w-[65px] py-4 flex justify-center bg-card">
			<div class="flex flex-col space-y-4 relative">
				<div class="h-full overflow-hidden space-y-2">
					<For each={stylesIcons} fallback={<div>Loading...</div>}>
						{(icon) => (
							<div>
								<button
									class="icon cursor-pointer flex flex-col justify-center items-center z-10 bg-accent aspect-square  hover:bg-muted-foreground transition-colors duration-150 ease-in-out"
									classList={{
										"bg-primary": store.noteEditor ? isStyleActive(store.noteEditor, icon.name) : false
									}}
									onClick={() => {
										const editor = store.noteEditor
										if (editor) toggle(editor, icon.name)
									}}
								>
									<div class="flex flex-col size-full p-2">
										<icon.icon />
									</div>
								</button>
							</div>
						)}
					</For>
				</div>
			</div>
		</div>
	)
}

const toggle = (editor: Editor, togglable: string) => {
	switch (togglable) {
		case "bold":
			editor.chain().focus().toggleBold().run()
			break
		case "italic":
			editor.chain().focus().toggleItalic().run()
			break
		case "underline":
			editor.chain().focus().toggleUnderline().run()
			break
		case "strike":
			editor.chain().focus().toggleStrike().run()
			break
		case "paragraph":
			editor.chain().focus().setParagraph().run()
			break
		case "header 1":
			editor.chain().focus().toggleHeading({ level: 1 }).run()
			break
		case "header 2":
			editor.chain().focus().toggleHeading({ level: 2 }).run()
			break
		case "header 3":
			editor.chain().focus().toggleHeading({ level: 3 }).run()
			break
		case "header 4":
			editor.chain().focus().toggleHeading({ level: 4 }).run()
			break
		case "header 5":
			editor.chain().focus().toggleHeading({ level: 5 }).run()
			break
		case "header 6":
			editor.chain().focus().toggleHeading({ level: 6 }).run()
			break
		case "list":
			editor.chain().focus().toggleBulletList().run()
			break
		case "numberedList":
			editor.chain().focus().toggleOrderedList().run()
			break
		case "codeBlock":
			editor.chain().focus().toggleCodeBlock().run()
			break
		case "blockQuote":
			editor.chain().focus().toggleBlockquote().run()
			break
		case "verticalRule":
			editor.chain().focus().setHorizontalRule().run()
			break
		case "alignLeft":
			editor.chain().focus().setTextAlign("left").run()
			break
		case "alignCenter":
			editor.chain().focus().setTextAlign("center").run()
			break
		case "alignRight":
			editor.chain().focus().setTextAlign("right").run()
			break
		case "alignJustify":
			editor.chain().focus().setTextAlign("justify").run()
			break
		default:
			console.warn("Unhandled action:", togglable)
	}
}

const isStyleActive = (editor: Editor, togglable: string): boolean => {
	switch (togglable) {
		case "bold":
			return store.activeTags.includes("strong") || store.activeTags.includes("b")
		case "italic":
			return store.activeTags.includes("em") || store.activeTags.includes("i")
		case "underline":
			return store.activeTags.includes("u")
		case "strike":
			return store.activeTags.includes("s") || store.activeTags.includes("del")
		case "paragraph":
			return store.activeTags.includes("p")
		case "header 1":
			return store.activeTags.includes("h1")
		case "header 2":
			return store.activeTags.includes("h2")
		case "header 3":
			return store.activeTags.includes("h3")
		case "header 4":
			return store.activeTags.includes("h4")
		case "header 5":
			return store.activeTags.includes("h5")
		case "header 6":
			return store.activeTags.includes("h6")
		case "list":
			return store.activeTags.includes("ul")
		case "numberedList":
			return store.activeTags.includes("ol")
		case "codeBlock":
			return store.activeTags.includes("pre")
		case "blockQuote":
			return store.activeTags.includes("blockquote")
		case "verticalRule":
			return store.activeTags.includes("hr")

		case "alignLeft":
			return false
		case "alignCenter":
			return false
		case "alignRight":
			return false
		case "alignJustify":
			return false
		default:
			console.warn("Unhandled action:", togglable)
			return false
	}
}
