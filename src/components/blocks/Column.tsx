import { Show } from "solid-js";
import "../../css/Column.css";
import { Column } from "../../types";
import Svg from "./Svg";

export default (block: Column) => {
  console.log(
    `blck id ${block.id} translateX(${block.x}px) translateY(${block.y}px)`
  );

  return (
    <div
      class="column"
      id={block.id}
      style={{
        width: block.width + "px",
        position: "absolute",
        transform: `translateX(${block.x}px) translateY(${block.y}px)`,
      }}
    >
      <div class="collapse_icon">
        <Svg width={16} height={16} classes="" icon_name={"collapse"} />
      </div>
      <div class="title">{block.title}</div>
      <div class="subtitle">subtitle</div>

      <Show
        when={block.children && block.children.length > 0}
        fallback={<div class="children_container"></div>}
      >
        here switch statement for child type to import it fromn the components
      </Show>
    </div>
  );
};
