import { onMount, createSignal } from "solid-js";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Image } from "../../types";
import { documentDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const [imgSrc, setImgSrc] = createSignal("");

  const readImage = async (imgPath: string): Promise<string> => {
    console.info("loading image with the url:", imgPath);
    const bytes = await readFile(imgPath, {
      baseDir: BaseDirectory.Document,
    });

    const base64 = btoa(
      Array.from(bytes)
        .map((b) => String.fromCharCode(b))
        .join("")
    );

    return base64;
  };

  onMount(async () => {
    try {
      //?  causes plugin:fs|read_file with 240-180 ms of latency
      setImgSrc(
        `data:image/png;base64,${await readImage(`GraphNote/${node.path}`)}`
      );
      //?  causes plugin:path|resolve_directoryreadfile with 270-210 ms of latency
      //const fullPath = await join(await documentDir(), "GraphNote", node.path);
      //console.log("--------------------------------", fullPath);
      //setImgSrc(convertFileSrc(fullPath));
    } catch (err) {
      //console.error("Failed to load image:", err);
      setImgSrc(
        `data:image/png;base64,${await readImage("GraphNote/placeholder.png")}`
      );
      console.error("Failed to load image:", err);
      //const fullPath = await join(
      //  await documentDir(),
      //  "GraphNote/placeholder.png"
      //);
      //console.log("--------------------------------", fullPath);
      //setImgSrc(convertFileSrc(fullPath));
    }
  });

  return (
    <div>
      <img style={{ width: "100%" }} src={imgSrc()} alt={node.path} />
    </div>
  );
};
