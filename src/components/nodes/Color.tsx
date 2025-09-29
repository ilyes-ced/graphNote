import { store } from "../store";
import { Color } from "../../types";

type ColorProps = Color & {
  is_child?: boolean;
  nested?: number;
};

export default (node: ColorProps) => {
  return (
    <div>
      <div
        class="aspect-5/4 w-full p-5"
        style={{ background: node.colorValue }}
      >
        {node.colorValue}
        hex value here
      </div>
      <div class="p-5 text-xs">
        by default is color name here, editable \{node.text}
      </div>
    </div>
  );
};
