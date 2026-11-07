// PdfReader.tsx
import { For, Show, createEffect, createResource, createSignal, onCleanup, onMount } from "solid-js"
import { AiOutlineLeft, AiOutlineRight } from "solid-icons/ai"
import * as pdfjsLib from "pdfjs-dist"
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist"
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url"
import { TextLayer } from "pdfjs-dist"
import "pdfjs-dist/web/pdf_viewer.css" // styles for .textLayer

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const MAX_PIXELS = 16_777_216


const PdfPage = (props: { pdf: PDFDocumentProxy; pageNum: number }) => {
    let wrapper!: HTMLDivElement
    let canvas!: HTMLCanvasElement
    let textDiv!: HTMLDivElement
    const [ratio, setRatio] = createSignal(1.414)

    let task: RenderTask | undefined
    let textLayer: TextLayer | undefined
    let visible = false
    let renderedKey = ""
    let token = 0
    let io: IntersectionObserver | undefined
    let ro: ResizeObserver | undefined
    let timer = 0

    const render = async () => {
        const cssWidth = wrapper.getBoundingClientRect().width
        if (!visible || !cssWidth) return

        const dpr = window.devicePixelRatio || 1
        const key = `${Math.round(cssWidth * 100)}@${dpr}`
        if (key === renderedKey) return

        const my = ++token
        try {
            const page = await props.pdf.getPage(props.pageNum)
            if (my !== token || !visible) return

            // viewport in CSS pixels: this is what the text layer uses too
            const base = page.getViewport({ scale: 1 })
            const cssScale = cssWidth / base.width
            const viewport = page.getViewport({ scale: cssScale })

            // bitmap is exactly CSS size x dpr (1:1 on screen), only reduced if huge
            let outputScale = dpr
            const px = viewport.width * viewport.height * outputScale * outputScale
            if (px > MAX_PIXELS) outputScale *= Math.sqrt(MAX_PIXELS / px)

            const off = document.createElement("canvas")
            off.width = Math.round(viewport.width * outputScale)
            off.height = Math.round(viewport.height * outputScale)

            task?.cancel()
            const t = page.render({
                canvas: off,                              // pdf.js v5
                canvasContext: off.getContext("2d")!,     // pdf.js v4
                viewport,
                transform: [outputScale, 0, 0, outputScale, 0, 0],
            } as any)
            task = t
            await t.promise
            if (my !== token) return

            // 1:1 copy, no resampling
            canvas.width = off.width
            canvas.height = off.height
            canvas.getContext("2d")!.drawImage(off, 0, 0)

            // selectable text on top
            textLayer?.cancel()
            textDiv.replaceChildren()
            textDiv.style.setProperty("--scale-factor", String(cssScale))
            textDiv.style.setProperty("--user-unit", "1")
            textLayer = new TextLayer({
                textContentSource: page.streamTextContent(),
                container: textDiv,
                viewport,
            })
            await textLayer.render()

            renderedKey = key
        } catch (err: any) {
            if (err?.name !== "RenderingCancelledException") console.error("pdf page render failed", props.pageNum, err)
        }
    }

    const release = () => {
        token++
        task?.cancel()
        textLayer?.cancel()
        textDiv.replaceChildren()
        canvas.width = 0
        renderedKey = ""
    }

    onMount(() => {
        props.pdf.getPage(props.pageNum).then((page) => {
            const vp = page.getViewport({ scale: 1 })
            setRatio(vp.height / vp.width)
        })

        io = new IntersectionObserver(
            ([e]) => {
                visible = e.isIntersecting
                visible ? render() : release()
            },
            { root: wrapper.closest("[data-pdf-scroll]"), rootMargin: "800px 0px" }
        )
        io.observe(wrapper)

        ro = new ResizeObserver(() => {
            clearTimeout(timer)
            timer = window.setTimeout(render, 150)
        })
        ro.observe(wrapper)
    })

    onCleanup(() => {
        token++
        io?.disconnect()
        ro?.disconnect()
        clearTimeout(timer)
        task?.cancel()
        textLayer?.cancel()
    })

    return (
        <div
            ref={wrapper}
            data-page={props.pageNum}
            class="relative mb-4 w-full bg-white shadow"
            style={{ "aspect-ratio": `1 / ${ratio()}` }}
        >
            <canvas ref={canvas} class="block w-full h-full" />
            <div ref={textDiv} class="textLayer select-text" />
        </div>
    )
}


