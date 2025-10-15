import { onMount, createSignal } from "solid-js";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Image } from "../../types";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const [imgSrc, setImgSrc] = createSignal("");

  onMount(async () => {
    try {
      const bytes = await readFile(node.path, {
        baseDir: BaseDirectory.Document,
      });

      const base64 = btoa(
        Array.from(bytes)
          .map((b) => String.fromCharCode(b))
          .join("")
      );

      setImgSrc(`data:image/png;base64,${base64}`);
    } catch (err) {
      console.error("Failed to load image:", err);
      setImgSrc("https://placehold.net/800x600.png");
    }
  });

  return (
    <div>
      <img style={{ width: "100%" }} src={imgSrc()} alt={node.path} />
    </div>
  );
};
