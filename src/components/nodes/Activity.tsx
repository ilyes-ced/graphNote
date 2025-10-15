import { onMount, Show } from "solid-js";
import { Activity } from "@/types";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import Legend from "cal-heatmap/plugins/Legend";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import dayjs from "dayjs";
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
  onMount(() => {
    const cal: CalHeatmap = new CalHeatmap();
    cal.paint(
      {
        itemSelector: calendarContainer,
        domain: {
          type: "year",
          sort: "asc",
        },
        subDomain: {
          type: "day",
          radius: 2,
          width: 15,
          height: 15,
          label: function (timestamp, value) {
            return `${value ?? 0}`;
          },
        },
        range: 1,
        start: new Date(2025, 1),
        theme: "dark",
        scale: {
          color: {
            // Try some values: Purples, Blues, Turbo, Magma, etc ...
            scheme: "greens",
            type: "linear",
            domain: [0, 30],
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
            text: function (date, value, dayjsDate) {
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

    cal.on("click", (event, timestamp, value) => {
      console.log(new Date(timestamp).toLocaleDateString() + "/" + value);
    });
  });

  return (
    <div class="">
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="p-5 space-y-4 ">
        {/* title */}
        <div class="flex">
          <div class="border-2 border-border size-14 flex justify-center items-center">
            logo
          </div>
          <div class="flex-1 px-4">
            <div class="text-xl font-bold text-foreground">title</div>
            <div class="text-muted-foreground">desc</div>
          </div>
          <div class="border-2 border-border size-14 flex justify-center items-center">
            logo
          </div>
        </div>

        <div
          class="border-2 border-border size-fit p-4"
          ref={calendarContainer}
        ></div>
      </div>
    </div>
  );
};
