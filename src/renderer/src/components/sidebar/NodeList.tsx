import { createSignal, For, Match, onCleanup, Switch } from "solid-js";
import Svg from "../nodes/Svg";
import { newNode } from "../../shared/update";
import { NodeType } from "../../types";
import { Portal } from "solid-js/web";
import { store } from "../../shared/store";

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

const startDragging = (type: string) => (e: MouseEvent) => {
  e.preventDefault();
  setCloneType(type);
  setDragging(true);
  setDragPos({ x: e.clientX, y: e.clientY });

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};

const [dragging, setDragging] = createSignal(false);
const [dragPos, setDragPos] = createSignal({ x: 0, y: 0 });
const [cloneType, setCloneType] = createSignal<string | null>(null);

const handleMouseMove = (e: MouseEvent) => {
  setDragPos({ x: e.clientX, y: e.clientY });
};

const handleMouseUp = () => {
  newNode(findType(cloneType() ?? ""), ((dragPos().x - 65) / store.viewport.scale), ((dragPos().y - 50) / store.viewport.scale));
  setDragging(false);
  setCloneType(null);

  // here we add to the store
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
};

const findType = (type: string): NodeType => {
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

export default () => {
  onCleanup(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  });

  return (
    <>
      <div class="h-full overflow-hidden w-[65px] p-4 bg-card">
        <div class="flex flex-col space-y-4 overflow-x-visible relative">
          <For each={icons} fallback={<div>Loading...</div>}>
            {(icon) => (
              <div
                class="icon cursor-pointer flex flex-col justify-center items-center transition duration-200 ease-out hover:translate-x-2 z-10"
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
      </div>

      <Portal>


        <div
          class="absolute bg-card z-50 pointer-events-none w-[300px] p-5"
          style={{
            display: dragging() ? "block" : "none",
            top: `${(dragPos().y)}px`,
            left: `${(dragPos().x)}px`,
            transform: `scale(${store.viewport.scale})`,
            "transform-origin": "top left"
          }}
        >
          <Switch fallback={<div>Not Found</div>}>
            <Match when={cloneType() === "note"}>
              {dragPos().x} /// {dragPos().y}
              New Note
            </Match>
            <Match when={cloneType() === "todo"}>

              <div class="text-2xl font-bold mb-4">
                <h1>Title</h1>
              </div>


            </Match>
            <Match when={cloneType() === "comment"}>
            </Match>
            <Match when={cloneType() === "table"}>
            </Match>
            <Match when={cloneType() === "url"}>
            </Match>
            <Match when={cloneType() === "arrow"}>
            </Match>
            <Match when={cloneType() === "board"}>
            </Match>
            <Match when={cloneType() === "column"}>
            </Match>
            <Match when={cloneType() === "code"}>
            </Match>
            <Match when={cloneType() === "document"}>
            </Match>
            <Match when={cloneType() === "upload"}>
            </Match>
            <Match when={cloneType() === "drawing"}>
            </Match>
            <Match when={cloneType() === "sketch"}>
            </Match>
            <Match when={cloneType() === "color"}>
            </Match>
            <Match when={cloneType() === "image"}>
            </Match>
            <Match when={cloneType() === "activity"}>
            </Match>
          </Switch>
        </div>
      </Portal>
    </>
  );
};
