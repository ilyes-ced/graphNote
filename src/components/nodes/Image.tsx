import { Image } from "../../types";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  return (
    <div>
      <img
        style={{ width: "100%" }}
        src={node.path || "placeholder.png"}
        alt="test image name"
      />
    </div>
  );
};
