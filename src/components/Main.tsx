import { onMount } from "solid-js";
import { setStore } from "./store";
import Wrapper from "./core/Wrapper.tsx";
import { readJSON } from "@/shared/save.ts";

const loadNodes = async () => {
  const init_nodes = await readJSON();
  console.log(init_nodes);
  console.log("init_nodes:", init_nodes, Array.isArray(init_nodes));
  if (init_nodes) {
    setStore("nodes", init_nodes);
  }
};

export default () => {
  onMount(async () => {
    await loadNodes();
  });

  return (
    <div id="main" class="relative h-full w-[calc(100%-65px)] overflow-hidden">
      <Wrapper />
    </div>
  );
};

/*
    <div id="main">
      <For each={blocks.nodes}>
        {(block) => (
          <Switch fallback={<div>Not Found</div>}>
            <Match when={block.type === Block_type.Column}>
              <Column {...block} />
            </Match>
            <Match when={block.type === Block_type.Note}>
              <Note {...block} />
            </Match>
            <Match when={block.type === Block_type.Todo}>
              <Todo {...block} />
            </Match>
          </Switch>
        )}
      </For>
    </div>







    */
