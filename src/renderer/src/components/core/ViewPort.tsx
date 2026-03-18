import { setStore, store } from "../../shared/store";
import { NodeType } from "../../types";
import { newNode } from "../../shared/update";

export default (props: any) => {

  return (
    <div
      id="viewport"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // overflow: "auto", // optional
        "z-index": 10, // above background
        overflow: "hidden",
      }}
    >
      <div
        onClick={(e) => {
          // todo: thisa  no longer works because the svgs for the arrows take all the screen and they are on to to be visible so they are clicked instead of  the intended canvas
          // could cause issues in the future not sure
          console.log("canvas click");
          console.log(e.target, e.currentTarget);
          if (e.target !== e.currentTarget) return;
          console.log("canvas click");
          e.stopPropagation();
          setStore("selectedNodes", new Set());
          setStore("showColorMenu", false);
        }}
        onDblClick={(e) => {
          // could cause issues in the future not sure
          if (e.target !== e.currentTarget) return;
          console.log("canvas double click");
          e.stopPropagation();
          console.log(e.clientX)
          console.log(e.clientY)
          newNode(NodeType.Note, ((e.clientX - 65) / store.viewport.scale), ((e.clientY - 50) / store.viewport.scale));
        }}
        id="viewport-content"
        style={{
          // border: "1px solid yellow",
          transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.scale})`,
          "transform-origin": "0px 0px",
          transition: "all 0.2s ease-out",
          "min-height": "100%",
          "min-width": "100%",
          width: store.viewport.width
            ? `${store.viewport.width}px`
            : "100%" /* make it minimum 100% */,
          height: store.viewport.height ? `${store.viewport.height}px` : "100%",
        }}
      >
        {props.children}
      </div>
    </div>
  );
};
