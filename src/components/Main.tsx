import { For, onMount } from "solid-js";
import Column from "./blocks/Column.tsx";
import { BlockUnion, Block_type } from "../types";
////////////////////////////////////////////////////////////////////////

import { createDraggable } from "animejs";

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
  onGrab: () => {},
  onDrag: () => {
    // updates every move
  },
  onRelease: () => {},
  // when animation settles we et the translateX/translateY for the new values for posX/posY
  onSettle: (e: any) => {
    const index = blocks.findIndex((block) => block.id === e.$target.id);
    // TODO: for this part make not update the object but the JSON file
    // blocks[index].posX = x;
    // blocks[index].posY = y;
  },
};

////////////////////////////////////////////////////////////////////////
//? some default blocks
let blocks: BlockUnion[] = [
  {
    id: "block_0",
    type: Block_type.Note,
    x: 0,
    y: 0,
    width: 300,
    color: "#ff00ff",
    top_strip_color: "#234587",
    title: "test test",

    text: "test inner text for the note",
  },
  {
    id: "block_1",
    type: Block_type.Column,
    x: 300,
    y: 300,
    width: 300,
    color: "#ff0000",
    top_strip_color: "#00f0ff",
    title: "title for the column has children",
    children: [
      {
        id: "block_2",
        type: Block_type.Note,
        x: 200,
        y: 200,
        width: 300,
        color: "#00f0f0",
        top_strip_color: "#f57090",

        text: "test inner text for the note",
      },
      {
        id: "block_3",
        type: Block_type.Note,
        x: 400,
        y: 400,
        width: 300,
        color: "#707990",
        top_strip_color: "#934573",

        text: "test inner text for the note2",
      },
    ],
  },
];
////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////

export default () => {
  onMount(() => {
    blocks.forEach((block) => {
      createDraggable("#" + block.id, draggable_params);
    });
  });

  return (
    <div id="main" style={{ position: "relative", overflow: "scroll" }}>
      <For each={blocks}>{(item, index) => <Column {...item} />}</For>
    </div>
  );
};
