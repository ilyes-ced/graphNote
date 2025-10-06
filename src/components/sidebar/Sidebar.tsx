import {
  Component,
  createSignal,
  For,
  onCleanup,
  createEffect,
} from "solid-js";
import Svg from "../nodes/Svg";
import { newNode } from "@/shared/update";
import { NodeType } from "@/types";
import { setStore, store } from "../../shared/store";
import NodeList from "./NodeList";
import NoteStyles from "./NoteStyles";
import NodeStyles from "./NodeStyles";

// have all the template componenets in this file,
// when dragged it moved with it and is made visible
// when its released we hide and put back where it belongs
// on release we take its position and create a new item there

createEffect(() => {
  console.info("store value serelcterd nodes is changed");
  // const nodes = store.selectedNodes; // this access tracks reactivity
});

export default () => {
  return (
    <div class="relative overflow-hidden h-full w-[65px] border-r border-border">
      {/* Nodes Sidebar */}
      <div class="relative size-full"></div>

      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "nodes",
          "-translate-x-full": store.activeSidebar !== "nodes",
        }}
      >
        <NodeList />
      </div>

      {/* note Styles Sidebar */}
      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "noteStyles",
          "-translate-x-full": store.activeSidebar !== "noteStyles", // slides in from the right
        }}
      >
        <NoteStyles />
      </div>

      {/* node Styles Sidebar */}
      <div
        class="absolute top-0 left-0 w-full h-full transition-transform duration-300 ease-in-out"
        classList={{
          "translate-x-0": store.activeSidebar === "nodeStyles",
          "-translate-x-full": store.activeSidebar !== "nodeStyles", // slides in from the right
        }}
      >
        <NodeStyles />
      </div>
    </div>
  );
};
