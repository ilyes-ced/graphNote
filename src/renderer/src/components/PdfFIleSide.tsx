import { IconX } from "@tabler/icons-solidjs";
import { setStore, store } from "../shared/store";
import * as pdfjsLib from 'pdfjs-dist';
import { createEffect, createSignal } from "solid-js";


pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL(
        'pdfjs-dist/build/pdf.worker.mjs',
        import.meta.url
    ).toString();


function toArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}




export default () => {
    const [images, setImages] = createSignal([]);

    //TODO: maybe we should only load what the user is trying to read but it might make the experience slow
    //TODO: like this if the file is too large it will take alot of time to load and alot of ram
    createEffect(async () => {
        console.log("pdfFile changed:", store.pdfFile);
        if (store.pdfFile != null) {
            const DocBuffer: ArrayBuffer = toArrayBuffer(await window.api.readImage(store.pdfFile));
            if (!DocBuffer) return;

            const pdf = await pdfjsLib.getDocument(DocBuffer).promise;
            const imgs = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1 }); // adjust scale for clarity

                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const context = canvas.getContext("2d");
                await page.render({ canvasContext: context, viewport }).promise;

                // convert canvas to data URL for <img>
                const imgUrl = canvas.toDataURL();
                imgs.push(imgUrl);
            }

            setImages(imgs);

        }
    });



    return (
        <div
            class="h-full overflow-hidden transition-all duration-300 ease-in-out transform border-l-2 border-border"
            classList={{
                "w-[700px] translate-x-0": store.pdfFile != null,
                "w-0 translate-x-full": store.pdfFile == null,
            }}
        >
            <div id="PdfTitle" class="p-2 flex items-center justify-between border-b-2 border-border">
                <div class="flex items-center justify-center ">
                    {store.pdfFile}
                </div>
                <div class="border border-transparent hover:border-primary hover:bg-primary/20 transition-color duration-200 ease-in-out cursor-pointer" onClick={() => setStore("pdfFile", null)}>
                    <IconX />
                </div>
            </div>


            <div class="overflow-y-auto h-full p-2">
                {images().map((src, idx) => (
                    <img src={src} alt={`Page ${idx + 1}`} class="mb-4 w-full" />
                ))}
            </div>

        </div>
    );
};