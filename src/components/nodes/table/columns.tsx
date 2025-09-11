import type { Column, ColumnDef } from "@tanstack/solid-table";
import { Button } from "../../ui/button";
import {
  BiRegularDotsHorizontalRounded,
  BiRegularSortDown,
  BiRegularSortUp,
} from "solid-icons/bi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Match, Switch } from "solid-js";

// This type is used to define the shape of our data.
// You can use a Zod or Validbot schema here if you want.
export type Task = {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  label: "bug" | "feature" | "enhancement" | "documentation";
};

const sorterComponent = function (name: string, column: Column<Task, unknown>) {
  return (
    <Button
      variant="table"
      size={"table"}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {name}
      <Switch fallback={<BiRegularSortDown class="ml-2" size={16} />}>
        <Match when={column.getIsSorted() === "asc"}>
          <BiRegularSortDown class="ml-2" size={16} />
        </Match>
        <Match when={column.getIsSorted() === "desc"}>
          <BiRegularSortUp class="ml-2" size={16} />
        </Match>
      </Switch>
    </Button>
  );
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        indeterminate={table.getIsSomePageRowsSelected()}
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      >
        <CheckboxControl />
      </Checkbox>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      >
        <CheckboxControl />
      </Checkbox>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => {
      return sorterComponent("Title", column);
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return sorterComponent("Title", column);
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return sorterComponent("Title", column);
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      let variant:
        | "outlineYellow"
        | "outlineBlue"
        | "outlineGreen"
        | "outlineRed"
        | "outlinePurple";

      switch (status) {
        case "todo":
          variant = "outlineYellow";
          break;
        case "in-progress":
          variant = "outlineBlue";
          break;
        case "done":
          variant = "outlineGreen";
          break;
        case "cancelled":
          variant = "outlineRed";
          break;
        default:
          variant = "outlinePurple";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu placement="bottom-end">
        <DropdownMenuTrigger class="flex items-center justify-center">
          <Button variant="ghost" size="icon">
            <BiRegularDotsHorizontalRounded class="cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
