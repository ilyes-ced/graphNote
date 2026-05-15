import { onMount } from "solid-js";
import ColorSelectMenu from "../ui/ColorSelectMenu";
import Controls from "./Controls";
import Edges from "./Edges";
import EventHandler from "./EventHandler";
// import MiniMap from "./MiniMap";
import Nodes from "./Nodes";
import Pan from "./Pan";
import ViewPort from "./ViewPort";
import Zoom from "./Zoom";
import { setStore, store } from "../../shared/store";


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
              color: edge.color,
              middleLabel: LeaderLine.captionLabel(edge.label, {
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
            <ViewPort>
              <Nodes />
              {/*
              <Edges />
              */}
            </ViewPort>
            {/*
              //? put later when its functional
              <MiniMap />
            */}
            <Controls />
          </Pan>
        </Zoom>
      </EventHandler>
    </div>
  );
};
