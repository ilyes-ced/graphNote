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

  function matchYoutubeUrl(url: string): boolean {
    const pattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  }
  function getYouTubeEmbedUrl(url: string): string | null {
    const match = url.match(
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

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
      {matchYoutubeUrl(node.url) ? (
        <div>
          <iframe
            width="100%"
            src={getYouTubeEmbedUrl(node.url) ?? ""}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />{" "}
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            allowfullscreen
          ></iframe>
        </div>
      ) : (
        <div>
          <img
            class="url_thumbnail pointer-events-none"
            src={metaData().image}
            alt=""
          />
        </div>
      )}

      <div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis">
        <div class="url_container flex flex-row items-center space-x-2">
          <img
            class="url_thumbnail size-4"
            src={metaData().favicon}
            alt="favicon"
          />
          <div>
            <a class="url text-xs font-bold text-foreground" href={node.url}>
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
