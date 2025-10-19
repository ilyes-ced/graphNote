import { createSignal, Match, onMount, Switch } from "solid-js";
import { Document } from "../../types";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";

type DocumentProps = Document & {
  is_child?: boolean;
};

export default (node: DocumentProps) => {
  const [pdfSrc, setPdfSrc] = createSignal("");
  function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000; // 32 KB chunk size

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }

    return btoa(binary);
  }

  onMount(async () => {
    try {
      const bytes = await readFile(node.path, {
        baseDir: BaseDirectory.Document,
      });

      const base64 = bytesToBase64(new Uint8Array(bytes));
      const dataUrl = `data:application/pdf;base64,${base64}`;
      setPdfSrc(dataUrl);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      setPdfSrc("");
    }
  });

  return (
    <div>
      <Switch fallback={<div>Not Found</div>}>
        <Match when={node.docType === "widget"}>
          <div>
            <PDFViewerComponent pdfFilePath={node.path} />
          </div>
        </Match>
        <Match when={node.docType === "card"}>test1</Match>
        <Match when={node.docType === "reader"}>
          <div>
            <div>
              {pdfSrc() ? (
                <object
                  data={pdfSrc()}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                >
                  <div>No PDF viewer available</div>
                </object>
              ) : (
                <div>Loading PDF...</div>
              )}
            </div>
            <div>{node.path.split("/")[1]}</div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};
