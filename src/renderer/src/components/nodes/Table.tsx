import { For, createSignal, onCleanup } from "solid-js";
import { Table } from "../../types";

type NewType = Table & {
  is_child?: boolean;
};

type TableProps = NewType;

type Column = {
  key: string;
  title: string;
  typeDef: string;
};

type Row = {
  [key: string]: string;
};

export default function TableComponent(node: TableProps) {
  const [widths, setWidths] = createSignal<number[]>(
    node.cols.map(() => 200)
  );

  let startX = 0;
  let startWidth = 0;
  let activeCol = -1;

  const startResize = (
    e: MouseEvent,
    index: number
  ) => {
    startX = e.clientX;
    startWidth = widths()[index];
    activeCol = index;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResize);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (activeCol === -1) return;

    const diff = e.clientX - startX;

    setWidths(prev => {
      const next = [...prev];

      next[activeCol] = Math.max(
        100,
        startWidth + diff
      );

      return next;
    });
  };

  const stopResize = () => {
    activeCol = -1;

    window.removeEventListener(
      "mousemove",
      onMouseMove
    );

    window.removeEventListener(
      "mouseup",
      stopResize
    );
  };

  onCleanup(stopResize);

  return (
    <div class="p-2 overflow-x-auto">
      <TableTitle />

      <table class="table-fixed border-collapse">
        {/* column widths */}
        <colgroup>
          <For each={widths()}>
            {(width) => (
              <col style={{ width: `${width}px` }} />
            )}
          </For>
        </colgroup>

        <thead>
          <TableHead
            cols={node.cols}
            startResize={startResize}
          />
        </thead>

        <tbody>
          <TableBody
            rows={node.rows}
            cols={node.cols}
          />
        </tbody>
      </table>

      <TableDesc />
    </div>
  );
}

const TableTitle = () => {
  return <div>Title</div>;
};

const TableDesc = () => {
  return <div>description</div>;
};

const TableHead = (props: {
  cols: Column[];
  startResize: (
    e: MouseEvent,
    index: number
  ) => void;
}) => {
  return (
    <tr>
      <For each={props.cols}>
        {(col, index) => (
          <th class="relative border px-3 py-2 text-left">
            {col.title}

            {/* resize handle */}
            <div
              class="
                absolute right-0 top-0
                h-full w-2
                cursor-col-resize
                hover:bg-primary
                transition-colors
              "
              onMouseDown={(e) =>
                props.startResize(e, index())
              }
            />
          </th>
        )}
      </For>
    </tr>
  );
};

const TableBody = (props: {
  rows: Row[];
  cols: Column[];
}) => {
  return (
    <For each={props.rows}>
      {(row) => (
        <TableRow row={row} cols={props.cols} />
      )}
    </For>
  );
};

const TableRow = (props: {
  row: Row;
  cols: Column[];
}) => {
  return (
    <tr>
      <For each={props.cols}>
        {(col) => (
          <td
            contentEditable
            class="
              border px-3 py-2
              overflow-hidden
              
              outline-none
            "
          >
            {props.row[col.key]}
          </td>
        )}
      </For>
    </tr>
  );
};