import { createEffect, onMount } from "solid-js";
import { setStore, store } from "../../shared/store";

export default (props: any) => {
  onMount(async () => {
    // maybe here we should read all the components positions, lenghts and widths to define the size of #viewport-content

    const stop = createEffect(() => {
      if (store.nodes) {
        //? exteremly wierd behaviour: when those console.log lines are uncommented, adding nodes to other column doesnt work and the addNode function doesnt trigger at all in the moveNode.ts file
        //console.log("||||||||||||||||");
        //console.log(store.activeBoards.at(-1)?.id ?? "home");
        //console.log(store.nodes);
        //console.log(store.nodes["home"]);
        //console.log(store.nodes[store.activeBoards.at(-1)?.id ?? "home"]);
        // stop();
      }
    });
  });

  return (
    <div
      class="border border-red-600"
      id="viewport"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "auto", // optional
        "z-index": 1, // above background
      }}
    >
      <div
        class="border border-blue-600"
        onClick={(e) => {
          // could cause issues in the future not sure
          if (e.target !== e.currentTarget) return;
          console.log("canvas click");
          e.stopPropagation();
          setStore("selectedNodes", new Set());
          setStore("showColorMenu", false);
        }}
        onDblClick={(e) => {
          // could cause issues in the future not sure
          if (e.target !== e.currentTarget) return;
          console.log("canvas double click");
          e.stopPropagation();
        }}
        id="viewport-content"
        style={{
          // border: "1px solid yellow",
          transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.scale})`,
          "transform-origin": "50% 50%",
          transition: "all 0.2s ease-out",
          width: store.viewport.width ? `${store.viewport.width}px` : "100%",
          height: store.viewport.height ? `${store.viewport.height}px` : "100%",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
