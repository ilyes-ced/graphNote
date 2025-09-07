import { onMount } from "solid-js";
import { store } from "../store";

export default (props: any) => {
  onMount(async () => {});

  return (
    <div
      id="viewport"
      style={{
        transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.scale})`,
        transition: "transform 0.05s ease-out",
      }}
    >
      {props.children}
    </div>
  );
};
