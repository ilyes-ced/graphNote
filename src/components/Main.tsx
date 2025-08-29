import { createSignal, For, Match, onMount, Switch } from "solid-js";
import { createStore } from "solid-js/store";

import Column from "./blocks/Column.tsx";
import { BlockUnion, Block_type, Task } from "../types";

import {
  BaseDirectory,
  writeTextFile,
  readTextFile,
} from "@tauri-apps/plugin-fs";
////////////////////////////////////////////////////////////////////////

import { createDraggable } from "animejs";
import Note from "./blocks/Note.tsx";
import Todo from "./blocks/Todo.tsx";

const draggable_params = {
  container: "#main",
  snap: 10,
  releaseStiffness: 1000,
  releaseEase: "out(3)",
  // doesnt let it move out of container
  containerFriction: 1,
  cursor: {
    onHover: "move",
    onGrab: "move",
  },
  onGrab: (e: any) => {
    console.log("grabbed: ", e.$target.id);
  },
  onDrag: () => {
    // updates every move
  },
  onRelease: () => {},
  // when animation settles we et the translateX/translateY for the new values for posX/posY
  onSettle: (e: any) => {
    //? moving the blocks around, update the data object and save to file
    console.log("moving: ", e);
    console.log("moving: ", e.x);
    console.log("moving: ", e.y);

    const index = blocks.findIndex((block) => block.id === e.$target.id);
    if (index === -1) return;

    setBlocks(index, {
      x: e.x,
      y: e.y,
    });

    writeJSON();
  },
};

//////////////////////////////////////////////////////////////////////////

////? some default blocks
//let init_blocks: BlockUnion[] = [
//  {
//    id: "block_0",
//    type: Block_type.Column,
//    x: 0,
//    y: 0,
//    width: 300,
//    color: "#ff00ff",
//    top_strip_color: "#234587",
//    title: "test test",
//
//    text: "test inner text for the note",
//  },
//  {
//    id: "block_1",
//    type: Block_type.Column,
//    x: 300,
//    y: 300,
//    width: 300,
//    color: "#ff0000",
//    top_strip_color: "#00f0ff",
//    title: "title for the column has some test children",
//    children: [
//      {
//        id: "block_2",
//        type: Block_type.Note,
//        x: 200,
//        y: 200,
//        width: 300,
//        color: "#00f0f0",
//        top_strip_color: "#f57090",
//
//        text: "test inner text for the note",
//      },
//      {
//        id: "block_3",
//        type: Block_type.Note,
//        x: 400,
//        y: 400,
//        width: 300,
//        color: "#707990",
//        top_strip_color: "#934573",
//
//        text: "test inner text for the note2",
//      },
//    ],
//  },
//
//  {
//    id: "block_4",
//    type: Block_type.Note,
//    x: 700,
//    y: 700,
//    width: 300,
//    color: "#909090",
//    title: "test test",
//
//    text: "test inner text for the note",
//  },
//  {
//    id: "block_5",
//    type: Block_type.Todo,
//    x: 800,
//    y: 600,
//    width: 300,
//    color: "#909090",
//    title: "test test",
//    tasks: [
//      {
//        text: "test 000",
//        check: false,
//      },
//      {
//        text: "test 111",
//        check: true,
//      },
//      {
//        text: "test 222",
//        check: true,
//      },
//      {
//        text: "test 333",
//        check: false,
//      },
//    ],
//  },
//];

const [blocks, setBlocks] = createStore<BlockUnion[]>([]);

//////////////////////////////////////////////////
//? generate random blocks
// for (let i = 0; i < 100; i++) {
//   let x = Math.floor(Math.random() * 100);
//   let y = Math.floor(Math.random() * 100);
//
//   blocks.push({
//     id: `block_${i}`,
//     type: Block_type.Note,
//     x: x,
//     y: y,
//     width: 300,
//     height: 100 + Math.floor(Math.random() * 200),
//     color: "#f0ff0f",
//     top_strip_color: "#f060ff",
//     text: "test",
//   });
//
//   console.log(`block_${i}: ${x} ${y}`);
// }
//////////////////////////////////////////////////

//? saves the JSON object as file
// TODO: make debounce for disk write operation
async function writeJSON() {
  const json = JSON.stringify(blocks, null, 2);

  await writeTextFile("config.json", json, {
    baseDir: BaseDirectory.Home,
  });
}

//? read the saved JSON object as file
async function readJSON(): Promise<BlockUnion[] | null> {
  try {
    const text = await readTextFile("config.json", {
      baseDir: BaseDirectory.Home,
    });

    const data = JSON.parse(text);
    return data as BlockUnion[];
  } catch (err) {
    console.error("Failed to read or parse config.json:", err);
    return null;
  }
}

////////////////////////////////////////////////////////////////////////
const loadBlocks = async () => {
  const init_blocks = await readJSON();

  if (!init_blocks) return;

  setBlocks(init_blocks);
};

export default () => {
  onMount(async () => {
    await loadBlocks();

    blocks.forEach((block) => {
      createDraggable("#" + block.id, draggable_params);
    });
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
    <div id="main" style={{ position: "relative", overflow: "scroll" }}>
      <For each={blocks}>
        {(block, index) => (
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
      <div style={{ top: "500px" }}>{JSON.stringify(blocks, null, 2)}</div>
    </div>
  );
};
