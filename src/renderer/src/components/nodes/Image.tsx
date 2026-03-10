import { onMount, createSignal } from "solid-js";
import { Image } from "../../types";

type ImageProps = Image & {
  is_child?: boolean;
};

export default (node: ImageProps) => {
  const [imgSrc, setImgSrc] = createSignal("");


  const uint8ArrayToDataUrl = async (bytes: Uint8Array, mime = "image/png") => {
    const blob = new Blob([bytes], { type: mime });
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };


  const readImage = async (imgPath: string): Promise<string> => {
    try {
      const bytes = await window.api.readImage(imgPath);
      const ext = imgPath.split('.').pop()?.toLowerCase() || 'png';
      const mime = `image/${ext}`;
      const dataUrl = await uint8ArrayToDataUrl(bytes, mime);
      return dataUrl
    } catch (err) {
      console.error("Failed to read image:", err);
      return "";
    }
  };

  onMount(async () => {
    try {
      setImgSrc(await readImage(node.path));
    } catch (err) {
      setImgSrc(await readImage("placeholder.png"));
    }
  });

  return (
    <div>
      <img style={{ width: "100%" }} src={imgSrc()} alt={node.path} />
    </div>
  );
};
