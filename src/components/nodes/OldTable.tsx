import { createSignal } from "solid-js";
import { Table } from "../../types";
import { useDraggable } from "@/shared/nodeDrag";
import { DataTable } from "./table/data-table";
import { Task, columns } from "./table/columns";
import { store } from "../store";
type TableProps = Table & {
  is_child?: boolean;
};

export default (node: TableProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

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
      onPointerDown={startDrag}
      class="table"
      classList={{
        "child_node w-full": node.is_child,
        node: !node.is_child,
        selected_node: store.selectedNodes.has(node.id),
      }}
      id={node.id}
      style={{
        //width: node.is_child ? "100%" : node.width + "px",
        "z-index": node.zIndex,
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
      }}
    >
      <DataTable columns={columns} data={data} />
    </div>
  );
};
