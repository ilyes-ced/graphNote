import { createSignal, onMount } from "solid-js";
import { Url } from "../../types";
import EditableTitle from "./EditableTitle";
import { IconLink } from "@tabler/icons-solidjs";
import { updateURL } from "../../shared/update";

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

  const getMetaData = async (url: string): Promise<MetaData | null> => {
    try {
      //const message = await invoke<MetaData>("scrape_url", { url });
      const message = await window.api.scrapeUrl(url);
      // console.log("Received message:", message);
      return message;
    } catch (error) {
      console.error("Error scraping metadata:", error);
      return null;
    }
  };

  // const [downloadedPath, setDownloadedPath] = createSignal<string | null>(null);
  // const [progress, setProgress] = createSignal<number>(0);
  // const [loading, setLoading] = createSignal(false);

  //onMount(() => {
  //  queueMicrotask(async () => {
  //    const url = node.url;
  //
  //    // First, check or download
  //    // if (matchYoutubeUrl(node.url)) {
  //    //   setLoading(true);
  //    //   try {
  //    //     const path = await invoke<string>("download_youtube", { url });
  //    //     setDownloadedPath(convertFileSrc(path));
  //    //   } catch (e) {
  //    //     console.error("Download failed", e);
  //    //   } finally {
  //    //     setLoading(false);
  //    //   }
  //    // }
  //
  //    // Then fetch metadata
  //    const meta = await getMetaData(url);
  //    if (meta) setMetaData(meta);
  //  });
  //});

  const fetchMetaData = () => {
    // Defer to next microtask to avoid blocking render
    queueMicrotask(() => {
      getMetaData(node.url).then((res) => {
        if (res) {
          setMetaData(res);
        }
      });
    });
  }

  onMount(() => {
    fetchMetaData()
  });

  const transformUrl = (e: any) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    try {
      new URL(value);
      //? disable inout on seccfull URL to avoid it double firing once we press enter than unfocus the input 
      input.disabled = true;
      updateURL(node.id, value)
      fetchMetaData()
    } catch {
      console.log("invalid url format")
      input.value = ""
      input.placeholder = "invalid URL, try again"
    }
  }


  //? "wait_load" class name is needed for elements that take time to load the assets like url images
  return (
    <div class="space-y-2">
      {/*
      {matchYoutubeUrl(node.url) ? (
        <div>
          {downloadedPath()}
          {loading() && <div>Downloading... {progress()}%</div>}
          {!loading() && downloadedPath() && (
            <video controls width="100%" src={downloadedPath()!} />
          )}
        </div>
      ) : (
        <div>
          <img
            class="url_thumbnail pointer-events-none"
            src={metaData().image}
            loading="lazy"
            alt=""
          />
        </div>
      )}
 */}
      {node.url === "" ? (
        <div class="flex items-center space-x-2 px-5" >
          <IconLink />
          <input type="text" placeholder="input your URL here" class="url_input p-5 size-full outline-0"
            onBlur={transformUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") transformUrl(e);
            }} />
        </div>
      ) : (
        <div>
          <div>
            <img
              class="wait_load url_thumbnail pointer-events-none"
              src={metaData().image}
              loading="eager"
              alt=""
            />
          </div>

          <div class="text_container p-4 space-y-2 overflow-hidden text-ellipsis">
            <div class="url_container flex flex-row items-center space-x-2">
              <img
                class="url_thumbnail size-4"
                src={metaData().favicon}
                loading="lazy"
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
          </div></div>
      )}

    </div>
  );
};
