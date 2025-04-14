<script lang="ts">
  import { createDraggable, utils } from "animejs";
  import { onMount } from "svelte";

  onMount(() => {
    const dra_params = {
      container: "#canvas_container",
      snap: 20,
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
      //console.log(dra);
    });
  });

  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";

  const dragStartHandler = (e: MouseEvent) => {
    console.log("****************");
    console.log((e.currentTarget as HTMLElement).id);

    // hide when dra starts
    // const index = blocks.findIndex((block) => block.id === e.currentTarget.id);
    // blocks[index].dragging = true;
  };
  const dropHandler = (e: MouseEvent) => {
    console.log("/////////////////////////");
    console.log(e.offsetX);
    console.log(e.offsetY);
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
      posX: 100,
      posY: 100,
      text: "testtest tes",
      dragging: false,
    },
    //{
    //  id: "block_1",
    //  posX: 100,
    //  posY: 100,
    //  text: "testtest tes",
    //  dragging: false,
    //},
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
      <div id="canvas_container" on:dragend={dropHandler} role="region">
        {#each blocks as block, i}
          <div
            id={block.id}
            class="block {block.dragging ? 'dragging' : ''}"
            draggable="true"
            on:dragstart={dragStartHandler}
            role="region"
            style="transform: translateX({block.posX}px) translateY({block.posY}px);"
          >
            {block.text}
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
    background-color: #fe961f;
  }
  #canvas_container {
    width: 100%;
    height: 100%;
    background-color: #66ff66;
    border: 1px solid red;
  }
  #test_id {
    background-color: #655f66;
    border: 1px solid lightskyblue;
    padding: 10px;
  }

  .dragging {
    display: none;
  }

  .block {
    background-color: #655f66;
    border: 1px solid red;

    width: 80px;
    height: 80px;

    overflow: hidden;
  }
</style>
