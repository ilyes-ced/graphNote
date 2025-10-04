import { createSignal, onMount, onCleanup } from "solid-js";
import { store } from "../../shared/store";
import { findNodeById } from "@/shared/update";

interface Props {
  fromId: string;
  toId: string;
}

export default function CurveFromMiddle(props: Props) {
  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });
  const [control, setControl] = createSignal({ x: 0, y: 0 });

  const [dragging, setDragging] = createSignal(false);

  const updatePositions = () => {
    const fromNode = findNodeById("block_1");
    const toNode = findNodeById("block_6");

    if (!fromNode || !toNode) return;

    // Assume node position is stored as node.x and node.y
    const startPos = {
      x: fromNode.x + (fromNode.width ?? 300) / 2,
      y: fromNode.y,
    };
    const endPos = { x: toNode.x + (fromNode.width ?? 300) / 2, y: toNode.y };

    setStart(startPos);
    setEnd(endPos);

    // Set control to be the midpoint vertically offset for default curve
    setControl({
      x: (startPos.x + endPos.x) / 2,
      y: Math.min(startPos.y, endPos.y) - 100, // adjust curve height
    });
  };

  onMount(() => {
    updatePositions();
    const interval = setInterval(updatePositions, 100); // update as nodes may move
    onCleanup(() => clearInterval(interval));
  });

  const getMousePos = (e) => {
    const svg = e.currentTarget.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: cursorpt.x, y: cursorpt.y };
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);
  const onMouseMove = (e) => {
    if (!dragging()) return;
    setControl(getMousePos(e));
  };

  const d = () =>
    `M ${start().x} ${start().y} Q ${control().x} ${control().y} ${end().x} ${
      end().y
    }`;

  return (
    <svg class="size-full" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      {/* Curve */}
      <path d={d()} stroke="blue" fill="transparent" stroke-width="2" />
      {/* Optional control lines */}
      <line
        x1={start().x}
        y1={start().y}
        x2={control().x}
        y2={control().y}
        stroke="gray"
        stroke-dasharray="3"
      />
      <line
        x1={end().x}
        y1={end().y}
        x2={control().x}
        y2={control().y}
        stroke="gray"
        stroke-dasharray="3"
      />
      {/* Draggable control point */}
      <circle
        cx={control().x}
        cy={control().y}
        r="8"
        fill="red"
        cursor="pointer"
        onMouseDown={onMouseDown}
      />
      {/* Endpoints: will have thier own control to bind them to a node */}
      <circle cx={start().x} cy={start().y} r="5" fill="black" />
      <circle cx={end().x} cy={end().y} r="5" fill="black" />
    </svg>
  );
}
/**
  interface Edge {}

      <svg width="500" height="500" style="border: 1px solid #ccc;">
        <path
          d="M 50 100 C 150 0, 250 200, 350 100"
          stroke="black"
          stroke-width="2"
          fill="none"
        />
      </svg>
 */
