import { createSignal, For } from "solid-js";
import { Table } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

import { BiRegularSortUp } from "solid-icons/bi";
import { DataTable } from "./table/data-table";
import { Task, columns } from "./table/columns";
type TableProps = Table & {
  is_child?: boolean;
};

export default (node: TableProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );

  useDraggableNode(draggableRef, node, node.is_child);
  const [data, setData] = createSignal<Task[]>([
    {
      id: "dfadasd d0000",
      code: "TASK-33",
      title: "dfadasd d0000000",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d1111",
      code: "TASK-33",
      title: "dfadasd d1111111",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d2222",
      code: "TASK-33",
      title: "dfadasd d2222222",
      status: "todo",
      label: "bug",
    },
    {
      id: "dfadasd d3333",
      code: "TASK-33",
      title: "dfadasd d3333333",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d4444",
      code: "TASK-33",
      title: "dfadasd d4444444",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d5555",
      code: "TASK-33",
      title: "dfadasd d5555555",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d6666",
      code: "TASK-33",
      title: "dfadasd d6666666",
      status: "todo",
      label: "bug",
    },

    {
      id: "dfadasd d7777",
      code: "TASK-33",
      title: "dfadasd d7777777",
      status: "todo",
      label: "bug",
    },
  ]);

  const getData = async (): Promise<Task[]> => {
    // Fetch data from your API here.
    return [
      {
        id: "dfadasd d8888",
        code: "TASK-33",
        title: "dfadasd d8888888",
        status: "todo",
        label: "bug",
      },
      // ...
    ];
  };

  return (
    <div
      ref={node.is_child ? undefined : setDraggableRef}
      class="table"
      classList={{
        "child_node w-full": node.is_child,
        node: !node.is_child,
      }}
      id={node.id}
      style={{
        //width: node.is_child ? "100%" : node.width + "px",
        "z-index": node.zIndex,
      }}
    >
      <DataTable columns={columns} data={data} />
    </div>
  );
};
