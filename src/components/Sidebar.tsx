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
import { store } from "./store";

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
  // basic blocks
  { name: "note", width: 32, height: 24 },
];

// have all the template componenets in this file,
// when dragged it moved with it and is made visible
// when its released we hide and put back where it belongs
// on release we take its position and create a new item there

const [dragging, setDragging] = createSignal(false);
const [dragPos, setDragPos] = createSignal({ x: 0, y: 0 });
const [cloneType, setCloneType] = createSignal<string | null>(null);
const [activeSidebar, setActiveSidebar] = createSignal<"nodes" | "styles">(
  "nodes"
);

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
  const nodes = store.selectedNodes; // this access tracks reactivity
  if (nodes.size > 0) {
    setActiveSidebar("styles");
  } else {
    setActiveSidebar("nodes");
  }
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

export default function SidebarFloating() {
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
          "translate-x-0": activeSidebar() === "nodes",
          "-translate-x-full": activeSidebar() !== "nodes",
        }}
      >
        <NodesList />
      </div>

      {/* Styles Sidebar */}
      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": activeSidebar() === "styles",
          "translate-x-full": activeSidebar() !== "styles", // slides in from the right
        }}
      >
        <NodeStyle />
      </div>
    </div>
  );
}

const NodesList: Component = (props: any) => {
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

const NodeStyle: Component = (props: any) => {
  return (
    <div class="h-full overflow-hidden w-[65px] p-4 bg-card">
      <div class="flex flex-col space-y-4 overflow-x-visible relative">
        <For each={stylesIcons} fallback={<div>Loading...</div>}>
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
