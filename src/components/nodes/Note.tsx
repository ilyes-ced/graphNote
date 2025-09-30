import { createEffect, createSignal, onMount } from "solid-js";
import { Note } from "../../types";
import { updateNote } from "@/shared/update";
import { addSelected, debounce } from "@/shared/utils";

import StarterKit from "@tiptap/starter-kit";
import {
  createEditorTransaction,
  createTiptapEditor,
  useEditorIsActive,
} from "solid-tiptap";
import Blockquote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import {
  IconBold,
  IconEdit,
  IconItalic,
  IconStrikethrough,
} from "@tabler/icons-solidjs";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  const [editable, setEditable] = createSignal(false);

  let editorRef!: HTMLDivElement;
  let editableDiv!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: editorRef!,
    extensions: [
      StarterKit,
      Paragraph,
      Text,
      Blockquote,
      Highlight,
      Typography,
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
  <br />
  <br />
  <br />
          <p><strike>This too.</strike></p>

          <ul>
          <li>A list item</li>
          <li>And another one</li>
        </ul>


          <ol>
          <li>A list item</li>
          <li>And another one</li>
        </ol>

  <br />
  <br />
  <br />
  <br />

      <h2>Hi there,</h2>
      <p>
        this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of
        basic text styles you’d probably expect from a text editor.
      </p>
      <blockquote>
        Wow, that’s amazing. Good work, boy! 👏<br />— Mom
      </blockquote>
`,
  }));

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    // could be nested too
    // update in the update.ts shared file
    updateNote(node.id, newValue);
  }, 3000);

  const handleInput = (e: InputEvent) => {
    const newText = editableDiv?.innerText || "";
    updateText(newText);
  };

  createEffect(() => {
    if (editable()) {
      editableDiv.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableDiv);
      range.collapse(false); // Collapse to the end
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const selection = window.getSelection();
      if (!selection?.rangeCount) return;

      const range = selection.getRangeAt(0);
      const tabNode = document.createTextNode("    "); // 4 spaces tab // maybe make it user defined later

      range.insertNode(tabNode);

      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  onMount(() => {});

  const isBold = useEditorIsActive(
    () => editor(),
    () => "bold"
  );
  const isItalic = useEditorIsActive(
    () => editor(),
    () => "italic"
  );

  const isStrike = useEditorIsActive(
    () => editor(),
    () => "strike"
  );
  const isUnderline = useEditorIsActive(
    () => editor(),
    () => "underline"
  );
  const isCode = useEditorIsActive(
    () => editor(),
    () => "code"
  );
  const isParagraph = useEditorIsActive(
    () => editor(),
    () => "paragraph"
  );
  const isBlockquote = useEditorIsActive(
    () => editor(),
    () => "blockquote"
  );
  const isCodeBlock = useEditorIsActive(
    () => editor(),
    () => "codeBlock"
  );
  const isBulletList = useEditorIsActive(
    () => editor(),
    () => "bulletList"
  );
  const isOrderedList = useEditorIsActive(
    () => editor(),
    () => "orderedList"
  );

  const isHeading = (level: number) =>
    useEditorIsActive(
      () => editor(),
      () => ({ type: "heading", attrs: { level } })
    );

  const canBold = createEditorTransaction(
    () => editor(),
    (ed) => {
      try {
        return ed.can().chain().toggleBold().run();
      } catch {
        return false;
      }
    }
  );

  // Similarly for italic, undo, redo, etc.
  const canItalic = createEditorTransaction(
    () => editor(),
    (ed) => {
      try {
        return ed.can().chain().toggleItalic().run();
      } catch {
        return false;
      }
    }
  );

  const canUndo = createEditorTransaction(
    () => editor(),
    (ed) => {
      try {
        return ed.can().chain().undo().run();
      } catch {
        return false;
      }
    }
  );

  const canRedo = createEditorTransaction(
    () => editor(),
    (ed) => {
      try {
        return ed.can().chain().redo().run();
      } catch {
        return false;
      }
    }
  );

  return (
    <div class="p-5 relative group">
      <div class="cursor-pointer absolute right-0 top-0 aspect-square p-1 hover:bg-background/40 border border-transparent hover:border-border opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 ease-in-out">
        <IconEdit color="#ffffff" size={16} />
      </div>

      <div class="toolbar flex gap-1 flex-wrap mb-4">
        <button
          class="border rounded bg-accent p-2"
          disabled={!canBold()}
          classList={{ "is-active": isBold() }}
          onClick={() => editor()?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          class="border rounded bg-accent p-2"
          disabled={!canItalic()}
          classList={{ "is-active": isItalic() }}
          onClick={() => editor()?.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isUnderline() }}
          onClick={() => editor()?.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isStrike() }}
          onClick={() => editor()?.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isCode() }}
          onClick={() => editor()?.chain().focus().toggleCode().run()}
        >
          Code
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isParagraph() }}
          onClick={() => editor()?.chain().focus().setParagraph().run()}
        >
          Paragraph
        </button>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            class="border rounded bg-accent p-2"
            classList={{ "is-active": isHeading(level)() }}
            onClick={() =>
              // @ts-ignore
              editor()?.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </button>
        ))}
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isBulletList() }}
          onClick={() => editor()?.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isOrderedList() }}
          onClick={() => editor()?.chain().focus().toggleOrderedList().run()}
        >
          Ordered list
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isCodeBlock() }}
          onClick={() => editor()?.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </button>
        <button
          class="border rounded bg-accent p-2"
          classList={{ "is-active": isBlockquote() }}
          onClick={() => editor()?.chain().focus().toggleBlockquote().run()}
        >
          Blockquote
        </button>
        <button
          class="border rounded bg-accent p-2"
          onClick={() => editor()?.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
        <button
          class="border rounded bg-accent p-2"
          onClick={() => editor()?.chain().focus().setHardBreak().run()}
        >
          Hard break
        </button>
        <button
          class="border rounded bg-accent p-2"
          disabled={!canUndo()}
          onClick={() => editor()?.chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          class="border rounded bg-accent p-2"
          disabled={!canRedo()}
          onClick={() => editor()?.chain().focus().redo().run()}
        >
          Redo
        </button>
      </div>

      <div class="" id="editor" ref={editorRef}></div>
    </div>
  );
};
