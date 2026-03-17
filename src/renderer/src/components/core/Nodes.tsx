import { For, Match, onMount, Switch } from "solid-js";
import { setStore, store } from "../../shared/store";
import { NodeType } from "../../types";
import Column from "../nodes/Column";
import Note from "../nodes/Note";
import Todo from "../nodes/Todo";
import Url from "../nodes/Url";
import Board from "../nodes/Board";
import Table from "../nodes/Table";
import Image from "../nodes/Image";
import Color from "../nodes/Color";
import Activity from "../nodes/Activity";
import Document from "../nodes/Document";
import NodeWrapper from "./NodeWrapper";

export default () => {
  onMount(() => {
    setTimeout(() => {
      let maxWidth = 0;
      let maxHeight = 0;
      const nodes = Array.from(document.getElementsByClassName("node"));
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const nodeRight = rect.x + rect.width;
        if (nodeRight > maxWidth) {
          maxWidth = nodeRight;
        }

        const nodeBottom = rect.y + rect.height;
        if (nodeBottom > maxHeight) {
          maxHeight = nodeBottom;
        }
      });
      maxWidth = Math.round((maxWidth + 50) / 10) * 10;
      maxHeight = Math.round((maxHeight + 50) / 10) * 10;

      setStore("viewport", {
        width: Math.max(maxWidth / store.viewport.scale, store.viewport.width),
        height: Math.max(maxHeight / store.viewport.scale, store.viewport.height),
      });
    }, 1000);
  });

  return (
    < div id="nodes"  >
      <For each={store.nodes[store.activeBoards.at(-1)?.id ?? "home"]}>
        {(node) => (
          <div>
            {node.type === NodeType.Board ? (
              <Board {...node} />
            ) : (
              < NodeWrapper node={node}>
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
                  <Match when={node.type === NodeType.Document}>
                    <Document {...node} />
                  </Match>
                </Switch>
              </NodeWrapper>
            )}
          </div>
        )
        }
      </For >
    </div >
  );
};
