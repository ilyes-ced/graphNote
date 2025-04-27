<script lang="ts">
  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";
  import Column from "../components/blocks/Column.svelte";
  import Note from "../components/blocks/Note.svelte";
  import InPlaceEdit from "../components/InPlaceEdit.svelte";
  import { createDraggable } from "animejs";
  import { Block_type } from "./types";
  import type { Block, BlockUnion } from "./types";
  import { onMount } from "svelte";

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

  let scrollable_area, canvas_container, canvas_container_wrapper;

  let canvas_container_scale = 1.0;
  onMount(() => {
    const dra_params = {
      container: "#canvas_container",
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
    blocks.forEach((block) => {
      const dra = createDraggable("#" + block.id, dra_params);
      dra.stop();
      console.log(dra);
    });
    const ff = createDraggable("#column_1", dra_params);
  });

  const submit = (block_id: string) => {
    return ({ detail: newValue }) => {
      alert("sumited new value: ", newValue);
      // IRL: POST value to server here

      const index = blocks.findIndex((block) => block.id === block_id);
      blocks[index].text = newValue;

      console.log(blocks[index]);

      console.log(`updated ${block_id}, new value is: "${newValue}"`);
    };
  };
  const scrolHandle = (e: {
    preventDefault: () => void;
    ctrlKey: boolean;
    deltaY: number;
  }) => {
    e.preventDefault();
    if (e.ctrlKey == true) {
      if (e.deltaY > 0) {
        if (canvas_container_scale >= 1.1)
          canvas_container_scale = canvas_container_scale - 0.1;
      } else {
        canvas_container_scale = canvas_container_scale + 0.1;
      }

      canvas_container.style = `transform: scale(${canvas_container_scale});  transform-origin: ${e.clientX}px ${e.clientY}px;`;

      // not sure is needed
      // make the scrollale area div with its size * scale
      // scrollable_area.style.width = `${canvas_container_wrapper.offsetWidth * canvas_container_scale}px`;
      // scrollable_area.style.height = `${canvas_container_wrapper.offsetHeight * canvas_container_scale}px`;
    }
  };
</script>

<main class="container">
  <div id="cont1">
    <Topbar />
    <div id="cont2">
      <Sidebar />
      <div
        id="canvas_container_wrapper"
        role="region"
        on:wheel|passive={scrolHandle}
      >
        <div id="scrollable_area" bind:this={scrollable_area}>
          <div id="canvas_container" bind:this={canvas_container}>
            <!-- for testin remove later 
            <div
              id="column_1"
              style="transform: translateX(100px) translateY(100px); width: 300px;min-width: 300px;max-width: 300px;"
            >
              <Column
                title="test title"
                block_id="column_1"
                submit={submit("column_1")}
              />
            </div>
            {#each blocks as block}
              <div
                id={block.id}
                class="block_container"
                draggable="true"
                role="region"
                style="transform: translateX({block.posX}px) translateY({block.posY}px);"
              >
                <div class="block">
                  <in-place-edit value={block.text} submit={submit(block.id)}>
                  </in-place-edit>
                </div>
              </div>
            {/each}
          -->
            {#each blocks as block}
              {#if block.type == Block_type.Note}
                <Note {block} edit_func={submit(block.id)} />
              {:else if block.type == Block_type.Column}
                <Column {block} edit_func={submit(block.id)} />
              {:else}
                <div>ffezf npm_config_frozen_lockfile</div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  #cont1 {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  #cont2 {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  main {
    width: 100%;
    height: 100%;
    background-color: var(--bg);
  }
  #canvas_container_wrapper {
    background-color: red;
    width: 100%;
    height: 100%;
  }
  #scrollable_area {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  #canvas_container {
    width: 100%;
    height: 100%;
    background-color: var(--bg);
    /* for grid pattern */
    background-image: radial-gradient(var(--bg2) 1px, transparent 1px);
    background-size: 10px 10px;
    transform-origin: 0px 0px;
  }

  .block_container {
    /* 1 or 5 is best i think maybe make it use editable */
    padding: 1px;
    min-width: 300px;
    width: 300px;
    height: 80px;
  }
  .block {
    background-color: var(--bg2);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
