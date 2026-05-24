import { setStore, store } from "../../shared/store";
import { NodeType } from "../../types";
import { findNodeById, getActiveBoardId, newNode } from "../../shared/update";
import { Show, createEffect, createSignal, onMount } from "solid-js";
import { readImage } from "../../shared/utils";

export default (props: any) => {
  const [selecting, setSelecting] = createSignal(false);
  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });
  const [bgType, setBgType] = createSignal<"color" | "image">("color");
  const [bg, setBg] = createSignal("");
  const [imgSrc, setImgSrc] = createSignal("");



  createEffect(async () => {
    console.log(store.userConfig.homeBoardStyle.bgImagePath, store.userConfig.homeBoardStyle.bgColor, store.userConfig.homeBoardStyle.gridColor,)


    let imagePath
    if (getActiveBoardId() == "home") {
      console.log("------------------------------- home")
      if (store.userConfig.homeBoardStyle?.bgImagePath && store.userConfig.homeBoardStyle.bgImagePath != "") {
        setBgType("image")
        imagePath = store.userConfig.homeBoardStyle.bgImagePath
      } else {
        setBgType("color")
        setBg(store.userConfig.homeBoardStyle?.bgColor != "" ? store.userConfig.homeBoardStyle.bgColor : "var(--color-background)")
      }
    } else {
      const node = findNodeById(getActiveBoardId())
      console.log("------------------------------- ", node)
      if (node?.bgImagePath && node?.bgImagePath != "") {
        setBgType("image")
        imagePath = node?.bgImagePath ?? "image/placeholder"
      } else {
        setBgType("color")
        setBg(node?.color ?? "#062935")
      }
    }
    if (bgType() == "image") {
      try {
        console.log("reading image from the server")
        console.log("reading image from the server")
        console.log("reading image from the server")
        console.log("reading image from the server")
        console.log("reading image from the server")
        console.log("reading image from the server")
        console.log(imagePath)
        setImgSrc(await readImage(imagePath));
      } catch (err) {
        setImgSrc(await readImage("image/placeholder.png"));
      }
    }
  })



  return (
    <div
      ref={props.wrapperRef}
      id="viewport"
      style={{
        background: bgType() == "color" ? bg() : "var(--color-background)",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // overflow: "auto", // optional
        "z-index": 10, // above background
        overflow: "hidden",
      }}
    >

      <div class="bg-green-900 absolute top-20 border">
        fff qwdqwd  ;;{bgType()} ;;
      </div>
      <Show when={bgType() == "image"}>
        <img class="absolute inset-0 z-0 h-full w-full object-cover" src={imgSrc()} />
      </Show>

      <div
        onClick={(e) => {
          // todo: thisa  no longer works because the svgs for the arrows take all the screen and they are on to to be visible so they are clicked instead of  the intended canvas
          // could cause issues in the future not sure
          console.log("canvas click");
          console.log(e.target, e.currentTarget);
          if (e.target !== e.currentTarget) return;
          console.log("canvas click");
          e.stopPropagation();
          //setStore("selectedNodes", new Set());
          setStore("showColorMenu", false);
        }}
        onDblClick={(e) => {
          // could cause issues in the future not sure
          if (e.target !== e.currentTarget) return;
          console.log("canvas double click");
          e.stopPropagation();
          console.log(e.clientX)
          console.log(e.clientY)
          // todo: gets mouse Pos in the window not in the canvas, if we pan to the right and double click the node is created on the left side of the viewport 
          newNode(NodeType.Note, ((e.clientX - 65) / store.viewport.scale), ((e.clientY - 50) / store.viewport.scale));
        }}



        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) return;

          setSelecting(true);

          setStart({
            x: (e.clientX - store.viewport.x - 65) / store.viewport.scale,
            y: (e.clientY - store.viewport.y - 50) / store.viewport.scale,
          });

          setCurrent({
            x: (e.clientX - store.viewport.x - 65) / store.viewport.scale,
            y: (e.clientY - store.viewport.y - 50) / store.viewport.scale,
          });
        }}
        onMouseMove={(e) => {
          if (!selecting()) return;

          setCurrent({
            x: (e.clientX - store.viewport.x - 65) / store.viewport.scale,
            y: (e.clientY - store.viewport.y - 50) / store.viewport.scale,
          });
        }}
        onMouseUp={() => {
          if (!selecting()) return;

          setSelecting(false);

          const x1 = Math.min(start().x, current().x);
          const y1 = Math.min(start().y, current().y);
          const x2 = Math.max(start().x, current().x);
          const y2 = Math.max(start().y, current().y);

          const selected = new Set<string>();

          for (const node of store.nodes[getActiveBoardId()]) {
            const n = node;
            const h = document.getElementById(n.id)?.getBoundingClientRect().height;

            const nx1 = n.x;
            const ny1 = n.y;
            const nx2 = n.x + (n.width ?? 300);
            const ny2 = n.y + (h ?? 300);

            if (
              nx1 < x2 &&
              nx2 > x1 &&
              ny1 < y2 &&
              ny2 > y1
            ) {
              selected.add(n.id);
            }
          }
          setStore("selectedNodes", selected);
        }}

        id="viewport-content"
        style={{
          "transform-origin": "0 0",
          "background-size": "10px 10px",
          "background-position": "-20px -20px",
          "background-image": store.userConfig.gridStyle === "grid"
            ? "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)"
            : "radial-gradient(var(--dot-color) 1px, transparent 0)",

          transform: `translate3d(${store.viewport.x}px, ${store.viewport.y}px, 0)
            scale3d(
            ${store.viewport.scale},
            ${store.viewport.scale},
            1
          )`,

          transition: "transform 0.05s linear",
          "will-change": "transform",
          "min-height": "100%",
          "min-width": "100%",
          width: store.viewport.width
            ? `${store.viewport.width}px`
            : "100%" /* make it minimum 100% */,
          height: store.viewport.height ? `${store.viewport.height}px` : "100%",
        }}
      >
        {props.children}
        {selecting() && (
          <div
            style={{
              position: "absolute",
              left: `${Math.min(start().x, current().x)}px`,
              top: `${Math.min(start().y, current().y)}px`,
              width: `${Math.abs(current().x - start().x)}px`,
              height: `${Math.abs(current().y - start().y)}px`,
              border: "1px solid var(--color-primary)",
              background: "color-mix(in oklab, var(--color-primary) 20%, transparent)",
              "pointer-events": "none",
              "z-index": 10000
            }}
          />
        )}
      </div>
    </div >
  );
};
