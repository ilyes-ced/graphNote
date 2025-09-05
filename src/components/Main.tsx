import { createSignal, For, Match, onMount, Switch } from "solid-js";
import { createStore } from "solid-js/store";

import Column from "./blocks/Column.tsx";
import Note from "./blocks/Note.tsx";
import Todo from "./blocks/Todo.tsx";

import { BlockUnion, Block_type, Task } from "../types";

import { readJSON, writeJSON } from "./save.ts";

////////////////////////////////////////////////////////////////////////

const [scale, setScale] = createSignal(1.0);
const [position, setPosition] = createSignal({ x: 0, y: 0 });
const [isDragging, setIsDragging] = createSignal(false);

let lastMouse = { x: 0, y: 0 };
let main: HTMLDivElement | undefined = undefined;

const [blocks, setBlocks] = createStore<BlockUnion[]>([]);

////////////////////////////////////////////////////////////////////////

const loadBlocks = async () => {
  const init_blocks = await readJSON();

  console.log(init_blocks);
  if (!init_blocks) return;

  setBlocks(init_blocks);
};

////////////////////////////////////////////////////////////////////////
const handleWheel = async (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();
    if (e.deltaY > 0) {
      if (scale() >= 0.7) setScale(scale() - 0.1);
    } else {
      setScale(scale() + 0.1);
    }
  }
};

const handleMouseDown = (e: MouseEvent) => {
  if (e.which === 2) {
    // Middle click
    e.preventDefault();
    setIsDragging(true);
    lastMouse = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging()) {
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMouse = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseUp = (e: MouseEvent) => {
  if (e.button === 1) {
    setIsDragging(false);
  }
};
////////////////////////////////////////////////////////////////////////

export default () => {
  onMount(async () => {
    await loadBlocks();

    //setPosition({ x: -main.clientWidth / 2, y: -main.clientHeight / 2 });
  });

  return (
    <div
      id="main_wrapper"
      onwheel={handleWheel}
      onmousedown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        transform: `translate(${position().x}px, ${
          position().y
        }px) scale(${scale()})`,
        "transform-origin": "top left",
        transition: isDragging() ? "none" : "transform 0.1s ease",
      }}
    >
      <div>
        <div ref={main} id="main">
          <div id="grid"></div>

          <For each={blocks}>
            {(block) => (
              <Switch fallback={<div>Not Found</div>}>
                <Match when={block.type === Block_type.Column}>
                  <Column {...block} setBlocks={setBlocks} />
                </Match>
                <Match when={block.type === Block_type.Note}>
                  <Note {...block} setBlocks={setBlocks} />
                </Match>
                <Match when={block.type === Block_type.Todo}>
                  <Todo {...block} setBlocks={setBlocks} />
                </Match>
              </Switch>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
