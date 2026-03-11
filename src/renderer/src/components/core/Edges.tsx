import { For, Match, Switch, onMount } from "solid-js";

import { store } from "../../shared/store";
import EdgeStep from "../edges/EdgeStep";
import EdgeBezier from "../edges/EdgeBezier";
import EdgeStraight from "../edges/EdgeStraight";
import { EdgeType } from "../../types";


onMount(() => {
  console.log(store.edges[store.activeBoards.at(-1)?.id ?? "home"])
});



export default () => {
  return (
    <div id="edges" class="pointer-events-none">
      {/*
      pointer-events-none add this when we are done fixing the dots dragging
      */}
      <For each={store.edges[store.activeBoards.at(-1)?.id ?? "home"]}>
        {(edge) => (
          <Switch fallback={<div class="bg-red-500">{JSON.stringify(edge)}</div>}>
            <Match when={edge.type === EdgeType.Bezier}>
              <EdgeBezier {...edge} />
            </Match>
            <Match when={edge.type === EdgeType.Straight}>
              <EdgeStraight {...edge} />
            </Match>
            <Match when={edge.type === EdgeType.Step}>
              <EdgeStep {...edge} />
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
};
