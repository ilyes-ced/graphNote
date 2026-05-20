import { createEffect } from "solid-js";
import { store } from "../../shared/store";
import NodeList from "./NodeList";
import NoteStyles from "./NoteStyles";
import NodeStyles from "./NodeStyles";

// have all the template componenets in this file,
// when dragged it moved with it and is made visible
// when its released we hide and put back where it belongs
// on release we take its position and create a new item there

createEffect(() => {
  console.info("store value selected nodes is changed");
  // const nodes = store.selectedNodes; // this access tracks reactivity
});

export default () => {
  return (
    <div class="flex flex-none overflow-hidden h-full w-[65px] border-r border-border z-1000">
      {/* Nodes Sidebar */}

      <div
        class="w-[65px] h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "nodes",
          "translate-x-full": store.activeSidebar == "nodeStyles",
        }}
      >
        <NodeList />
      </div>

      {/* node Styles Sidebar */}
      <div
        class="w-[65px] h-full transition-transform duration-300 ease-in-out"
        classList={{
          "-translate-x-[100%]": store.activeSidebar === "nodeStyles",
        }}
      >
        <NodeStyles />
      </div>
    </div>
  );
};

