import { createSignal, For, JSX, Match, Show, Switch } from "solid-js";
import {
  Badge,
  BadgeRegistry,
  ColumnType,
  Table as TableNode,
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
import { FaSolidFilter } from "solid-icons/fa";
import { VsGraphLine } from "solid-icons/vs";
import { Checkbox, CheckboxControl } from "../ui/checkbox";

export default (node: TableProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  // for badges its selection
  const getCellInput = (key: string, value: string | number | Badge) => {
    // get column type here
    let colType =
      table().columns.find((col) => col.key === key) ?? ColumnType.String;
    return (
      <Switch>
        <Match when={colType.typeDef === ColumnType.String}>
          <div contentEditable>{value}</div>
        </Match>

        <Match when={colType.typeDef === ColumnType.Number}>
          <div contentEditable>{value}</div>
        </Match>

        <Match when={colType.typeDef === ColumnType.Badge}>
          multi choice here
          <BadgeComponent text={value.label} color={value.color} />
        </Match>
      </Switch>
    );
  };

  // TODO: save later in file
  const badgeRegistry: BadgeRegistry = {
    status: [
      { label: "todo", color: "#999999" },
      { label: "in-progress", color: "#007bff" },
      { label: "done", color: "#28a745" },
      { label: "cancelled", color: "#dc3545" },
    ],
    priority: [
      { label: "low", color: "#6c757d" },
      { label: "medium", color: "#ffc107" },
      { label: "high", color: "#dc3545" },
    ],
    label: [
      { label: "bug", color: "#e74c3c" },
      { label: "feature", color: "#2980b9" },
      { label: "enhancement", color: "#2ecc71" },
    ],
  };

  const getBadge = (label: string): Badge => {
    const badge = badgeRegistry["status"].find(
      (badge) => badge.label === label
    );

    if (badge) {
      return badge;
    } else {
      return { label: "unknown", color: "#ffffff" };
    }
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
        typeDef: ColumnType.String,
      },
      {
        key: "name",
        title: "name",
        typeDef: ColumnType.String,
      },
      {
        key: "age",
        title: "age",
        typeDef: ColumnType.Number,
      },
      {
        key: "phoneNumber",
        title: "phone number",
        typeDef: ColumnType.String,
      },
      {
        key: "label",
        title: "label",
        typeDef: ColumnType.Badge,
      },
    ],
    rows: [
      {
        id: "10",
        name: "ahmed",
        age: 10,
        phoneNumber: "0500000000000",
        label: getBadge("todo"),
      },
      {
        id: "10",
        name: "ahmed",
        age: 10,
        phoneNumber: "0500000000000",
        label: getBadge("in-progress"),
      },
      {
        id: "10",
        name: "ahmed",
        age: 10,
        phoneNumber: "0500000000000",
        label: getBadge("done"),
      },
      {
        id: "10",
        name: "ahmed",
        age: 10,
        phoneNumber: "0500000000000",
        label: getBadge("cancelled"),
      },
      {
        id: "10",
        name: "ahmed",
        age: 10,
        phoneNumber: "0500000000000",
        label: getBadge("todo"),
      },
    ],
  });
  type TableCellValue = string | number | Badge;

  function isBadge(val: TableCellValue): val is Badge {
    return typeof val === "object" && "label" in val && "color" in val;
  }

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
      <div class="relative overflow-x-auto p-2">
        <div class="pb-4 flex space-x-4 justify-between">
          <Filter />
          <button class="cursor-pointer px-4 py-1 border border-border hover:bg-red-500 w-fit">
            <VsGraphLine size={16} />
          </button>
        </div>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableCellCheckbox>
                <CheckboxComponent />
              </TableCellCheckbox>
              <For each={table().columns}>
                {(header) => <TableHeaderCell>{header.title}</TableHeaderCell>}
              </For>
              <TableCellCheckbox> </TableCellCheckbox>
            </TableHeaderRow>
          </TableHead>

          <TableBody>
            <For each={table().rows}>
              {(row) => (
                <TableRow>
                  <TableCellCheckbox>
                    <CheckboxComponent />
                  </TableCellCheckbox>
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell>{getCellInput(key, value)}</TableCell>
                  ))}
                  <TableCellButton>
                    <BiRegularDotsHorizontalRounded />
                  </TableCellButton>
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
      <div class="px-6 py-4 flex items-center w-full cursor-pointer hover:bg-red-400">
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
    <tr class="px-6 py-4 font-medium whitespace-nowrap text-foreground border-t border-border divide-x-1 divide-border hover:bg-accent ">
      {props.children}
    </tr>
  );
};
const TableCell = (props: { children: JSX.Element }) => {
  return <td class="px-6 py-4">{props.children}</td>;
};
// on click gere
const TableCellButton = (props: { children: JSX.Element }) => {
  return (
    <td class="px-6 py-4 cursor-pointer hover:bg-red-400">{props.children}</td>
  );
};
const TableCellCheckbox = (props: { children: JSX.Element }) => {
  return <td class="px-6 py-4">{props.children}</td>;
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const Pagination = () => {
  return (
    <div class="flex flex-row items-center justify-between pt-4 ">
      <span class="text-md font-normal  text-foreground mb-4 md:mb-0 block w-full md:inline md:w-auto">
        Showing <span class="font-semibold text-foreground">1-10</span> of{" "}
        <span class="font-semibold text-foreground">1000</span>
      </span>

      <div class="flex divide-x-1 divide-border">
        <button class="cursor-pointer hover:bg-muted border-y border-l border-border px-4">
          first
        </button>
        <button class="cursor-pointer hover:bg-muted px-4 py-1 border-y border-border bg-secondary">
          1
        </button>
        <button class="cursor-pointer hover:bg-muted px-4 py-1 border-y border-border">
          2
        </button>
        <button class="cursor-pointer hover:bg-muted px-4 py-1 border-y border-border">
          3
        </button>
        <button class="cursor-pointer hover:bg-muted px-4 py-1 border-y border-border">
          4
        </button>
        <button class="cursor-pointer hover:bg-muted px-4 py-1 border-y border-border">
          5
        </button>
        <button class="cursor-pointer hover:bg-muted border-y border-r border-border px-4">
          last
        </button>
      </div>
    </div>
  );
};
const Filter = () => {
  return (
    <div class="flex px-4 py-1 border border-border items-center">
      <FaSolidFilter class="text-foreground" />
      <input type="text" name="" placeholder="filter here" id="" class="pl-4" />
    </div>
  );
};
const CheckboxComponent = () => {
  return (
    <Checkbox class="flex items-center space-x-2">
      <CheckboxControl />
    </Checkbox>
  );
};
const BadgeComponent = (props: { text: string; color: string }) => {
  return (
    <div
      class="border rounded-md px-2 py-1 text-xs font-semibold flex items-center justify-center"
      style={{ background: props.color + "70", "border-color": props.color }}
    >
      {props.text}
    </div>
  );
};
