import { For, Match, Switch } from "solid-js";
import { store } from "../store";
import { NodeType } from "../../types";
import Column from "../nodes/Column";
import Note from "../nodes/Note";
import Todo from "../nodes/Todo";

export default () => {
  return (
    <div id="nodes">
      <For each={store.nodes}>
        {(block) => (
          <Switch fallback={<div>Not Found</div>}>
            <Match when={block.type === NodeType.Column}>
              <Column {...block} />
            </Match>
            <Match when={block.type === NodeType.Note}>
              <Note {...block} />
            </Match>
            <Match when={block.type === NodeType.Todo}>
              <Todo {...block} />
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
};
