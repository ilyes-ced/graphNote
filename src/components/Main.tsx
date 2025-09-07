import { onMount } from "solid-js";
import { setBlocks } from "./store";
import { readJSON } from "./save.ts";
import Wrapper from "./core/Wrapper.tsx";

const loadBlocks = async () => {
  const init_blocks = await readJSON();
  console.log(init_blocks);
  console.log("init_blocks:", init_blocks, Array.isArray(init_blocks));
  if (init_blocks) {
    setBlocks("nodes", init_blocks);
  }
};

export default () => {
  onMount(async () => {
    await loadBlocks();
  });

  return (
    <div id="main">
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
