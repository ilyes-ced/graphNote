import { onMount } from "solid-js";
import Nodes from "./Nodes";
import Background from "./Background";

export default () => {
  onMount(async () => {});

  return (
    <div id="viewport">
      <Background />
      <Nodes />
    </div>
  );
};
