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

export const Toolbar = (props: { node: any, editor: any }) => {

    const isActive = (name: string | object, attrs?: object) =>
        createEditorTransaction(
            () => props.editor(),
            (ed) => (ed ? ed.isActive(name as any, attrs) : false)
        )

    const Btn = (p: { editor: any; node: any; label: string; run: (c: any) => any; active?: () => boolean }) => (
        <button
            onClick={() => p.run(p.editor()?.chain().focus()).run()}
            class={p.active?.() ? "is-active" : ""}
            style={{ "--hover-bg": p.node.textColor, "--hover-fg": p.node.color }}
        >
            {p.label}
        </button>
    )


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
                <For each={[1, 2, 3, 4, 5, 6]}>
                    {(level) => (
                        <Btn
                            editor={props.editor}
                            node={props.node}
                            label={`H${level}`}
                            run={(c) => c.toggleHeading({ level })}
                            active={isActive("heading", { level })}
                        />
                    )}
                </For>
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
                <button onClick={() => props.editor()?.chain().focus().clearNodes().run()}>Clear nodes</button>
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