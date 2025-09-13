import { invoke } from "@tauri-apps/api/core";
import { createSignal, onMount, Show } from "solid-js";
import { Url } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type UrlProps = Url & {
  is_child?: boolean;
};

type MetaData = {
  title: string;
  description: string;
  image: string;
  favicon: string;
};

export default (node: UrlProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );
  useDraggableNode(draggableRef, node, node.is_child);

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
      console.log("Received message:", message);
      return message;
    } catch (error) {
      console.error("Error scraping metadata:", error);
      return null;
    }
  };

  onMount(async () => {
    // invoke("scrape_url", {
    //   url: "https://scrape.do/blog/web-scraping-in-rust/",
    // }).then((message) => {
    //   console.log("rcieved messgs");
    //   console.log(message);
    // });
    // invoke("scrape_url", {
    //   url: "https://www.rayon.design/",
    // }).then((message) => {
    //   console.log("rcieved messgs");
    //   console.log(message);
    // });

    setTimeout(async () => {
      const res = await getMetaData(node.url);

      if (res) {
        setMetaData(res);
      }
    }, 0);
  });

  return (
    <div
      ref={setDraggableRef}
      class="url"
      classList={{
        "child_node w-full": node.is_child,
        node: !node.is_child,
      }}
      id={node.id}
      style={{
        width: node.is_child ? "100%" : node.width + "px",
        background: node.color ? node.color : "var(--default-bg-color)",
        "z-index": node.zIndex,
      }}
    >
      <Show when={node.top_strip_color}>
        <div
          class="top_strip"
          style={{ background: node.top_strip_color }}
        ></div>
      </Show>

      <div class="space-y-2">
        <img class="url_thumbnail" src={metaData().image} alt="" />

        <div class="text_container px-4 overflow-hidden text-ellipsis">
          <div class="url_container flex items-center space-x-2">
            <img
              class="url_thumbnail size-2"
              src={metaData().favicon}
              alt="favicon"
            />

            <a class="url text-xs  font-bold text-accent" href={node.url}>
              {node.url}
            </a>
          </div>
          <a class="underline text-blue-800 font-extrabold" href={node.url}>
            {metaData().title}
          </a>
          <div class="url_description text-xs">{metaData().description}</div>
        </div>
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
