import Background from "./Background";
import KeyHandler from "./KeyHandler";
import Nodes from "./Nodes";
import Pan from "./Pan";
import ViewPort from "./ViewPort";
import Zoom from "./Zoom";
import "./core.css";

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
          </Pan>
        </Zoom>
      </KeyHandler>
    </div>
  );
};
