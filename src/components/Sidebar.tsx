import {
  Component,
  createSignal,
  For,
  onCleanup,
  onMount,
  Match,
  Switch,
  createEffect,
} from "solid-js";
import Svg from "./nodes/Svg";
import { newNode } from "@/shared/update";
import { NodeType } from "@/types";
import { store } from "../shared/store";
import ColorSelectMenu from "./ui/ColorSelectMenu";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconItalic,
  IconList,
  IconListNumbers,
  IconPilcrow,
  IconSpacingVertical,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-solidjs";
import { Editor } from "@tiptap/core";

const icons = [
  // basic blocks
  { name: "note", width: 32, height: 24 },
  { name: "todo", width: 32, height: 24 },
  { name: "comment", width: 32, height: 24 },
  { name: "table", width: 32, height: 24 },
  { name: "url", width: 32, height: 24 },

  // layout blocks
  { name: "arrow", width: 32, height: 32 },
  { name: "board", width: 32, height: 32 },
  { name: "column", width: 32, height: 32 },

  // text
  { name: "code", width: 24, height: 24 },
  { name: "document", width: 26, height: 32 },
  { name: "upload", width: 32, height: 32 },

  // artistic maybe
  { name: "drawing", width: 32, height: 32 },
  { name: "sketch", width: 32, height: 24 },
  { name: "color", width: 28, height: 32 },
  { name: "image", width: 32, height: 32 },
  { name: "activity", width: 32, height: 32 },
];

const stylesIcons = [
  { name: "bold", icon: IconBold, action: "toggleBold" },
  { name: "italic", icon: IconItalic, action: "toggleItalic" },
  { name: "underline", icon: IconUnderline, action: "toggleUnderline" },
  { name: "strike", icon: IconStrikethrough, action: "toggleStrike" },
  { name: "paragraph", icon: IconPilcrow, action: "setParagraph" },

  {
    name: "header 1",
    icon: IconH1,
    action: "toggleHeading",
    attrs: { level: 1 },
  },
  {
    name: "header 2",
    icon: IconH2,
    action: "toggleHeading",
    attrs: { level: 2 },
  },
  {
    name: "header 3",
    icon: IconH3,
    action: "toggleHeading",
    attrs: { level: 3 },
  },
  {
    name: "header 4",
    icon: IconH4,
    action: "toggleHeading",
    attrs: { level: 4 },
  },
  {
    name: "header 5",
    icon: IconH5,
    action: "toggleHeading",
    attrs: { level: 5 },
  },
  {
    name: "header 6",
    icon: IconH6,
    action: "toggleHeading",
    attrs: { level: 6 },
  },

  { name: "list", icon: IconList, action: "toggleBulletList" },
  { name: "numberedList", icon: IconListNumbers, action: "toggleOrderedList" },

  { name: "codeBlock", icon: IconCode, action: "toggleCodeBlock" },
  { name: "blockQuote", icon: IconBlockquote, action: "toggleBlockquote" },

  {
    name: "verticalRule",
    icon: IconSpacingVertical,
    action: "setHorizontalRule",
  },

  { name: "undo", icon: IconArrowBackUp, action: "undo" },
  { name: "redo", icon: IconArrowForwardUp, action: "redo" },
];

// have all the template componenets in this file,
// when dragged it moved with it and is made visible
// when its released we hide and put back where it belongs
// on release we take its position and create a new item there

const [dragging, setDragging] = createSignal(false);
const [dragPos, setDragPos] = createSignal({ x: 0, y: 0 });
const [cloneType, setCloneType] = createSignal<string | null>(null);

const handleMouseMove = (e: MouseEvent) => {
  setDragPos({ x: e.clientX, y: e.clientY });
};

const findType = (type: string): NodeType => {
  console.log("PPPPPPPPPPPPPPPPPPPPPPPP");
  console.log(type);
  switch (type) {
    case "note":
      return NodeType.Note;
    case "todo":
      return NodeType.Todo;
    case "comment":
      return NodeType.Comment;
    case "table":
      return NodeType.Table;
    case "url":
      return NodeType.Url;
    case "arrow":
      return NodeType.Arrow;
    case "board":
      return NodeType.Board;
    case "column":
      return NodeType.Column;
    case "code":
      return NodeType.Code;
    case "document":
      return NodeType.Document;
    case "upload":
      return NodeType.Upload;
    case "drawing":
      return NodeType.Drawing;
    case "sketch":
      return NodeType.Sketch;
    case "color":
      return NodeType.Color;
    case "image":
      return NodeType.Image;
    case "activity":
      return NodeType.Activity;
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};
createEffect(() => {
  console.info("store value serelcterd nodes is changed");
  // const nodes = store.selectedNodes; // this access tracks reactivity
});
const handleMouseUp = () => {
  newNode(findType(cloneType() ?? ""), dragPos().x, dragPos().y);
  setDragging(false);
  setCloneType(null);

  // here we add to the store

  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
};

const startDragging = (type: string) => (e: MouseEvent) => {
  e.preventDefault();
  setCloneType(type);
  setDragging(true);
  setDragPos({ x: e.clientX, y: e.clientY });

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

export default () => {
  onCleanup(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  });

  return (
    <div class="relative overflow-hidden h-full w-[65px] border-r border-border">
      {/* Nodes Sidebar */}
      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "nodes",
          "-translate-x-full": store.activeSidebar !== "nodes",
        }}
      >
        <NodesList />
      </div>

      {/* Styles Sidebar */}
      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "noteStyles",
          "translate-x-full": store.activeSidebar !== "noteStyles", // slides in from the right
        }}
      >
        <NoteStyles />
      </div>
    </div>
  );
};

