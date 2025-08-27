import "../../css/Column.css";
import { BlockUnion } from "../../types";

export default (block: BlockUnion) => {
  return (
    <div class="column" id={block.id}>
      <div class="collapse_icon">{block.id}</div>
      <div class="title">title</div>
      <div class="children">title</div>
    </div>
  );
};
