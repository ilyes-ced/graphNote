import { IconX } from "@tabler/icons-solidjs"
import { setStore, store } from "../shared/store"
import * as pdfjsLib from "pdfjs-dist"
import { Show, createEffect, createSignal } from "solid-js"
import { Portal } from "solid-js/web"

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url).toString()

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
	const arrayBuffer = new ArrayBuffer(buffer.length)
	const view = new Uint8Array(arrayBuffer)
	for (let i = 0; i < buffer.length; ++i) {
		view[i] = buffer[i]
	}
	return arrayBuffer
}

export default () => {
	const [images, setImages] = createSignal<string[]>([])

	//TODO: maybe we should only load what the user is trying to read but it might make the experience slow
	//TODO: like this if the file is too large it will take alot of time to load and alot of ram
	createEffect(async () => {
		console.log("pdfFile changed:", store.pdfFile)
		if (store.pdfFile != null) {
			const DocBuffer: ArrayBuffer = toArrayBuffer(await window.api.readImage(store.pdfFile))
			if (!DocBuffer) return

			const pdf = await pdfjsLib.getDocument(DocBuffer).promise
			const imgs = []

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i)
				const viewport = page.getViewport({ scale: store.userConfig.pdfScale })

				const canvas = document.createElement("canvas")
				canvas.width = viewport.width
				canvas.height = viewport.height

				const context = canvas.getContext("2d")
				await page.render({ canvasContext: context, viewport }).promise

				// convert canvas to data URL for <img>
				const imgUrl = canvas.toDataURL()
				imgs.push(imgUrl)
			}

			setImages(imgs)
		}
	})

	return store.userConfig.pdfReaderType === "side" ? (
		//? slide pdf reader
		<div
			class="h-full overflow-hidden transition-all duration-300 ease-in-out transform border-l-2 border-border"
			classList={{
				"w-[700px] translate-x-0": store.pdfFile != null,
				"w-0 translate-x-full": store.pdfFile == null
			}}
		>
			<div id="PdfTitle" class="p-2 flex items-center justify-between border-b-2 border-border">
				<div class="flex items-center justify-center ">{store.pdfFile}</div>
				<div
					class="border border-transparent hover:border-primary hover:bg-primary/20 transition-color duration-200 ease-in-out cursor-pointer"
					onClick={() => setStore("pdfFile", null)}
				>
					<IconX />
				</div>
			</div>

			<PdfReader images={images()}></PdfReader>
		</div>
	) : (
		//? modal pdf reader
		<Show when={store.pdfFile != null}>
			<Portal>
				<div class="z-10000 absolute top-0 left-0 size-full  backdrop-blur-md" onClick={() => setStore("pdfFile", null)}>
					<div
						onClick={(e) => e.stopPropagation()}
						id="pdf_reader_modal_content"
						class="bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-primary animate-[modalIn_0.25s_ease] size-10/12 "
					>
						<PdfReader images={images()}></PdfReader>
					</div>
				</div>
			</Portal>
		</Show>
	)
}

function PdfReader(props: { images: string[] }) {
	console.log(props.images)
	console.log(typeof props.images)
	return (
		<div class="overflow-y-auto h-full p-2">
			{props.images.map((src, idx) => (
				<img src={src} alt={`Page ${idx + 1}`} class="mb-4 w-full" />
			))}
		</div>
	)
}
