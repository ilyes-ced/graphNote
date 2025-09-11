import type { ColumnDef } from "@tanstack/solid-table";
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { For, Show, splitProps, Accessor, createSignal } from "solid-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: Accessor<TData[] | undefined>;
};
const [pagination, setPagination] = createSignal({
  pageIndex: 0,
  pageSize: 5, // default items per page
});

export const DataTable = <TData, TValue>(props: Props<TData, TValue>) => {
  const [local] = splitProps(props, ["columns", "data"]);

  const table = createSolidTable({
    get data() {
      return local.data() || [];
    },
    columns: local.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      get pagination() {
        return pagination();
      },
    },
    onPaginationChange: setPagination,
  });

  return (
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <TableRow>
                <For each={headerGroup.headers}>
                  {(header) => {
                    return (
                      <TableHead>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  }}
                </For>
              </TableRow>
            )}
          </For>
        </TableHeader>
        <TableBody>
          <Show
            when={table.getRowModel().rows?.length}
            fallback={
              <TableRow>
                <TableCell
                  colSpan={local.columns.length}
                  class="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            }
          >
            <For each={table.getRowModel().rows}>
              {(row) => (
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <TableCell>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )}
                  </For>
                </TableRow>
              )}
            </For>
          </Show>
        </TableBody>
      </Table>
      <div class="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        {table.getState().pagination.pageIndex + 1}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
