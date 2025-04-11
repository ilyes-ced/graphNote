<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  let canvas;
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
  let context;

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
  });

  const handleStart = () => {
    //works
    let row1 = new row(100, 100, "new test");
    row1.draw();
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
      context.font = "10px Arial";
      context.fillText(this.title, this.posX, this.posY);

      context.lineWidth = 6;
      context.arc(this.posX, this.posY, 40, 2 * Math.PI, false);
      context.stroke();
      context.closePath();
    }
  }
</script>

<main class="container">
  <canvas id="canvas" bind:this={canvas} on:mousedown={handleStart}> </canvas>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    background-color: #000000;
  }
  #canvas {
    width: 100%;
    height: 100%;
    border: 1px solid #00ff00;
    background-color: #601010;
  }
</style>
