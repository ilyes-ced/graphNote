import { createResource, createSignal, onMount, Show } from "solid-js";
import { Url } from "../../types";
import { useDraggableNode } from "../../shared/useDraggableNode";

type UrlProps = Url & {
  is_child?: boolean;
};

export default (node: UrlProps) => {
  const [draggableRef, setDraggableRef] = createSignal<HTMLElement | null>(
    null
  );

  useDraggableNode(draggableRef, node, node.is_child);

  const isValidUrl = (url: string): boolean => {
    return true;
  };

  const isYoutubeUrl = (url: string): boolean => {
    return true;
  };

  let invalidUrlDiv = <div id="invalid_url">The url provided is invalid</div>;

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
      <div class="url_thumbnail">{node.url}</div>
      also check if url is for example a vedio fromn youtube to be able to watch
      it also check if its a valid url if a new note is created and its nothing
      but an url it should be transformed to an Url Node also in case there no
      connection div
      <div class="url_text">{node.url}</div>
      <Show when={isValidUrl(node.url)} fallback={invalidUrlDiv}>
        here thumbnail and url and a descriptiopn
      </Show>
    </div>
  );
};
