import StarterKit from "@tiptap/starter-kit"
import { createTiptapEditor } from "solid-tiptap"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import { TextStyle } from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import { TrailingNode } from "@tiptap/extensions"
import { setNodeUrl } from "../../shared/url"

import { changeToUrlNode, updateNote, updateZIndex } from "../../shared/update"
import { Accessor, untrack } from "solid-js"
import { debounce } from "../../shared/utils"
import { NoteProps } from "../nodes/Note"


export const Toolbar = (props: { node: any, editor: any }) => {
    return (
        <div class="toolbar flex flex-wrap gap-2">
            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().toggleBold().run()}
                    class={props.editor()?.isActive("bold") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Bold
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleItalic().run()}
                    class={props.editor()?.isActive("italic") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Italic
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleStrike().run()}
                    class={props.editor()?.isActive("strike") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Strike
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 1 }).run()}
                    class={props.editor()?.isActive("heading", { level: 1 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H1
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 2 }).run()}
                    class={props.editor()?.isActive("heading", { level: 2 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H2
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 3 }).run()}
                    class={props.editor()?.isActive("heading", { level: 3 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H3
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 4 }).run()}
                    class={props.editor()?.isActive("heading", { level: 4 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H4
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 5 }).run()}
                    class={props.editor()?.isActive("heading", { level: 5 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H5
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleHeading({ level: 6 }).run()}
                    class={props.editor()?.isActive("heading", { level: 6 }) ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    H6
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().toggleBulletList().run()}
                    class={props.editor()?.isActive("bulletList") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Bullet list
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleOrderedList().run()}
                    class={props.editor()?.isActive("orderedList") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Ordered list
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().toggleCode().run()}
                    class={props.editor()?.isActive("code") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Code
                </button>
                <button onClick={() => props.editor()?.chain().focus().unsetAllMarks().run()}>Clear marks</button>
                <button onClick={() => props.editor()?.chain().focus().clearprops.Nodes().run()}>Clear props.nodes</button>
                <button
                    onClick={() => props.editor()?.chain().focus().setParagraph().run()}
                    class={props.editor()?.isActive("paragraph") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Paragraph
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleCodeBlock().run()}
                    class={props.editor()?.isActive("codeBlock") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Code block
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().toggleBlockquote().run()}
                    class={props.editor()?.isActive("blockquote") ? "is-active" : ""}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Blockquote
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().setHorizontalRule().run()}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Horizontal rule
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().setHardBreak().run()}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Hard break
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().undo().run()}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Undo
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().redo().run()}
                    style={{
                        "--hover-bg": props.node.textColor,
                        "--hover-fg": props.node.color
                    }}
                >
                    Redo
                </button>
            </div>

            <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
                <button
                    onClick={() => props.editor()?.chain().focus().setTextAlign("left").run()}
                    class={props.editor()?.isActive({ textAlign: "left" }) ? "is-active" : ""}
                >
                    Left
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().setTextAlign("center").run()}
                    class={props.editor()?.isActive({ textAlign: "center" }) ? "is-active" : ""}
                >
                    Center
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().setTextAlign("right").run()}
                    class={props.editor()?.isActive({ textAlign: "right" }) ? "is-active" : ""}
                >
                    Right
                </button>
                <button
                    onClick={() => props.editor()?.chain().focus().setTextAlign("justify").run()}
                    class={props.editor()?.isActive({ textAlign: "justify" }) ? "is-active" : ""}
                >
                    Justify
                </button>
            </div>
        </div>
    )
}

const updateText = debounce((newValue: string, nodeId: string) => {
    updateNote(nodeId, newValue)
}, 300)


export const Editor = (node: NoteProps, editorRef: HTMLDivElement, editable: Accessor<boolean>) => {
    return createTiptapEditor(() => ({
        element: editorRef!,
        editable: editable(),
        onFocus() {
            updateZIndex(node.id)
        },
        // onBlur({ event }) { },
        onSelectionUpdate() { },
        onUpdate({ editor }) {
            const text = editor.getText().trim()
            const urlRegex = /^(https?:\/\/[^\s]+)$/
            if (urlRegex.test(text)) {
                //TODO: needs to be changed to the transform() in the Url.tsx
                changeToUrlNode(node.id, text)
                setNodeUrl(node.id, text)
            } else {
                updateText(JSON.stringify(editor.getJSON()), node.id)
            }
        },
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            TextStyle,
            TextAlign,
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            //! doesnt work idk why
            TrailingNode.configure({
                node: "paragraph",
                notAfter: ["heading"]
            })
        ],
        //? take the value from the store but make it none reactive because we than edit it manually and the same changes are saved to file, the reason for unbinding the reactivity is because when we are focused and make changes those same changes that are written are saved to file/store and are refreshed as if they are new values (bad behaviour)
        content: JSON.parse(untrack(() => node.text))
        //? but we need tracked for the undo/redo functionality (the undo/redo func was changed so i dont think is needed anymore)
        // content: JSON.parse(node.text),
    }))
}