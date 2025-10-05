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
      // setStore("activeSidebar", "nodes");
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

  return (
    <div class="p-5 ">
      {editor()?.isActive("bold") ? "bold" : "bold is false"}
      {"\n"}
      {editor()?.isActive("italic") ? "italic" : "italic is false"}
      {"\n"}
      {editor()?.isActive("underline") ? "underline" : "underline is false"}
      {"\n"}
      {editor()?.isActive("strike") ? "strike" : "strike is false"}
      {"\n"}
      {editor()?.isActive("paragraph") ? "paragraph" : "paragraph is false"}
      {"\n"}
      <div id="editor" ref={editorRef}></div>
    </div>
  );
};
