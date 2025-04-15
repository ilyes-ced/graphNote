<script lang="ts">
  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";
  import InPlaceEdit from "../components/InPlaceEdit.svelte";
  import { createDraggable, utils } from "animejs";
  import { onMount } from "svelte";

  onMount(() => {
    const dra_params = {
      container: "#canvas_container",
      snap: 10,
      releaseStiffness: 40,
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
        console.log("*");
      },
      onRelease: (e) => {
        console.log("///////");
        console.log(e);
        console.log(e.$target);
        console.log(e.$target.id);

        // const index = blocks.findIndex((block) => block.id === e.$target.id);
        // e.$target.style = "";
        // blocks[index].posX = e.coords[1];
        // blocks[index].posY = e.coords[2];
        // console.log(e.$target.style);
      },
      // when animation settles we et the translateX/translateY for the new values for posX/posY
      onSettle: (e) => {
        console.log(e.$target.style);
        console.log(e.$target.style.transform);
        console.log(e.$target.style.transform.match(/\d+/g));
        const [x, y] = e.$target.style.transform.match(/\d+/g);
        console.log(x);
        console.log(y);

        const index = blocks.findIndex((block) => block.id === e.$target.id);
        blocks[index].posX = x;
        blocks[index].posY = y;
      },
    };
    blocks.forEach((block) => {
      const dra = createDraggable("#" + block.id, dra_params);
      dra.stop();
      console.log(dra);
    });
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
</script>

<main class="container">
  <div id="cont1">
    <Topbar />
    <div id="cont2">
      <Sidebar />
      <div id="canvas_container" role="region">
        {#each blocks as block}
          <div
            id={block.id}
            class="block_container {block.dragging ? 'dragging' : ''}"
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
  #canvas_container {
    background-color: var(--surface-color-1);
    width: 100%;
    height: 100%;
    /* for grid pattern */
    background-image: radial-gradient(
      var(--surface-color-2) 1px,
      transparent 1px
    );
    background-size: 10px 10px;
  }

  .block_container {
    padding: 5px;
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
