import { Show, createEffect, createSignal, onMount } from "solid-js";
import ColorSelectMenu from "../ui/ColorSelectMenu";
import Controls from "./Controls";
import EventHandler from "./EventHandler";
import Nodes from "./Nodes";
import Pan from "./Pan";
import ViewPort from "./ViewPort";
import Zoom from "./Zoom";
import { setStore, store } from "../../shared/store";
import { updateArrowsPositions } from "../../shared/utils";
import MiniMap from "./MiniMap";


/*
wrapper: control width and height
    EventHandler: keyboard key presses
        Zoom
            pan
                viewport
                    nodes
                    edges
                    .....
*/

export default () => {
  const [wrapperRef, setWrapperRef] = createSignal(null);

  createEffect(() => {
    console.log(store.viewport.scale)
    console.log(store.viewport.x)
    console.log(store.viewport.y)
    console.log(store.viewport.width)
    console.log(store.viewport.height)
    updateArrowsPositions()
  });

  onMount(() => {
    setTimeout(() => {



      Object.entries(store.edges).forEach(([nodeId, edges]) => {
        //TODO: maybe later do this only for the active board and, and make it a functiona that is called each time a board is changed
        edges.forEach((edge) => {
          //@ts-ignore //? because its loaded in the index as a .min.js file
          const ourLine = new LeaderLine(
            document.getElementById(edge.srcNodeId),
            document.getElementById(edge.distNodeId),
            {
              container: document.querySelector("#viewport-content"),
              color: edge.color,
              middleLabel: LeaderLine.captionLabel(LeaderLine.captionLabel(edge.label, { color: 'red' }), {
                color: edge.color,
                outlineColor: ''
              }),
              path: edge.type
            }
          );

          setStore("arrowLines", (prev) => {
            const next = new Map(prev);
            next.set(
              edge.srcNodeId,
              [...(next.get(edge.srcNodeId) || []), ourLine]
            );
            return next;
          });
          setStore("arrowLines", (prev) => {
            const next = new Map(prev);
            next.set(
              edge.distNodeId,
              [...(next.get(edge.distNodeId) || []), ourLine]
            );
            return next;
          });
        })
      });
    }, 2000)
  })


  // wrapper width and lenght are defined in the store
  return (
    <div id="wrapper">
      <ColorSelectMenu />
      <EventHandler>
        <Zoom>
          <Pan>
            <ViewPort wrapperRef={setWrapperRef} >
              <Nodes />
              <div id="edges"></div>
              {/*
              <Edges />
              */}
            </ViewPort>
            <Show when={store.userConfig.showMiniMap}>
              <MiniMap wrapperRef={() => wrapperRef} />
            </Show>
            {/*
              //? put later when its functional
            */}
            <Controls />
          </Pan>
        </Zoom>
      </EventHandler>
    </div>
  );
};
