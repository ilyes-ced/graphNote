import { For } from "solid-js";
import Svg from "./nodes/Svg";
import "../css/Sidebar.css";

export default () => {
  let icons = [
    // basic blocks
    { name: "note", width: 32, height: 24 },
    { name: "todo", width: 32, height: 24 },
    { name: "comment", width: 32, height: 24 },
    { name: "table", width: 32, height: 24 },
    { name: "url", width: 32, height: 24 },

    // layout blocks
    { name: "arrow", width: 32, height: 32 },
    { name: "board", width: 32, height: 32 },
    { name: "column", width: 32, height: 32 },

    // text
    { name: "code", width: 24, height: 24 },
    { name: "document", width: 26, height: 32 },
    { name: "upload", width: 32, height: 32 },

    // artistic maybe
    { name: "drawing", width: 32, height: 32 },
    { name: "sketch", width: 32, height: 24 },
    { name: "color", width: 28, height: 32 },
    { name: "image", width: 32, height: 32 },
  ];

  return (
    <div id="sidebar">
      <For each={icons} fallback={<div>Loading...</div>}>
        {(icon) => (
          <div class="icon">
            <Svg
              width={icon.width}
              height={icon.height}
              classes=""
              icon_name={icon.name}
            />
            <div class="space"></div>
            <span>{icon.name}</span>
          </div>
        )}
      </For>{" "}
    </div>
  );
};
