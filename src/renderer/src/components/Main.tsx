import { onMount } from "solid-js";
import { setStore } from "../shared/store.tsx";
import Wrapper from "./core/Wrapper.tsx";


const loadNodes = async () => {


  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")
  console.info("///////////////")

  if (!window.api) {
    throw new Error('window.api is not available — preload did not load correctly');
  } else {
    console.info(window.api)

  }
  try {
    const data = await window.api.getNodes();
    console.log(data);
    setStore("nodes", data ?? []);
  } catch (err) {
    console.error("Failed to get nodes:", err);
  }


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
