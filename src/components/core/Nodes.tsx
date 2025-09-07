import { For, Matcht, Switch } from "solid-js";
import { blocks } from "../store";
import { Block_type } from "../../types";
import Column from "../blocks/Column";
import Note from "../blocks/Note";
import Todo from "../blocks/Todo";

export default () => {
  return (
    <div>
      <div id="nodes">
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
    </div>
  );
};
