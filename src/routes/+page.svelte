<script lang="ts">
  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";
  import Column from "../components/blocks/Column.svelte";
  import InPlaceEdit from "../components/InPlaceEdit.svelte";
  import { createDraggable, utils } from "animejs";
  import { onMount } from "svelte";
  interface block {
    id: string;
    posX: number;
    posY: number;
    text: string;
    dragging: boolean;
  }

  let blocks: block[] = [
    {
      id: "block_0",
      posX: 300,
      posY: 300,
      text: "testtest tes",
      dragging: false,
    },
    {
      id: "block_1",
      posX: 100,
      posY: 100,
      text: "testtest tes",
      dragging: false,
    },
    //{
    //  id: "block_2",
    //  posX: 200,
    //  posY: 200,
    //  text: "testtest tes",
    //  dragging: false,
    //},
    //{
    //  id: "block_3",
    //  posX: 100,
    //  posY: 0,
    //  text: "testtest tes",
    //  dragging: false,
    //},
    //{
    //  id: "block_4",
    //  posX: 0,
    //  posY: 100,
    //  text: "testtest tes",
    //  dragging: false,
    //},
    //{
    //  id: "block_5",
    //  posX: 400,
    //  posY: 400,
    //  text: "testtest tes",
    //  dragging: false,
    //},
  ];
  let canvas_container;
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
  const scrolHandle = (e) => {
    e.preventDefault();
    if (e.ctrlKey == true) {
      if (e.deltaY > 0) {
        if (canvas_container_scale >= 1.1)
          canvas_container_scale = canvas_container_scale - 0.1;
      } else {
        canvas_container_scale = canvas_container_scale + 0.1;
      }
      canvas_container.style = `transform: scale(${canvas_container_scale});`;
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
        <div id="canvas_container" bind:this={canvas_container}>
          <!-- for testin remove later -->
          <div
            id="column_1"
            style="transform: translateX(100px) translateY(100px); width: 300px;min-width: 300px;max-width: 300px;"
          >
            <Column />
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
    background-color: var(--container-background-color);
  }
  #canvas_container_wrapper {
    background-color: red;
    width: 100%;
    height: 100%;
  }
  #canvas_container {
    width: 100%;
    height: 100%;
    background-color: var(--surface-color-1);
    /* for grid pattern */
    background-image: radial-gradient(
      var(--surface-color-2) 1px,
      transparent 1px
    );
    background-size: 10px 10px;
    overflow: scroll;
    transform-origin: 0% 0% 0px;
  }

  .block_container {
    /* 1 or 5 is best i think maybe make it use editable */
    padding: 1px;
    min-width: 300px;
    width: 300px;
    height: 80px;
  }
  .block {
    background-color: var(--tone-color-1);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
