import { onMount, Show, createSignal, createEffect } from "solid-js";
import { Activity } from "@/types";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import { updateActivityCounter } from "@/shared/update";
import { colorWithPreservedAlpha } from "@/shared/colorUtils";

type ActivityProps = Activity & {
  is_child?: boolean;
};
//TODO: to add stuff
//  sperating months
//  showing a graph
//  adding the numbers inside the box
//  year selection
//  chaning the color
//  add graphs for it
//  on hover show date and number
//  https://www.william-troup.com/heat-js/

export default (node: ActivityProps) => {
  let calendarContainer!: HTMLDivElement;
  let contentRef: HTMLDivElement | undefined;
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeDate, setActiveDate] = createSignal("string");

  const handleEdit = (value: number) => {
    updateActivityCounter(node.id, activeDate(), value);
  };

  const classes =
    "cursor-pointer border border-border bg-card hover:bg-primary px-4 py-2";
  let cal: CalHeatmap;

  createEffect(() => {
    const data = Object.entries(node.progress).map(([date, value]) => ({
      date,
      value,
    }));
    cal?.fill(data);
  });

  createEffect(() => {
    const color = node.textColor ?? "var(--color-primary)";
    updateCellStyles();
  });

  onMount(() => {
    cal = new CalHeatmap();

    cal.paint(
      {
        itemSelector: calendarContainer,
        domain: {
          type: "year",
          sort: "asc",
        },
        subDomain: {
          color: /* node.textColor ?? */ "var(--color-foreground)",
          type: "day",
          radius: 0,
          width: 15,
          height: 15,
          label: function (timestamp: any, value: any) {
            return `${value ?? ""}`;
          },
          style: {
            stroke: "#ccc",
            strokeWidth: 1,
          },
        },
        range: 1,
        start: new Date(2025, 1),
        theme: "dark",
        scale: {
          color: {
            type: "linear",
            domain: [0, 30],
            range: ["transparent", node.textColor ?? "#f64a03"],
          },
        },
        data: {
          source: Object.entries(node.progress).map(([date, value]) => ({
            date,
            value,
          })),
          type: "json",
          x: "date", // Optional, depending on data format
          y: "value", // Optional, depending on data format
        },
      },
      [
        [
          Tooltip,
          {
            text: function (date: any, value: any, dayjsDate: any) {
              return (
                (value ? value + " times" : "No data") +
                " on " +
                dayjsDate.format("LL")
              );
            },
          },
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: "start",
            text: () =>
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) =>
                i % 2 == 0 ? "" : d
              ),
          },
        ],
      ]
    );

    cal.on("click", (event: any, timestamp: any, value: any) => {
      setIsOpen(true);
      setActiveDate(new Date(timestamp).toISOString().split("T")[0]);
      console.log(
        new Date(timestamp).toISOString().split("T")[0] + "/" + value
      );
    });
    updateCellStyles();
  });

  const updateCellStyles = () => {
    setTimeout(() => {
      const cells = Array.from(
        calendarContainer.getElementsByClassName("ch-subdomain-bg")
      );

      const color = node.textColor ?? "#f64a03";
      cells.forEach((cell: any) => {
        if (cell.style.fill) {
          const bg = colorWithPreservedAlpha(cell.style.fill, color);

          cell.style.strokeWidth = "1px";
          cell.style.stroke = color;
          cell.style.fill = bg;
        }
      });
    }, 0);
  };

  //const changeTextColor = (color: string) => {
  //  setTimeout(() => {
  //    const cells = Array.from(
  //      calendarContainer.getElementsByClassName("ch-subdomain-text")
  //    );
  //
  //    cells.forEach((cell: any) => {
  //      if (cell.style.fill) {
  //        cell.style.stroke = color;
  //      }
  //    });
  //  }, 0);
  //};

  return (
    <div class="">
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="p-5 ">
        {/* title */}
        <div class="flex mb-4">
          <div class="ActivityButton1 border-2 border-border size-14 flex justify-center items-center">
            logo
          </div>
          <div class="flex-1 px-4">
            <div class="activityTitle text-xl font-bold ">title</div>
            <div class="activityDesc ">desc</div>
          </div>
          <div class="ActivityButton2 border-2 border-border size-14 flex justify-center items-center">
            logo
          </div>
        </div>
        {/* heatmap */}
        <div
          class="border-2 border-border size-fit p-4 pb-0"
          ref={calendarContainer}
        ></div>

        {/* Edit form */}
        <div classList={{ "border-2 border-border mt-4": isOpen() }}>
          <div
            ref={contentRef}
            class="overflow-hidden transition-[height] duration-300 ease-out w-full"
            style={{
              height: isOpen() ? `${contentRef?.scrollHeight ?? 0}px` : "0px",
            }}
          >
            <div class="p-4 flex items-center justify-between">
              <div>{activeDate()}</div>
              <div
                id="controls"
                class="flex flex-row items-center justify-center"
              >
                <div
                  onClick={() => handleEdit(-1)}
                  class={classes + " rounded-l-md activityChangers"}
                >
                  -
                </div>
                <div class={classes}>{node.progress[activeDate()] ?? 0}</div>
                <div
                  onClick={() => handleEdit(+1)}
                  class={classes + "  rounded-r-md activityChangers"}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
