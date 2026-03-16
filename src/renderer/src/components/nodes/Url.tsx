import { createSignal, onMount } from "solid-js";
import { Url } from "../../types";
import { IconLink, IconPlayerPlayFilled } from "@tabler/icons-solidjs";
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
  const [isPlaying, setIsPlaying] = createSignal(false);

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
          console.log(res)
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
  function getYouTubeVideoId(url: string) {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
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
          <input type="text" placeholder="input your URL here" class="url_input p-5 size-full outline-0 border"
            onBlur={transformUrl}
            onKeyDown={(e) => {
              if (e.key === "Enter") transformUrl(e);
            }} />
        </div>
      ) : (
        <div>

          {matchYoutubeUrl(node.url) && isPlaying() ? (
            <div style={{
              position: 'relative',
              width: '100%',
              "padding-bottom": '56.25%' /* 16:9 aspect ratio = 9 / 16 * 100 */
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(node.url)}?autoplay=1`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          ) : (
            <div class="relative flex items-center justify-center">
              {
                matchYoutubeUrl(node.url) && <div class="size-10 rounded-full bg-black border-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center" onClick={() => setIsPlaying(true)}>
                  <IconPlayerPlayFilled />
                </div>}
              <img
                class="wait_load url_thumbnail pointer-events-none"
                src={metaData().image}
                loading="eager"
                alt=""
              />
            </div>
          )}


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
