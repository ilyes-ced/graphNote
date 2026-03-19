import { createSignal, onCleanup, onMount } from "solid-js";

export function watchElementPosition(id: string) {
    const [state, setState] = createSignal({ x: 0, y: 0, width: 0, height: 0 });

    onMount(() => {
        const el = document.getElementById(id);
        if (!el) return;

        let running = true;

        const update = () => {
            if (!running) return;

            const style = getComputedStyle(el);
            const transform = style.transform;

            let x = 0, y = 0;

            if (transform && transform !== "none") {
                const values = transform.match(/matrix.*\((.+)\)/)?.[1].split(", ");
                if (values) {
                    x = parseFloat(values[4]) || 0;
                    y = parseFloat(values[5]) || 0;
                }
            }

            const rect = el.getBoundingClientRect();
            setState({
                x,
                y,
                width: rect.width,
                height: rect.height,
            });

            requestAnimationFrame(update);
        };

        update();

        onCleanup(() => {
            running = false;
        });
    });

    return state;
}



export function edgePoint(rect: any, target: any) {
    const cx = rect.x + rect.width / 2;
    const cy = rect.y + rect.height / 2;
    const dx = target.x - cx;
    const dy = target.y - cy;

    const w = rect.width / 2;
    const h = rect.height / 2;

    // Calculate scale to intersect rectangle edge
    const scaleX = Math.abs(dx) > 0 ? w / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? h / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);

    return {
        x: cx + dx * scale,
        y: cy + dy * scale,
    };
};

type Side = "top" | "bottom" | "left" | "right";

export function sidePoint(rect: any, side: Side) {
    switch (side) {
        case "top":
            return { x: rect.x + rect.width / 2, y: rect.y };
        case "bottom":
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height };
        case "left":
            return { x: rect.x, y: rect.y + rect.height / 2 };
        case "right":
            return { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
    }
}
export function getPorts(src: any, dst: any) {
    const scx = src.x + src.width / 2;
    const scy = src.y + src.height / 2;

    const dcx = dst.x + dst.width / 2;
    const dcy = dst.y + dst.height / 2;

    const dx = dcx - scx;
    const dy = dcy - scy;

    if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal
        if (dx > 0) {
            return { src: "right", dst: "left" };
        } else {
            return { src: "left", dst: "right" };
        }
    } else {
        // vertical
        if (dy > 0) {
            return { src: "bottom", dst: "top" };
        } else {
            return { src: "top", dst: "bottom" };
        }
    }
}

export function portVector(side: Side, gap = 30) {
    switch (side) {
        case "top": return { x: 0, y: -gap };
        case "bottom": return { x: 0, y: gap };
        case "left": return { x: -gap, y: 0 };
        case "right": return { x: gap, y: 0 };
    }
}


export function getRectIntersection(
    cx: number,
    cy: number,
    tx: number,
    ty: number,
    rect: { x: number; y: number; width: number; height: number }
) {
    const dx = tx - cx;
    const dy = ty - cy;

    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;

    const candidates: { x: number; y: number; t: number }[] = [];

    if (dx !== 0) {
        const t1 = (left - cx) / dx;
        const y1 = cy + t1 * dy;
        if (t1 > 0 && y1 >= top && y1 <= bottom)
            candidates.push({ x: left, y: y1, t: t1 });

        const t2 = (right - cx) / dx;
        const y2 = cy + t2 * dy;
        if (t2 > 0 && y2 >= top && y2 <= bottom)
            candidates.push({ x: right, y: y2, t: t2 });
    }

    if (dy !== 0) {
        const t3 = (top - cy) / dy;
        const x3 = cx + t3 * dx;
        if (t3 > 0 && x3 >= left && x3 <= right)
            candidates.push({ x: x3, y: top, t: t3 });

        const t4 = (bottom - cy) / dy;
        const x4 = cx + t4 * dx;
        if (t4 > 0 && x4 >= left && x4 <= right)
            candidates.push({ x: x4, y: bottom, t: t4 });
    }

    if (candidates.length === 0) return { x: tx, y: ty };

    candidates.sort((a, b) => a.t - b.t);
    return { x: candidates[0].x, y: candidates[0].y };
}