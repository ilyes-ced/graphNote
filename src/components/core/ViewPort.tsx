import { onMount } from "solid-js";
import { store } from "../store";

export default (props: any) => {
  onMount(async () => {});

  return (
    <div
      id="viewport"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "scroll", // optional
        "z-index": 1, // above background
      }}
    >
      <div
        id="viewport-content"
        style={{
          border: "1px solid yellow",
          transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.scale})`,
          "transform-origin": "0 0",
          transition: "transform 0.05s ease-out",
          width: "20000px",
          height: "20000px",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
