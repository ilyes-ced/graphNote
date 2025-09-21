import { For, Match, Switch } from "solid-js";
import { store } from "../store";
import { NodeType } from "../../types";
import Column from "../nodes/Column";
import Note from "../nodes/Note";
import Todo from "../nodes/Todo";
import Url from "../nodes/Url";
import Board from "../nodes/Board";
import Table from "../nodes/Table";
import Image from "../nodes/Image";
import Color from "../nodes/Color";
import ColorSelectMenu from "../ui/ColorSelectMenu";
import Activity from "../nodes/Activity";

export default () => {
  return (
    <div id="nodes" class="bg-red-600">
      <ColorSelectMenu />

      <For each={store.nodes[store.activeBoards.at(-1)?.id ?? "home"]}>
        {(node) => (
          <Switch fallback={<div>Not Found</div>}>
            <Match when={node.type === NodeType.Column}>
              <Column {...node} />
            </Match>
            <Match when={node.type === NodeType.Note}>
              <Note {...node} />
            </Match>
            <Match when={node.type === NodeType.Todo}>
              <Todo {...node} />
            </Match>
            <Match when={node.type === NodeType.Url}>
              <Url {...node} />
            </Match>
            <Match when={node.type === NodeType.Board}>
              <Board {...node} />
            </Match>
            <Match when={node.type === NodeType.Table}>
              <Table {...node} />
            </Match>
            <Match when={node.type === NodeType.Image}>
              <Image {...node} />
            </Match>
            <Match when={node.type === NodeType.Color}>
              <Color {...node} />
            </Match>
            <Match when={node.type === NodeType.Activity}>
              <Activity {...node} />
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
};
