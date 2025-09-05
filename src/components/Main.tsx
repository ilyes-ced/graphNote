import { createSignal, For, Match, onMount, Switch } from "solid-js";

import Column from "./blocks/Column.tsx";
import { BlockUnion, Block_type, Task } from "../types";

import { createDraggable, utils } from "animejs";
import Note from "./blocks/Note.tsx";
import Todo from "./blocks/Todo.tsx";

import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
import { createStore } from "solid-js/store";
////////////////////////////////////////////////////////////////////////

const [scale, setScale] = createSignal(1.0);
const [position, setPosition] = createSignal({ x: 0, y: 0 });
const [isDragging, setIsDragging] = createSignal(false);
let lastMouse = { x: 0, y: 0 };
let main: HTMLDivElement;

const [blocks, setBlocks] = createStore<BlockUnion[]>([]);

////////////////////////////////////////////////////////////////////////

const draggable_params = {
  container: "#main",
  snap: 10,
  releaseStiffness: 1000,
  releaseEase: "out(1)",
  // doesnt let it move out of container
  containerFriction: 1,
  cursor: {
    onHover: "move",
    onGrab: "move",
  },
  onGrab: (e: any) => {
    console.log("grabbed: ", e.$target.id);
  },
  onDrag: (e: any) => {
    //  // updates every move
    //  const s = scale();
    //  e.x = e.x / s;
    //  e.y = e.y / s;
  },
  onRelease: () => {},
  // when animation settles we et the translateX/translateY for the new values for posX/posY
  onSettle: (e: any) => {
    //? moving the blocks around, update the data object and save to file
    // todo: get the values, set the x and y to those values then reset the translate values to 0
    const translatex = e.x;
    const translatey = e.y;
    const target = e.$target;

    setBlocks(
      (b) => b.id === target.id,
      (b) => ({
        ...b,
        x: translatex,
        y: translatey,
      })
    );

    writeJSON();
  },
};

//////////////////////////////////////////////////

//? saves the JSON object as file
// TODO: make debounce for disk write operation
async function writeJSON() {
  const json = JSON.stringify(blocks, null, 2);

  await writeTextFile("blocks.json", json, {
    baseDir: BaseDirectory.Home,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<BlockUnion[] | null> {
  try {
    const text = await readTextFile("blocks.json", {
      baseDir: BaseDirectory.Home,
    });

    const data = JSON.parse(text);
    return data as BlockUnion[];
  } catch (err) {
    console.error("Failed to read or parse blocks.json:", err);
    return null;
  }
}

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

    blocks.forEach((block) => {
      createDraggable("#" + block.id, draggable_params);
    });

    //setPosition({ x: -main.clientWidth / 2, y: -main.clientHeight / 2 });
  });

  const check_task = (block_id: string, task_index: number) => {
    console.log("recieved click: ", block_id, " ", task_index);
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === block_id && block.type === Block_type.Todo) {
          const updatedTasks = block.tasks?.map((task: Task, index: number) => {
            if (index === task_index) {
              return { ...task, check: !task.check };
            }
            return task;
          });

          return { ...block, tasks: updatedTasks };
        }
        return block;
      })
    );

    writeJSON();
  };

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
        width: "fit-content",
        height: "fit-content",
      }}
    >
      <div>
        <div ref={main} id="main">
          <div id="grid"></div>

          <For each={blocks}>
            {(block) => (
              <Switch fallback={<div>Not Found</div>}>
                <Match when={block.type === Block_type.Column}>
                  <Column {...block} />
                </Match>
                <Match when={block.type === Block_type.Note}>
                  <Note {...block} />
                </Match>
                <Match when={block.type === Block_type.Todo}>
                  <Todo {...block} check_task={check_task} />
                </Match>
              </Switch>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
