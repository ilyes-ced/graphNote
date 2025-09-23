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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default (node: TableProps) => {
  const { startDrag } = useDraggable(node, node.is_child, {
    tags: ["input"],
    classes: ["columnSelection"],
  });

  //TODO: change to string which is the badgeRegistry key to show the menu of the related badge type
  // with a for loop to create a list for each type of badges used
  // none for no menu showd
  const [showBadgeSelectionMenu, setShowBadgeSelectionMenu] =
    createSignal<string>("none");
  const [badgeSelectionMenuPos, setBadgeSelectionMenuPos] = createSignal<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  // for badges its selection
  const getCellInput = (key: string, value: string | number | Badge) => {
    // get column type here
    let colType =
      node.columns.find((col) => col.key === key) ?? ColumnType.String;

    const isBadgeValue =
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      "label" in value;
    const badge = isBadgeValue ? getBadge(value.type, value.label) : null;

    return (
      <Switch>
        <Match when={colType.typeDef === ColumnType.String}>
          <div contentEditable>{value}</div>
        </Match>

        <Match when={colType.typeDef === ColumnType.Number}>
          <div contentEditable>{value}</div>
        </Match>

        <Match when={colType.typeDef === ColumnType.Badge}>
          <div class="relative">
            <BadgeComponent type={key} text={badge.label} color={badge.color} />
          </div>
        </Match>
      </Switch>
    );
  };
  const BadgeSelectionMenu = (props: { type: keyof typeof badgeRegistry }) => {
    return (
      <div
        class="badge-selection-menu absolute z-50 border border-border rounded-md p-2 flex items-center justify-center cursor-pointer bg-background"
        style={{
          top: badgeSelectionMenuPos().x + "px",
          left: badgeSelectionMenuPos().y + "px",
        }}
      >
        <div class="flex flex-col divide-accent divide-2">
          <For each={badgeRegistry[props.type]}>
            {(badge) => (
              <div
                class="px-4 py-2 hover:bg-accent rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("000000000000000000000000000000000");
                  console.log("000000000000000000000000000000000");
                  console.log("000000000000000000000000000000000");
                  console.log("000000000000000000000000000000000");
                  //TODO: change badge logic here
                  setShowBadgeSelectionMenu("none");
                }}
              >
                <BadgeComponent
                  type={props.type}
                  text={badge.label}
                  color={badge.color}
                />
              </div>
            )}
          </For>
        </div>
      </div>
    );
  };
  const BadgeComponent = (props: {
    type: string;
    text: string;
    color: string;
  }) => {
    return (
      <div
        onClick={(e) => {
          // show menu and set position
          setBadgeSelectionMenuPos({
            x: e.currentTarget.getBoundingClientRect().top - node.y - 10,
            y: e.currentTarget.getBoundingClientRect().left - node.x - 68,
          });
          setShowBadgeSelectionMenu(props.type);
        }}
        class="badge border-2 rounded-md px-2 py-1  font-semibold flex items-center justify-center cursor-pointer"
        style={{ background: props.color + "70", "border-color": props.color }}
      >
        {props.text}
      </div>
    );
  };

  // TODO: save later in file
  const badgeRegistry: BadgeRegistry = {
    status: [
      { id: "badge_0", label: "todo", color: "#999999" },
      { id: "badge_1", label: "in-progress", color: "#007bff" },
      { id: "badge_2", label: "done", color: "#28a745" },
      { id: "badge_3", label: "cancelled", color: "#dc3545" },
    ],
    priority: [
      { id: "badge_4", label: "low", color: "#28a745" },
      { id: "badge_5", label: "medium", color: "#ffc107" },
      { id: "badge_6", label: "high", color: "#dc3545" },
    ],
    label: [
      { id: "badge_7", label: "bug", color: "#e74c3c" },
      { id: "badge_8", label: "feature", color: "#2980b9" },
      { id: "badge_9", label: "enhancement", color: "#2ecc71" },
    ],
  };

  const getBadge = (type: string, label: string): Badge => {
    const badge = badgeRegistry[type].find((badge) => badge.label === label);

    if (badge) {
      return badge;
    } else {
      return { id: "none", label: "unknown", color: "#ffffff" };
    }
  };

  type TableCellValue = string | number | Badge;

  function isBadge(val: TableCellValue): val is Badge {
    return typeof val === "object" && "label" in val && "color" in val;
  }

  return (
    <div
      onMouseLeave={() => setShowBadgeSelectionMenu("none")}
      onClick={
        // maybe add if target is not badge or inside meny
        (e) => {
          if (
            !(e.target as HTMLElement).closest(".badge, .badge-selection-menu")
          ) {
            // todo: reorder task items
            setShowBadgeSelectionMenu("none");
          }
        }
      }
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
      <For each={Object.entries(badgeRegistry)}>
        {([type, badges]) => (
          <Show when={showBadgeSelectionMenu() === type}>
            <BadgeSelectionMenu type={type} />
          </Show>
        )}
      </For>
      <div class="relative overflow-x-auto p-2">
        <div class="pb-4 flex space-x-4 justify-between">
          <Filter />
          <div class="flex space-x-2 columnSelection">
            <Select
              class="rounded-none cursor-pointer"
              options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
              placeholder="Column filter"
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="">
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>

            <button class="cursor-pointer px-4 py-1 border border-border hover:bg-red-500 w-fit">
              <VsGraphLine size={16} />
            </button>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableCellCheckbox>
                <CheckboxComponent />
              </TableCellCheckbox>
              <For each={node.columns}>
                {(header) => <TableHeaderCell>{header.title}</TableHeaderCell>}
              </For>
              <TableCellCheckbox> </TableCellCheckbox>
            </TableHeaderRow>
          </TableHead>

          <TableBody>
            <For each={node.rows}>
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
const paginationButtonsClasses =
  "cursor-pointer hover:bg-muted px-4 py-1 border-y border-border";
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

        <For each={[1, 2, 3, 4, 5]}>
          {(pageNum) => (
            <button
              class={paginationButtonsClasses}
              classList={{
                // active button color, change later
                "bg-secondary": pageNum === 1,
              }}
            >
              {pageNum}
            </button>
          )}
        </For>

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
