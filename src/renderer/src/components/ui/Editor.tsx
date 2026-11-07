import StarterKit from "@tiptap/starter-kit"
import { createTiptapEditor } from "solid-tiptap"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import { TextStyle } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import { setNodeUrl } from "../../shared/url"

import { changeToUrlNode, updateNote, updateZIndex } from "../../shared/update"
import { For, untrack } from "solid-js"
import { debounce } from "../../shared/utils"
import { createEditorTransaction } from "solid-tiptap"

import type { JSX } from "solid-js"

import {
    MdFillFormat_bold, MdFillFormat_italic, MdFillStrikethrough_s, MdFillCode_off,
    MdFillFormat_list_bulleted, MdFillFormat_list_numbered, MdFillFormat_quote,
    MdFillFormat_align_left, MdOutlineFormat_align_center, MdFillFormat_align_right, MdOutlineFormat_align_justify,
    MdFillHorizontal_rule, MdFillKeyboard_return, MdFillClear,
    MdFillUndo, MdFillRedo,
} from "solid-icons/md"
import { FaRegularFileCode } from 'solid-icons/fa'

type Item = {
    label: string
    icon: (p: { size?: number }) => JSX.Element
    run: (chain: any) => any
    active?: [name: string | object, attrs?: object]
    disabled?: (ed: any) => boolean
}

const GROUPS: Item[][] = [
    [
        { label: "Bold", icon: MdFillFormat_bold, run: (c) => c.toggleBold(), active: ["bold"] },
        { label: "Italic", icon: MdFillFormat_italic, run: (c) => c.toggleItalic(), active: ["italic"] },
        { label: "Strikethrough", icon: MdFillStrikethrough_s, run: (c) => c.toggleStrike(), active: ["strike"] },
        { label: "Inline code", icon: MdFillCode_off, run: (c) => c.toggleCode(), active: ["code"] },
    ],
    [
        { label: "Bullet list", icon: MdFillFormat_list_bulleted, run: (c) => c.toggleBulletList(), active: ["bulletList"] },
        { label: "Ordered list", icon: MdFillFormat_list_numbered, run: (c) => c.toggleOrderedList(), active: ["orderedList"] },
        { label: "Blockquote", icon: MdFillFormat_quote, run: (c) => c.toggleBlockquote(), active: ["blockquote"] },
        { label: "Code block", icon: FaRegularFileCode, run: (c) => c.toggleCodeBlock(), active: ["codeBlock"] },
    ],
    [
        { label: "Align left", icon: MdFillFormat_align_left, run: (c) => c.setTextAlign("left"), active: [{ textAlign: "left" }] },
        { label: "Align center", icon: MdOutlineFormat_align_center, run: (c) => c.setTextAlign("center"), active: [{ textAlign: "center" }] },
        { label: "Align right", icon: MdFillFormat_align_right, run: (c) => c.setTextAlign("right"), active: [{ textAlign: "right" }] },
        { label: "Justify", icon: MdOutlineFormat_align_justify, run: (c) => c.setTextAlign("justify"), active: [{ textAlign: "justify" }] },
    ],
    [
        { label: "Horizontal rule", icon: MdFillHorizontal_rule, run: (c) => c.setHorizontalRule() },
        { label: "Hard break", icon: MdFillKeyboard_return, run: (c) => c.setHardBreak() },
        { label: "Clear formatting", icon: MdFillClear, run: (c) => c.unsetAllMarks().clearNodes() },
    ],
    [
        { label: "Undo", icon: MdFillUndo, run: (c) => c.undo(), disabled: (ed) => !ed.can().undo() },
        { label: "Redo", icon: MdFillRedo, run: (c) => c.redo(), disabled: (ed) => !ed.can().redo() },
    ],
]

const Divider = () => <div class="w-px h-5 bg-border mx-1 shrink-0" />

const ToolBtn = (p: { item: Item; editor: () => any }) => {
    const active = createEditorTransaction(
        () => p.editor(),
        (ed) => (ed && p.item.active ? ed.isActive(...(p.item.active as [any, any])) : false)
    )
    const disabled = createEditorTransaction(
        () => p.editor(),
        (ed) => (!ed ? true : p.item.disabled ? p.item.disabled(ed) : false)
    )

    return (
        <button
            type="button"
            title={p.item.label}
            aria-label={p.item.label}
            aria-pressed={p.item.active ? active() : undefined}
            disabled={disabled()}
            // keep the editor's selection and focus when clicking toolbar buttons
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => p.item.run(p.editor()?.chain().focus()).run()}
            class="flex items-center justify-center size-7 cursor-pointer transition-colors
                   text-foreground/70 hover:bg-primary/15 hover:text-foreground
                   disabled:opacity-30 disabled:pointer-events-none"
            classList={{ "bg-primary/25 text-foreground": active() }}
        >
            <p.item.icon size={16} />
        </button>
    )
}

const HeadingSelect = (p: { editor: () => any }) => {
    const value = createEditorTransaction(
        () => p.editor(),
        (ed) => {
            if (!ed) return "p"
            for (let l = 1; l <= 6; l++) if (ed.isActive("heading", { level: l })) return String(l)
            return "p"
        }
    )

    return (
        <select
            title="Text style"
            value={value()}
            onChange={(e) => {
                const v = e.currentTarget.value
                const chain = p.editor()?.chain().focus()
                if (!chain) return
                v === "p" ? chain.setParagraph().run() : chain.setHeading({ level: Number(v) }).run()
            }}
            class="h-7 border border-border bg-transparent px-1.5 text-sm outline-none
                   cursor-pointer hover:bg-primary/15 focus:border-primary"
        >
            <option value="p">Paragraph</option>
            <For each={[1, 2, 3, 4, 5, 6]}>{(l) => <option class="bg-black active:bg-red-400" value={String(l)}>Heading {l}</option>}</For>
        </select>
    )
}

export const Toolbar = (props: { node?: any; editor: () => any }) => (
    <div class="toolbar flex flex-wrap items-center gap-y-1 border border-border bg-background/60 p-1 backdrop-blur-sm">
        <HeadingSelect editor={props.editor} />

        <For each={GROUPS}>
            {(group) => (
                <>
                    <Divider />
                    <div class="flex items-center gap-0.5">
                        <For each={group}>{(item) => <ToolBtn item={item} editor={props.editor} />}</For>
                    </div>
                </>
            )}
        </For>
    </div>
)

const updateText = debounce((newValue: string, nodeId: string) => {
    updateNote(nodeId, newValue)
}, 300)

import { Accessor, createEffect } from "solid-js"
import { NodeType } from "../../types"

export const Editor = (
    node: any,
    editorRef: () => HTMLDivElement,   // accessor, not the element
    editable: Accessor<boolean>        // accessor, not editable()
) => {
    const editor = createTiptapEditor(() => ({
        element: editorRef(),          // call it here
        editable: untrack(editable),
        onFocus() {
            updateZIndex(node.id)
        },
        onUpdate({ editor }) {
            const text = editor.getText().trim()
            const urlRegex = /^(https?:\/\/[^\s]+)$/
            if (urlRegex.test(text)) {
                changeToUrlNode(node.id, text)
                setNodeUrl(node.id, text)
            } else {
                updateText(JSON.stringify(editor.getJSON()), node.id)
            }
        },
        extensions: [
            StarterKit.configure({
                trailingNode: { node: "paragraph", notAfter: ["heading"] },
            }),
            Highlight,
            Typography,
            TextStyle,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: JSON.parse(untrack(() => node.type === NodeType.Note ? node.text : node.description)),
    }))

    createEffect(() => editor()?.setEditable(editable()))

    return editor
}