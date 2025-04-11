<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";

  let canvas;
  let canvas_width = 0;
  let canvas_height = 0;

  let context;

  const resize_canvas = () => {
    canvas_width = document.getElementById("canvas_container").clientWidth;
    canvas_height = document.getElementById("canvas_container").clientHeight;
    console.log("canvas container width: " + canvas_width);
    console.log("canvas container height: " + canvas_height);
  };

  function drawGrid(lineWidth, cellWidth, cellHeight, color) {
    // Set line properties
    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    // Get size
    let width = canvas.width;
    let height = canvas.height;

    console.log(
      "ff +" + document.getElementById("canvas_container").clientWidth,
    );
    console.log(
      "ff +" + document.getElementById("canvas_container").clientHeight,
    );

    // Draw vertical lines
    for (let x = 0; x <= width; x += cellWidth) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += cellHeight) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
  }

  onMount(() => {
    context = canvas.getContext("2d");
    context.beginPath();
    context.arc(95, 50, 40, 0, 2 * Math.PI);
    context.color = "red";
    context.fillStyle = "green";
    context.strokeColor = "#f00ff0";
    context.stroke();
    context.closePath();
    context.font = "10px Arial";
    context.fillText("Hello World", 0, 10);

    resize_canvas();
  });

  const handleSize = () => {
    resize_canvas();
  };

  const handleStart = () => {
    //works
    let row1 = new row(100, 100, "new test");
    row1.draw();
    drawGrid(1, 20, 20, "#f0f044");
  };

  class row {
    constructor(posX, posY, title) {
      this.posX = posX;
      this.posY = posY;
      this.title = title;
    }

    draw() {
      context.beginPath();

      context.strokeStyle = "#f5f84f";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "20px Arial";
      context.fillText(this.title, this.posX, this.posY);

      context.lineWidth = 6;
      context.arc(this.posX, this.posY, 40, 2 * Math.PI, false);
      context.stroke();
      context.closePath();
    }
  }
</script>

<svelte:window on:resize={handleSize} />
<main class="container" on:window>
  <div id="cont1">
    <Topbar />
    <div id="cont2">
      <Sidebar />
      <div id="canvas_container">
        <canvas
          id="canvas"
          width={canvas_width}
          height={canvas_height}
          bind:this={canvas}
          on:mousedown={handleStart}
        >
        </canvas>
      </div>
    </div>
  </div>
</main>

<style>
  #cont1 {
    display: flex;
    flex-direction: column;
  }
  #cont2 {
    display: flex;
    flex-direction: row;
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
  }
  #canvas {
    background-color: #600f66;
  }
</style>
