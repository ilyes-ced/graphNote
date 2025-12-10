import { onMount, createSignal } from "solid-js";
import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Image } from "../../types";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const [imgSrc, setImgSrc] = createSignal("");

  const readImage = async (imgPath: string): Promise<string> => {
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
      setImgSrc(
        `data:image/png;base64,${await readImage(`GraphNote/${node.path}`)}`
      );
    } catch (err) {
      console.error("Failed to load image:", err);
      setImgSrc(
        `data:image/png;base64,${await readImage("GraphNote/placeholder.png")}`
      );
    }
  });

  return (
    <div>
      <img style={{ width: "100%" }} src={imgSrc()} alt={node.path} />
    </div>
  );
};
