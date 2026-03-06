import { onMount } from "solid-js";
import { setStore } from "../shared/store.tsx";
import Wrapper from "./core/Wrapper.tsx";
import { readJSON } from "../shared/save.ts";
import { isTauri } from "@tauri-apps/api/core";
import Nodes from "../../nodes.json";


const loadNodes = async () => {


  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")
  fetch("http://localhost:3001/getNodes")
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setStore("nodes", data ?? []);
    });


  // const initStore = await readJSON();
  // if (initStore) {
  //   setStore("nodes", initStore?.nodes ?? []);
  //   setStore("edges", initStore?.edges ?? []);
  // }
};

export default () => {
  onMount(async () => {

    try {
      await loadNodes();
    } catch (error) {
      console.log("error loading nodes:")
      console.log(error)
    }

  });

  return (
    <div id="main" class="relative h-full w-[calc(100%-65px)] overflow-hidden">
      <Wrapper />
    </div>
  );
};
