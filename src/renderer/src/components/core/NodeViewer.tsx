import { For, Show, createEffect, createResource, createSignal, onCleanup, onMount } from "solid-js"
import { Portal } from "solid-js/web"
import { AiOutlineClose } from "solid-icons/ai"
import { setStore, store } from "../../shared/store"
import { findNodeById } from "../../shared/update"
import { Editor, Toolbar } from "../ui/Editor"

import * as pdfjsLib from "pdfjs-dist"
import PdfReader from "./PdfReader"
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString()

const NodeEditor = (props: { node: any }) => {
    let editorRef!: HTMLDivElement
    const [editable] = createSignal(true)

    // created once per mounted node; the ref exists by the time tiptap mounts
    const editor = Editor(props.node, () => editorRef, editable)

    onCleanup(() => editor()?.destroy())

    return (
        <>
            <div class="p-2 border-b border-border">
                <Toolbar node={props.node} editor={editor} />
            </div>
            <div class="flex-1 min-h-0 overflow-auto p-2">
                <div ref={editorRef} class="min-h-full" />
            </div>
        </>
    )
}


export default () => {
    const [leftPct, setLeftPct] = createSignal(70)
    let container!: HTMLDivElement

    onMount(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setStore("nodeViewerNodeId", "")
        }
        window.addEventListener("keydown", handleKeyDown)
        onCleanup(() => window.removeEventListener("keydown", handleKeyDown))
    })

    const startDrag = (e: PointerEvent) => {
        e.preventDefault()
        document.body.style.userSelect = "none"

        const move = (ev: PointerEvent) => {
            const rect = container.getBoundingClientRect()
            const pct = ((ev.clientX - rect.left) / rect.width) * 100
            setLeftPct(Math.min(85, Math.max(15, pct)))
        }
        const stop = () => {
            document.body.style.userSelect = ""
            window.removeEventListener("pointermove", move)
            window.removeEventListener("pointerup", stop)
        }
        window.addEventListener("pointermove", move)
        window.addEventListener("pointerup", stop)
    }






    return (
        <Show when={store.nodeViewerNodeId} keyed>
            {(id) => {
                const node = findNodeById(id)
                if (!node) return null

                return (<Portal>
                    <div
                        id="reader"
                        class="z-10000 absolute top-0 left-0 size-full"
                        style={{ background: store.userConfig.homeBoardStyle.bgColor ?? "var(--color-background)" }}
                    >
                        <div class="h-screen w-screen flex flex-col overflow-hidden">
                            <div ref={container} class="flex flex-1 min-h-0">
                                <aside class="h-full overflow-auto p-2" style={{ width: `${leftPct()}%` }}>
                                    <PdfReader nodePath={node.path ?? ""} />
                                </aside>

                                <div
                                    onPointerDown={startDrag}
                                    class="border-4 border-border shrink-0 cursor-col-resize hover:bg-primary active:bg-chart-3 transition-colors"
                                />

                                <aside class="h-full flex-1 min-w-0 flex flex-col">
                                    <div class="flex justify-between p-2 border-b-2 border-border shrink-0">
                                        <div>title here(name of the pdf file if applied)</div>
                                        <div
                                            onClick={() => setStore("nodeViewerNodeId", "")}
                                            class="flex items-center justify-center aspect-square transition-colors hover:bg-primary/50 hover:border border-primary cursor-pointer"
                                        >
                                            <AiOutlineClose />
                                        </div>
                                    </div>

                                    {/* keyed on the id: rebuilt only when a different note is opened */}
                                    <Show when={store.nodeViewerNodeId} keyed>
                                        {(id) => {
                                            const node = findNodeById(id)
                                            return node ? <NodeEditor node={node} /> : null
                                        }}
                                    </Show>
                                </aside>
                            </div>
                        </div>
                    </div>
                </Portal>)

            }}
        </Show>
    )
}