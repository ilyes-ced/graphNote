import { mergeProps } from "solid-js";

export default (props: any) => {
  const finalProps = mergeProps({ defaultName: "Ryan Carniato" }, props);
  return (
    <svg
      class={finalProps.classes}
      viewBox="0 0 {display_icon.width} {display_icon.height}"
    >
      test
    </svg>
  );
};