export default function PdfReader(props: { nodePath: string }) {
    let scroller!: HTMLDivElement
    const [current, setCurrent] = createSignal(1)
    const [draft, setDraft] = createSignal("1")
    const [editing, setEditing] = createSignal(false)

    const [pdf] = createResource(
        () => props.nodePath || undefined, // falsy source => no fetch
        async (file) => {
            const data = await window.api.readImage(file)
            return await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise
        }
    )

    // reading a errored resource throws in Solid, so always go through this
    const doc = () => (pdf.state === "ready" ? pdf() : undefined)
    const numPages = () => doc()?.numPages ?? 0

    createEffect(() => {
        const d = doc()
        if (d) onCleanup(() => d.destroy())
    })

    createEffect(() => {
        const c = current()
        if (!editing()) setDraft(String(c))
    })

    // which page is at the top of the scroll area
    let raf = 0
    const updateCurrent = () => {
        raf = 0
        const pages = scroller.querySelectorAll<HTMLElement>("[data-page]")
        if (!pages.length) return
        const y = scroller.scrollTop + scroller.clientHeight * 0.3
        let lo = 0, hi = pages.length - 1, ans = 0
        while (lo <= hi) {
            const mid = (lo + hi) >> 1
            if (pages[mid].offsetTop <= y) { ans = mid; lo = mid + 1 } else hi = mid - 1
        }
        setCurrent(ans + 1)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(updateCurrent) }
    onCleanup(() => raf && cancelAnimationFrame(raf))

    const goTo = (n: number) => {
        const target = Math.min(Math.max(1, Math.round(n)), numPages())
        const el = scroller.querySelector<HTMLElement>(`[data-page="${target}"]`)
        if (!el) return
        scroller.scrollTo({ top: el.offsetTop - 8 })
        setCurrent(target)
        setDraft(String(target))
    }

    const commitDraft = () => {
        const n = parseInt(draft(), 10)
        Number.isFinite(n) ? goTo(n) : setDraft(String(current()))
    }

    const btn =
        "flex items-center justify-center size-7 border border-border transition-colors hover:bg-primary/50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"

    return (
        <div class="h-full min-h-0 flex flex-col">
            <Show when={numPages() > 0}>
                <div class="shrink-0 flex items-center justify-center gap-2 p-1 border-b border-border text-sm">
                    <button class={btn} disabled={current() <= 1} onClick={() => goTo(current() - 1)}>
                        <AiOutlineLeft />
                    </button>

                    <input
                        class="w-12 h-7 text-center border border-border bg-transparent outline-none focus:border-primary"
                        inputmode="numeric"
                        value={draft()}
                        onInput={(e) => setDraft(e.currentTarget.value.replace(/\D/g, ""))}
                        onFocus={(e) => { setEditing(true); e.currentTarget.select() }}
                        onBlur={() => { setEditing(false); commitDraft() }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.currentTarget.blur()
                            if (e.key === "Escape") { setDraft(String(current())); e.currentTarget.blur() }
                            e.stopPropagation() // keep the viewer's Escape-to-close from firing
                        }}
                    />
                    <span class="opacity-70">/ {numPages()}</span>

                    <button class={btn} disabled={current() >= numPages()} onClick={() => goTo(current() + 1)}>
                        <AiOutlineRight />
                    </button>
                </div>
            </Show>

            <div
                ref={scroller}
                data-pdf-scroll
                onScroll={onScroll}
                class="relative flex-1 min-h-0 overflow-y-auto p-2"
            >
                <Show when={!props.nodePath}>
                    <div>No file path on this node</div>
                </Show>
                <Show when={pdf.loading}>
                    <div>Loading PDF…</div>
                </Show>
                <Show when={pdf.state === "errored"}>
                    <div class="text-red-500 break-all">Failed to load PDF: {String(pdf.error)}</div>
                </Show>

                <Show when={doc()} keyed>
                    {(d) => (
                        <For each={Array.from({ length: d.numPages }, (_, i) => i + 1)}>
                            {(n) => <PdfPage pdf={d} pageNum={n} />}
                        </For>
                    )}
                </Show>
            </div>
        </div>
    )
}