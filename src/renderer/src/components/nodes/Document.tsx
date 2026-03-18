import { Match, onMount, Switch } from "solid-js";
import { Document } from "../../types";

type DocumentProps = Document & {
  is_child?: boolean;
};

export default (node: DocumentProps) => {

  onMount(async () => { });

  return (
    <div>
      <Switch fallback={<div>Not Found</div>}>
        <Match when={node.docType === "widget"}>
          <div class="p-5">widget</div>
        </Match>
        <Match when={node.docType === "card"}>test1</Match>
        <Match when={node.docType === "reader"}>
          <div>
            <div>
              PDF document
            </div>
            <div>{node.path.split("/")[1]}</div>
          </div>
        </Match>
      </Switch>
    </div>
  );
};
