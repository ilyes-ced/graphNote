import { createSignal, createEffect } from "solid-js";
import { Edge } from "../../types";
import { watchElementPosition } from "./utils";



export default function BezierEdgeArrow(edge: Edge) {
  const srcPos = watchElementPosition(edge.srcNodeId);
  const distPos = watchElementPosition(edge.distNodeId);

  const [start, setStart] = createSignal({ x: 0, y: 0 });
  const [end, setEnd] = createSignal({ x: 0, y: 0 });
  const [control, setControl] = createSignal({ x: 0, y: 0 });

  const [dragging, setDragging] = createSignal(false);

  // update start, end, and control points
  createEffect(() => {
    const s = srcPos();
    const d = distPos();
    if (!s || !d) return;

    const startPos = { x: s.x + s.width / 2, y: s.y + s.height / 2 };
    const endPos = { x: d.x + d.width / 2, y: d.y + d.height / 2 };

    setStart(startPos);
    setEnd(endPos);

    if (!dragging()) {
      // simple default control above the middle
      setControl({
        x: (startPos.x + endPos.x) / 2,
        y: Math.min(startPos.y, endPos.y) - 100, // curve upward
      });
    }
  });

  // convert mouse coordinates to SVG coordinates
  const getMousePos = (e: MouseEvent) => {
    const svg = e.currentTarget as SVGSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse());
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging()) return;
    setControl(getMousePos(e));
  };

  const d = () => {
    const s = start();
    const e = end();
    const c = control();
    if (!s || !e || !c) return "";
    return `M ${s.x} ${s.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`;
  };

  return (
    <svg
      class="absolute top-0 left-0 w-full h-full pointer-events-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Bezier curve 
      <path
        d={d()}
        stroke={edge.color ?? "blue"}
        fill="transparent"
        stroke-width={edge.stroke ?? 2}
        pointer-events="stroke" // only the stroke is clickable
        onClick={() => console.log("Bezier arrow clicked!")}
      />
      */}
      <defs>
        <marker
          id={`arrowhead_${edge.id}`}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polyline
            points="0,1 7,4 0,7"
            fill="none"
            stroke={edge.color ?? "blue"}
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </marker>
      </defs>
      <path
        d={d()}
        stroke={edge.color ?? "blue"}
        fill="none"
        stroke-width={edge.stroke ?? 2}
        pointer-events="stroke"
        marker-end={`url(#arrowhead_${edge.id})`} // attach the arrowhead
        onClick={() => console.log("Arrow clicked!")}
      />


      {/* Optional control lines */}
      <line
        x1={start().x}
        y1={start().y}
        x2={control().x}
        y2={control().y}
        stroke="red"
        stroke-dasharray="3"
      />
      <line
        x1={end().x}
        y1={end().y}
        x2={control().x}
        y2={control().y}
        stroke="blue"
        stroke-dasharray="3"
      />

      {/* Optional: draggable control point */}
      <circle
        cx={control().x}
        cy={control().y}
        r="8"
        fill="red"
        cursor="pointer"
        pointer-events="auto"
        onMouseDown={onMouseDown}
      />

      {/* Endpoints */}
      <circle cx={start().x} cy={start().y} r="5" fill="green" />
      <circle cx={end().x} cy={end().y} r="5" fill="green" />
    </svg>
  );
}