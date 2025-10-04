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

import { EditorContext } from "@/shared/editorContext";

import {
  IconBold,
  IconEdit,
  IconItalic,
  IconStrikethrough,
} from "@tabler/icons-solidjs";
import { setStore } from "../../shared/store";

type NoteProps = Note & {
  is_child?: boolean;
};

export default (node: NoteProps) => {
  let editorRef!: HTMLDivElement;

  const updateText = debounce((newValue: string) => {
    console.log("Debounced update:", newValue);
    updateNote(node.id, newValue);
  }, 3000);

  const editor = createTiptapEditor(() => ({
    element: editorRef!,
    onFocus({ editor }) {
      console.log(editor);
      setStore("noteEditor", editor);
      setStore("activeSidebar", "noteStyles");
    },
    onBlur({}) {
      // there is
      setStore("activeSidebar", "nodes");
    },
    onUpdate({ editor }) {
      updateText(JSON.stringify(editor.getJSON()));
      // The content has changed.
    },
    extensions: [
      StarterKit,
      Strike,
      Underline,
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
    content: JSON.parse(node.text),
  }));

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
    (ed: any) => {
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
    (ed: any) => {
      try {
        return ed.can().chain().toggleItalic().run();
      } catch {
        return false;
      }
    }
  );

  const canUndo = createEditorTransaction(
    () => editor(),
    (ed: any) => {
      try {
        return ed.can().chain().undo().run();
      } catch {
        return false;
      }
    }
  );

  const canRedo = createEditorTransaction(
    () => editor(),
    (ed: any) => {
      try {
        return ed.can().chain().redo().run();
      } catch {
        return false;
      }
    }
  );

  return (
    <div class="p-5 ">
      <EditorContext.Provider value={editor()}>
        <div class="" id="editor" ref={editorRef}></div>
      </EditorContext.Provider>
    </div>
  );
};
