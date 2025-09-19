import { createSignal, For, JSX } from "solid-js";
import {
  Badge,
  BadgeRegistry,
  Table as TableNode,
  type ColumnType,
} from "../../types";
import { useDraggable } from "@/shared/nodeDrag";
import { DataTable } from "./table/data-table";
import { Task, columns } from "./table/columns";
import { store } from "../store";
type TableProps = TableNode & {
  is_child?: boolean;
};
import {
  BiRegularDotsHorizontalRounded,
  BiRegularSortDown,
  BiRegularSortUp,
} from "solid-icons/bi";

export default (node: TableProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  // TODO: save later in file
  const badgeRegistry: BadgeRegistry = {
    status: [
      { text: "todo", color: "#999" },
      { text: "in-progress", color: "#007bff" },
      { text: "done", color: "#28a745" },
      { text: "cancelled", color: "#dc3545" },
    ],
    priority: [
      { text: "low", color: "#6c757d" },
      { text: "medium", color: "#ffc107" },
      { text: "high", color: "#dc3545" },
    ],
    label: [
      { text: "bug", color: "#e74c3c" },
      { text: "feature", color: "#2980b9" },
      { text: "enhancement", color: "#2ecc71" },
    ],
  };

  const [table, setTable] = createSignal<TableNode>({
    id: "block_100",
    type: 3,
    width: 300,
    zIndex: 15,
    index: 1,
    x: 1030,
    y: 350,
    columns: [
      {
        key: "id",
        title: "id",
        typeDef: { type: "string" },
      },
      {
        key: "name",
        title: "name",
        typeDef: { type: "string" },
      },
      {
        key: "age",
        title: "age",
        typeDef: { type: "number" },
      },
      {
        key: "phoneNumber",
        title: "phone number",
        typeDef: { type: "string" },
      },
      {
        key: "phoneNumber",
        title: "phone number",
        typeDef: {
          type: "status",
          value: "status",
        },
      },
    ],
    rows: [
      { id: "10", name: "ahmed", age: 10, phoneNumber: "0500000000000" },
      { id: "10", name: "ahmed", age: 10, phoneNumber: "0500000000000" },
      { id: "10", name: "ahmed", age: 10, phoneNumber: "0500000000000" },
      { id: "10", name: "ahmed", age: 10, phoneNumber: "0500000000000" },
      { id: "10", name: "ahmed", age: 10, phoneNumber: "0500000000000" },
    ],
  });

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
        transform: `translate3d(${table().x}px, ${table().y}px, 0)`,
      }}
    >
      <div class="relative overflow-x-auto">
        <Filter />
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>
                <Checkbox />
              </TableHeaderCell>
              <For each={table().columns}>
                {(header) => <TableHeaderCell>{header.title}</TableHeaderCell>}
              </For>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            <For each={table().rows}>
              {(row) => (
                <TableRow>
                  <TableCell>
                    {" "}
                    <Checkbox />
                  </TableCell>
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell>{value}</TableCell>
                  ))}
                </TableRow>
              )}
            </For>
          </TableBody>
        </Table>
        <Pagination />
      </div>
    </div>
  );
};

const Table = (props: { children: JSX.Element }) => {
  return (
    <table class="overflow-x-auto w-full text-sm text-left rtl:text-right text-foreground border border-border">
      {props.children}
    </table>
  );
};
const TableBody = (props: { children: JSX.Element }) => {
  return <tbody class="">{props.children}</tbody>;
};
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const TableHead = (props: { children: JSX.Element }) => {
  return (
    <thead class="text-xs uppercase bg-background text-foreground">
      {props.children}
    </thead>
  );
};
const TableHeaderRow = (props: { children: JSX.Element }) => {
  return (
    <tr class="px-6 py-4 font-medium whitespace-nowrap text-foreground divide-x-1 divide-border">
      {props.children}
    </tr>
  );
};
const TableHeaderCell = (props: { children: JSX.Element }) => {
  return (
    <th class="">
      <div class="px-6 py-3 flex items-center w-full cursor-pointer hover:bg-red-400">
        {props.children}
        <BiRegularSortDown class="ml-2" size={16} />
      </div>
    </th>
  );
};
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const TableRow = (props: { children: JSX.Element }) => {
  return (
    <tr class="px-6 py-4 font-medium whitespace-nowrap text-foreground border-t border-border divide-x-1 divide-border hover:bg-accent cursor-pointer">
      {props.children}
    </tr>
  );
};
const TableCell = (props: { children: JSX.Element }) => {
  return <td class="px-6 py-4">{props.children}</td>;
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const Pagination = () => {
  return (
    <div class="flex flex-row items-center justify-between p-4">
      <div>Showing x of y</div>
      <div class="flex">
        <button class="border">first</button>
        <button class="border">1</button>
        <button class="border">2</button>
        <button class="border">3</button>
        <button class="border">4</button>
        <button class="border">5</button>
        <button class="border">last</button>
      </div>
    </div>
  );
};
const Filter = () => {
  return (
    <input
      type="text"
      name=""
      placeholder="filter here"
      id=""
      class="m-4 px-4 py-1 border border-border"
    />
  );
};
const Checkbox = () => {
  return (
    <div class="flex items-center">
      <input id="checkbox-all-search" type="checkbox" class="" />
      <label for="checkbox-all-search" class="sr-only">
        checkbox
      </label>
    </div>
  );
};
