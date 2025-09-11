import type { ColumnDef } from "@tanstack/solid-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod or Validbot schema here if you want.
export type Task = {
  id: string;
  code: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  label: "bug" | "feature" | "enhancement" | "documentation";
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "code",
    header: "Task",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu placement="bottom-end">
        <DropdownMenuTrigger class="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
            />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