const NodesList: Component = () => {
  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card">
      <div class="flex flex-col space-y-4 overflow-x-visible relative">
        <For each={icons} fallback={<div>Loading...</div>}>
          {(icon) => (
            <div
              class="icon rounded-md cursor-pointer flex flex-col justify-center items-center transition duration-200 ease-out hover:translate-x-2 z-10"
              onMouseDown={startDragging(icon.name)}
            >
              <Svg
                width={icon.width}
                height={icon.height}
                classes=""
                icon_name={icon.name}
              />
              <div class=""></div>

              <span class="text-sm">{icon.name}</span>
            </div>
          )}
        </For>
      </div>

      <div
        class="bg-red-900 p-4 z-50"
        style={{
          position: "absolute",
          display: dragging() ? "block" : "none",
          top: `${dragPos().y}px`,
          left: `${dragPos().x}px`,
        }}
      >
        note template
      </div>
    </div>
  );
};

const NoteStyles: Component = () => {
  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card">
      <div class="flex flex-col space-y-4 overflow-x-visible relative">
        {/* colors menu toggle
        <div>
          <div class="icon rounded cursor-pointer flex flex-col justify-center items-center z-10 bg-accent aspect-square">
            <div class="flex flex-col size-full p-2">
              <div class="bg-[#EC4899] border-b-0 h-1/6 w-full "></div>
              <div class="bg-[#8B5CF6] h-5/6 w-full "></div>
            </div>
          </div>
          <p class="text-sm text-center">colors</p>
        </div>
        */}

        <div class="h-full overflow-auto space-y-2">
          <For each={stylesIcons} fallback={<div>Loading...</div>}>
            {(icon) => (
              <div>
                <button
                  class="icon rounded cursor-pointer flex flex-col justify-center items-center z-10 bg-accent aspect-square hover:bg-primary"
                  onClick={() => {
                    console.log("Clicked italic in sidebar");
                    const editor = store.noteEditor;
                    if (editor) {
                      //editor.chain().focus().toggleItalic().run();
                      toggle(editor, icon.name);
                    } else {
                      console.warn("Editor is not yet ready");
                    }
                  }}
                >
                  <div class="flex flex-col size-full p-2">
                    <icon.icon />
                  </div>
                </button>
                <p class="text-sm text-center overflow-visible">{icon.name}</p>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

const toggle = (editor: Editor, togglable: string) => {
  switch (togglable) {
    case "bold":
      editor.chain().focus().toggleBold().run();
      break;
    case "italic":
      editor.chain().focus().toggleItalic().run();
      break;
    case "underline":
      editor.chain().focus().toggleUnderline().run();
      break;
    case "strike":
      editor.chain().focus().toggleStrike().run();
      break;
    case "paragraph":
      editor.chain().focus().setParagraph().run();
      break;
    case "header 1":
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case "header 2":
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case "header 3":
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      break;
    case "header 4":
      editor.chain().focus().toggleHeading({ level: 4 }).run();
      break;
    case "header 5":
      editor.chain().focus().toggleHeading({ level: 5 }).run();
      break;
    case "header 6":
      editor.chain().focus().toggleHeading({ level: 6 }).run();
      break;
    case "list":
      editor.chain().focus().toggleBulletList().run();
      break;
    case "numberedList":
      editor.chain().focus().toggleOrderedList().run();
      break;
    case "codeBlock":
      editor.chain().focus().toggleCodeBlock().run();
      break;
    case "blockQuote":
      editor.chain().focus().toggleBlockquote().run();
      break;
    case "verticalRule":
      editor.chain().focus().setHorizontalRule().run();
      break;
    case "undo":
      editor.chain().focus().undo().run();
      break;
    case "redo":
      editor.chain().focus().redo().run();
      break;
    default:
      console.warn("Unhandled action:", togglable);
  }
};
