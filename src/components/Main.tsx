import { For, onMount } from "solid-js";
import Column from "./blocks/Column.tsx";
import { BlockUnion, Block_type } from "../types";
////////////////////////////////////////////////////////////////////////

import { createDraggable } from "animejs";

const draggable_params = {
  container: "#main",
  snap: 25,
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
let blocks: BlockUnion[] = [
  {
    id: "block_0",
    type: Block_type.Note,
    x: 0,
    y: 0,
    width: 300,
    height: 0,
    color: "#ff00ff",
    top_strip_color: "#ff00ff",

    text: "test inner text for the note",
  },
  {
    id: "block_1",
    type: Block_type.Column,
    x: 300,
    y: 300,
    width: 300,
    height: 0,
    color: "#ff00ff",
    top_strip_color: "#ff00ff",
    title: "title for the column",
    children: [
      {
        id: "block_0",
        type: Block_type.Note,
        x: 300,
        y: 300,
        width: 300,
        height: 0,
        color: "#ff00ff",
        top_strip_color: "#ff00ff",

        text: "test inner text for the note",
      },
      {
        id: "block_0",
        type: Block_type.Note,
        x: 300,
        y: 300,
        width: 300,
        height: 0,
        color: "#ff00ff",
        top_strip_color: "#ff00ff",

        text: "test inner text for the note2",
      },
    ],
  },
  //{
  //  id: "block_2",
  // type: "note",
  //  posX: 200,
  //  posY: 200,
  //  text: "testtest tes",
  //  dragging: false,
  //},
  //{
  //  id: "block_3",
  // type: "note",
  //  posX: 100,
  //  posY: 0,
  //  text: "testtest tes",
  //  dragging: false,
  //},
  //{
  //  id: "block_4",
  // type: "note",
  //  posX: 0,
  //  posY: 100,
  //  text: "testtest tes",
  //  dragging: false,
  //},
  //{
  //  id: "block_5",
  // type: "note",
  //  posX: 400,
  //  posY: 400,
  //  text: "testtest tes",
  //  dragging: false,
  //},
];
////////////////////////////////////////////////////////////////////////

export default () => {
  onMount(() => {
    blocks.forEach((block) => {
      console.log(block.id);
      const graggable = createDraggable("#" + block.id, draggable_params);
      console.log(graggable);
    });
  });

  return (
    <div id="main">
      <For each={blocks}>{(item, index) => <Column {...item} />}</For>
    </div>
  );
};
