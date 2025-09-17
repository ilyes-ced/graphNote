import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/solid-table";
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import { Button } from "@/components/ui/button";

import { FaSolidAngleRight, FaSolidAngleLeft } from "solid-icons/fa";
import { FaSolidAnglesRight, FaSolidAnglesLeft } from "solid-icons/fa";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: Accessor<TData[] | undefined>;
};
const [pagination, setPagination] = createSignal({
  pageIndex: 0,
  pageSize: 5, // number of items per page
});
const [sorting, setSorting] = createSignal<SortingState>([]);
const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
const [rowSelection, setRowSelection] = createSignal({});

export const DataTable = <TData, TValue>(props: Props<TData, TValue>) => {
  const [local] = splitProps(props, ["columns", "data"]);

  const table = createSolidTable({
    get data() {
      return local.data() || [];
    },
    columns: local.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onPaginationChange: setPagination,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    onRowSelectionChange: setRowSelection,

    state: {
      get sorting() {
        return sorting();
      },
      get pagination() {
        return pagination();
      },
      get columnFilters() {
        return columnFilters();
      },
      get rowSelection() {
        return rowSelection();
      },
    },
  });

  return (
    <div class="">
      <TextFieldRoot>
        <TextField
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onInput={(event) =>
            table.getColumn("title")?.setFilterValue(event.currentTarget.value)
          }
          class="max-w-sm"
        />
      </TextFieldRoot>

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
      <div class="flex flex-row justify-between p-4 py-2">
        <div class="flex items-center">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getState().pagination.pageIndex + 1} rows selected
        </div>

        <div class="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FaSolidAnglesLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FaSolidAngleLeft />
          </Button>
          <div class="px-2">
            page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FaSolidAngleRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FaSolidAnglesRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
