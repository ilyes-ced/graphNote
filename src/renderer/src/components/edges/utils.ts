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