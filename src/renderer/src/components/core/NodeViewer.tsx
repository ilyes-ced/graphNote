import { Match, Show, Switch, createEffect, onCleanup, onMount } from "solid-js"
import { Portal } from "solid-js/web"
import { setStore, store } from "../../shared/store"
import { createSignal } from "solid-js";
import { AiOutlineClose } from "solid-icons/ai";
import { findNodeById } from "../../shared/update";
import { Toolbar } from "../ui/Editor";

onMount(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
        if (e.key == "Escape") setStore("nodeViewerNodeId", "")
    }
    window.addEventListener("keydown", handleKeyDown)
    onCleanup(() => {
        window.removeEventListener("keydown", handleKeyDown)
    })
})

export default () => {
    const [leftPct, setLeftPct] = createSignal(70);
    const [node, setNode] = createSignal();
    let container!: HTMLDivElement;

    const startDrag = (e: PointerEvent) => {
        e.preventDefault();
        document.body.style.userSelect = "none";

        const move = (ev: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const pct = ((ev.clientX - rect.left) / rect.width) * 100;
            setLeftPct(Math.min(85, Math.max(15, pct))); // clamp 15-85%
        };
        const stop = () => {
            document.body.style.userSelect = "";
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", stop);
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", stop);
    };


    createEffect(() => {
        const nodeId = store.nodeViewerNodeId
        console.log("node viewer id has changerd to:", nodeId)
        if (nodeId) {
            const node = findNodeById(nodeId)
            console.log(node)
            setNode(node)
        }
    })


    return (
        <Show when={store.nodeViewerNodeId !== ""}>
            <Portal>
                <div id="reader" class="z-10000 absolute top-0 left-0 size-full" style={{
                    background: store.userConfig.homeBoardStyle.bgColor ?? "var(--color-background)"
                }} >
                    <div class="h-screen w-screen flex flex-col overflow-hidden">
                        <div ref={container} class="flex flex-1 min-h-0">
                            <aside
                                class="h-full overflow-auto p-2"
                                style={{ width: `${leftPct()}%` }}
                            >
                                Left panel

                                < Switch fallback={<div> Default</div >}>
                                    <Match when={store.userConfig.pdfReaderType === "external"}>
                                        <div>not implemented yet</div>
                                    </Match>
                                </Switch >
                            </aside>
                            <div
                                onPointerDown={startDrag}
                                class="border border-border shrink-0 cursor-col-resize hover:bg-primary active:bg-chart-3 transition-colors"
                            />

                            <aside class="h-full flex-1 min-w-0 overflow-auto flex flex-col">
                                <div class="flex justify-between  p-2 border-b-2 border-border">
                                    <div>Right panel</div>
                                    <div
                                        onClick={() => { setStore("nodeViewerNodeId", "") }}
                                        class="flex items-center justify-center aspect-square transition-colors divide-neutral-100 hover:bg-primary/50 hover:border border-primary cursor-pointer">
                                        <AiOutlineClose />
                                    </div>
                                </div>
                                <div class="p-2">
                                    <div>
                                        <Toolbar node={node()} editor={editor} />
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </Portal>
        </Show>
    )
}
