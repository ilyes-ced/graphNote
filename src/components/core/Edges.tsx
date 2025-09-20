import { createSignal } from "solid-js";

export default function CurveFromMiddle() {
  // Fixed start and end points
  const [start] = createSignal({ x: 50, y: 150 });
  const [end] = createSignal({ x: 350, y: 150 });

  // Movable control point (middle handle)
  const [control, setControl] = createSignal({ x: 200, y: 50 });

  const [dragging, setDragging] = createSignal(false);

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
    <svg
      width="200"
      height="200"
      style={{ border: "1px solid black" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Curve */}
      <path d={d()} stroke="blue" fill="transparent" stroke-width="2" />

      {/* Control line (optional) */}
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

      {/* Control point (draggable) */}
      <circle
        cx={control().x}
        cy={control().y}
        r="8"
        fill="red"
        cursor="pointer"
        onMouseDown={onMouseDown}
      />

      {/* Fixed endpoints (optional) */}
      <circle cx={start().x} cy={start().y} r="5" fill="black" />
      <circle cx={end().x} cy={end().y} r="5" fill="black" />
    </svg>
  );
}

/**
  interface Edge {
    srcNode: string;
    distNode: string;
    color?: string;
    stroke?: string;
    label?: string;
    style?: string; // solid, dashed ....
    type?: string; // straight, bezier, step curved
    srcArrowHead?: string;
    DistArrowHead?: string;
  }

      <svg width="500" height="500" style="border: 1px solid #ccc;">
        <path
          d="M 50 100 C 150 0, 250 200, 350 100"
          stroke="black"
          stroke-width="2"
          fill="none"
        />
      </svg>
 */
