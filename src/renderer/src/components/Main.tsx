import { onMount } from "solid-js";
import { setStore, store } from "../shared/store.tsx";
import Wrapper from "./core/Wrapper.tsx";
import Settings from "./core/Settings.tsx";


const loadNodes = async () => {
  await window.api.backUpSave();

  try {
    const data = await window.api.getNodes();
    setStore("nodes", data ?? []);
  } catch (err) {
    console.error("Failed to get nodes:", err);
  }

  try {
    const data = await window.api.getEdges();
    setStore("edges", data ?? []);
  } catch (err) {
    console.error("Failed to get edges:", err);
  }
};

export default () => {
  onMount(async () => {
    // make the grid pattern take all space
    const size = document.getElementById("main")?.getBoundingClientRect()
    if (size) {
      setStore("viewport", {
        width: (size.width / store.viewport.scale),
        height: (size.height / store.viewport.scale),
      });
    }

    try {
      await loadNodes();
    } catch (error) {
      console.log("error loading nodes:")
      console.log(error)
    }

  });

  return (
    <div id="main" class="relative h-full w-[calc(100%-65px)] overflow-hidden">
      <Settings />
      <Wrapper />
    </div>
  );
};
