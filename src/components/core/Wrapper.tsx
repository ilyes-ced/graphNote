import Controls from "./Controls";
import KeyHandler from "./KeyHandler";
import MiniMap from "./MiniMap";
import Nodes from "./Nodes";
import Pan from "./Pan";
import ViewPort from "./ViewPort";
import Zoom from "./Zoom";

/*
wrapper: control width and height
    keyhandler: keyboard key presses
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
      <KeyHandler>
        <Zoom>
          <Pan>
            <ViewPort>
              <Nodes />
            </ViewPort>
            <MiniMap />
            <Controls />
          </Pan>
        </Zoom>
      </KeyHandler>
    </div>
  );
};
