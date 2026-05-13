import { createSignal, onMount } from "solid-js";
import { Document } from "../../types";
import Svg from "./Svg";
import * as pdfjsLib from 'pdfjs-dist';
import { setStore, store } from "../../shared/store";


type DocumentProps = Document & {
  is_child?: boolean;
};

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


export default (node: DocumentProps) => {




  onMount(async () => {
    //const DocBuffer: ArrayBuffer = toArrayBuffer(await window.api.readImage(node.path));
    //console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
    //console.log(DocBuffer)
    //if (!DocBuffer) return;


    //let doc = await pdfjsLib.getDocument(DocBuffer).promise
    //const page = await doc.getPage(1);

    //const viewport = page.getViewport({ scale: 0.4 });

    //const canvas = document.createElement('canvas');
    //const context = canvas.getContext('2d');

    //var outputScale = window.devicePixelRatio || 1;
    //canvas.width = Math.floor(viewport.width * outputScale);
    //canvas.height = Math.floor(viewport.height * outputScale);
    //canvas.style.width = Math.floor(viewport.width) + "px";
    //canvas.style.height = Math.floor(viewport.height) + "px";

    //var transform = outputScale !== 1
    //  ? [outputScale, 0, 0, outputScale, 0, 0]
    //  : null;

    //var renderContext = {
    //  canvasContext: context,
    //  transform: transform,
    //  viewport: viewport
    //};

    //let gg = page.render(renderContext);
    // setThumb(image);
    renderPdf()
  });




  async function renderPdf() {
    const DocBuffer: ArrayBuffer = toArrayBuffer(await window.api.readImage(node.path));
    if (!DocBuffer) return;
    const pdf = await pdfjsLib.getDocument(DocBuffer)
      .promise;
    const pageNumber = 1;
    const page = await pdf.getPage(pageNumber);
    const scale = store.userConfig.pdfScale;
    const viewport = page.getViewport({ scale });
    const canvas = document.getElementById(`pdfContainer_${node.id}`);
    if (!canvas) return;
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    //@ts-ignore
    page.render(renderContext);
  }

  return (
    <div class="flex flex-col  space-y-2">
      <div class="flex items-center justify-center">
        <canvas class="w-full" id={`pdfContainer_${node.id}`}></canvas>
      </div>
      <div class="flex flex-row p-2 space-x-2">
        <div class="flex items-center justify-center">
          <Svg
            width={40}
            height={40}
            classes=""
            icon_name={"pdf"}
          />
        </div>
        <div class="flex flex-col">
          <div class="text-lg font-extrabold">doc name</div>

          <div class="flex flex-row space-x-2">
            <div class="down_pdf underline cursor-pointer hover:text-primary transition-colors duration-200" >Download</div>
            <div onClick={() => setStore("pdfFile", node.path)} class="open_pdf underline cursor-pointer hover:text-primary transition-colors duration-200" >Open</div>
            <div>11 MB</div>
          </div>
        </div>
      </div>
    </div >
  );
};
