<script lang="ts">
  import { onMount } from "svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import Topbar from "../components/Topbar.svelte";
</script>

<main class="container">
  <div id="cont1">
    <Topbar />
    <div id="cont2">
      <Sidebar />
      <div id="canvas_container">canvas container</div>
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
