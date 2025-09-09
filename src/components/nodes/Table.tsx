import { createSignal, For, Show } from "solid-js";
import "../../css/Table.css";
import { Table } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type TableProps = Table & {
  is_child?: boolean;
};

export default (node: TableProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );

  useDraggableNode(draggableRef, node, node.is_child);

  //Todo: remove this later it causes it to be undraggable in the ref={}
  return (
    <div
      ref={node.is_child ? undefined : setDraggableRef}
      class={node.is_child ? "table child_node" : "table node"}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        "z-index": node.zIndex,
      }}
    >
      <div class="table_title">title</div>
      <div>top row</div>
      <table>
        <thead>
          <tr>
            <For each={node.data[0]}>
              {(cell) => <th class="cell">{cell}</th>}
            </For>
          </tr>
        </thead>
        ``
        <tbody>
          <For
            each={node.data.slice(1)}
            fallback={
              <tr>
                <td colspan="100%">Loading...</td>
              </tr>
            }
          >
            {(row) => (
              <tr class="row">
                <For each={row}>{(cell) => <td class="cell">{cell}</td>}</For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="table_discription">discription</div>
    </div>
  );
};
