import { Note } from "../../types";
import { changeToUrlNode, updateNote, updateZIndex } from "../../shared/update";
import { debounce } from "../../shared/utils";
import StarterKit from "@tiptap/starter-kit";
import { createTiptapEditor } from "solid-tiptap";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import { Show, createSignal, onCleanup, untrack } from "solid-js";
import { IconEdit } from "@tabler/icons-solidjs";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  let editorRef!: HTMLDivElement;
  const [toolbar, setToolbar] = createSignal(false);



  const updateText = debounce((newValue: string) => {
    updateNote(node.id, newValue);
  }, 300);

  const editor = createTiptapEditor(() => ({
    element: editorRef!,
    editable: true,
    onFocus() {
      updateZIndex(node.id);
    },
    // onBlur({ event }) { },
    onSelectionUpdate() {
    },
    onUpdate({ editor }) {
      const text = editor.getText().trim();
      const urlRegex = /^(https?:\/\/[^\s]+)$/;
      if (urlRegex.test(text)) {
        changeToUrlNode(node.id, text);
      } else {
        updateText(JSON.stringify(editor.getJSON()));
      }
    },
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      TextStyle,
      TextAlign,
    ],
    //? take the value from the store but make it none reactive because we than edit it manually and the same changes are saved to file, the reason for unbinding the reactivity is because when we are focused and make changes those same changes that are written are saved to file/store and are refreshed as if they are new values (bad behaviour)
    content: JSON.parse(untrack(() => node.text)),
    //? but we need tracked for the undo/redo functionality (the undo/redo func was changed so i dont think is needed anymore)
    // content: JSON.parse(node.text),

  }));


  onCleanup(() => {
    // editor?.destroy();
  });




  const Toolbar = () => {
    return (
      <div class="toolbar flex flex-wrap gap-2">
        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button
            onClick={() => editor()?.chain().focus().toggleBold().run()}
            class={editor()?.isActive('bold') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Bold
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleItalic().run()}
            class={editor()?.isActive('italic') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Italic
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleStrike().run()}
            class={editor()?.isActive('strike') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Strike
          </button>
        </div>


        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 1 }).run()}
            class={editor()?.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H1
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 2 }).run()}
            class={editor()?.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H2
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 3 }).run()}
            class={editor()?.isActive('heading', { level: 3 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H3
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 4 }).run()}
            class={editor()?.isActive('heading', { level: 4 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H4
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 5 }).run()}
            class={editor()?.isActive('heading', { level: 5 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H5
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleHeading({ level: 6 }).run()}
            class={editor()?.isActive('heading', { level: 6 }) ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            H6
          </button>
        </div>

        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button
            onClick={() => editor()?.chain().focus().toggleBulletList().run()}
            class={editor()?.isActive('bulletList') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Bullet list
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleOrderedList().run()}
            class={editor()?.isActive('orderedList') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Ordered list
          </button>
        </div>


        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button
            onClick={() => editor()?.chain().focus().toggleCode().run()}
            class={editor()?.isActive('code') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Code
          </button>
          <button onClick={() => editor()?.chain().focus().unsetAllMarks().run()}>Clear marks</button>
          <button onClick={() => editor()?.chain().focus().clearNodes().run()}>Clear nodes</button>
          <button
            onClick={() => editor()?.chain().focus().setParagraph().run()}
            class={editor()?.isActive('paragraph') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleCodeBlock().run()}
            class={editor()?.isActive('codeBlock') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Code block
          </button>
          <button
            onClick={() => editor()?.chain().focus().toggleBlockquote().run()}
            class={editor()?.isActive('blockquote') ? 'is-active' : ''}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >
            Blockquote
          </button>
        </div>


        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button onClick={() => editor()?.chain().focus().setHorizontalRule().run()}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >Horizontal rule</button>
          <button onClick={() => editor()?.chain().focus().setHardBreak().run()}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >Hard break</button>
        </div>


        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button onClick={() => editor()?.chain().focus().undo().run()}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >Undo</button>
          <button onClick={() => editor()?.chain().focus().redo().run()}
            style={{
              "--hover-bg": node.textColor,
              "--hover-fg": node.color,
            }}
          >Redo</button>
        </div>



        <div class="button-group w-fit flex flex-wrap gap-2 p-1 border">
          <button
            onClick={() => editor()?.chain().focus().setTextAlign('left').run()}
            class={editor()?.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          >
            Left
          </button>
          <button
            onClick={() => editor()?.chain().focus().setTextAlign('center').run()}
            class={editor()?.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          >
            Center
          </button>
          <button
            onClick={() => editor()?.chain().focus().setTextAlign('right').run()}
            class={editor()?.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          >
            Right
          </button>
          <button
            onClick={() => editor()?.chain().focus().setTextAlign('justify').run()}
            class={editor()?.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
          >
            Justify
          </button>
        </div>

      </div>
    );
  }


  return (
    <div class="p-5">
      <div
        onClick={() => setToolbar(!toolbar())}
        class="z-50 edit_toggle cursor-pointer absolute top-0 right-0 aspect-square hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover/edit:opacity-100 pointer-events-none group-hover/edit:pointer-events-auto transition-all duration-200 ease-in-out"
      >
        < IconEdit size={16} />
      </div>

      <Show when={toolbar()}>
        <Toolbar></Toolbar>
      </Show>

      <div id="editor" class="border p-2" ref={editorRef}></div>
    </div >
  );


};
