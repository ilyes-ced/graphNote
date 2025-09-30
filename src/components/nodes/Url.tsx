import { invoke } from "@tauri-apps/api/core";
import { createSignal, onMount, Show } from "solid-js";
import { Url } from "../../types";
import { useDraggable } from "@/shared/nodeDrag";

type UrlProps = Url & {
  is_child?: boolean;
};

type MetaData = {
  title: string;
  description: string;
  image: string;
  favicon: string;
};

//TODO: add cashing system
//TODO: store them Documents/graphnote/cache and search there first if it doesnt exist do scrape_url
export default (node: UrlProps) => {
  const { startDrag } = useDraggable(node, node.is_child);

  const [metaData, setMetaData] = createSignal<MetaData>({
    title: "placeholder",
    description: "placeholder",
    image: "placeholder.png",
    favicon: "placeholder.png",
  });

  const isValidUrl = (url: string): boolean => {
    return true;
  };

  const isYoutubeUrl = (url: string): boolean => {
    return true;
  };

  let invalidUrlDiv = <div id="invalid_url">The url provided is invalid</div>;

  const getMetaData = async (url: string): Promise<MetaData | null> => {
    try {
      const message = await invoke<MetaData>("scrape_url", { url });
      // console.log("Received message:", message);
      return message;
    } catch (error) {
      console.error("Error scraping metadata:", error);
      return null;
    }
  };

  onMount(() => {
    // Defer to next microtask to avoid blocking render
    queueMicrotask(() => {
      getMetaData(node.url).then((res) => {
        if (res) {
          setMetaData(res);
        }
      });
    });
  });

  return (
    <div class="space-y-2">
      <img class="url_thumbnail" src={metaData().image} alt="" />

      <div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis">
        <div class="url_container flex flex-row items-center space-x-2">
          <img
            class="url_thumbnail size-4"
            src={metaData().favicon}
            alt="favicon"
          />
          <div>
            <a class="url text-xs font-bold text-accent" href={node.url}>
              {node.url}
            </a>
          </div>
        </div>

        <div>
          <a class="underline text-primary font-extrabold" href={node.url}>
            {metaData().title}
          </a>
        </div>

        <div class="url_description text-xs">{metaData().description}</div>
      </div>
    </div>
  );
};

/*
      also check if url is for example a vedio fromn youtube to be able to watch
      it also check if its a valid url if a new note is created and its nothing
      but an url it should be transformed to an Url Node also in case there no
      connection div
      
      here thumbnail and url and a descriptiopn

*/
