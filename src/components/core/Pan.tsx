import { createSignal } from "solid-js";
import { useDraggableCanvas } from "../../shared/useDraggableNode";

export default (props: any) => {
  // setStore("viewport", "x", (x) => x + deltaX);
  // setStore("viewport", "y", (y) => y + deltaY);

  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableCanvas(draggableRef);

  return (
    <div ref={setDraggableRef} id="pan">
      {props.children}
    </div>
  );
};
