import ColorSelectMenu from "../ui/ColorSelectMenu";
import Controls from "./Controls";
import Edges from "./Edges";
import EventHandler from "./EventHandler";
import MiniMap from "./MiniMap";
import Nodes from "./Nodes";
import Pan from "./Pan";
import ViewPort from "./ViewPort";
import Zoom from "./Zoom";

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
  // wrapper width and lenght are defined in the store
  return (
    <div id="wrapper">
      <ColorSelectMenu />
      <EventHandler>
        <Zoom>
          <Pan>
            <ViewPort>
              <Nodes />
              {/* <Edges /> */}
            </ViewPort>
            <MiniMap />
            <Controls />
          </Pan>
        </Zoom>
      </EventHandler>
    </div>
  );
};
