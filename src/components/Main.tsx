import { onMount } from "solid-js";
import { setStore, store } from "./store";
import Wrapper from "./core/Wrapper.tsx";
import { readJSON } from "@/shared/save.ts";

const loadNodes = async () => {
  const initStore = await readJSON();

  console.info("store init in main.tsx");
  console.info(initStore);

  if (initStore) {
    setStore("nodes", initStore?.nodes ?? []);
    setStore("edges", initStore?.edges ?? []);
  }
};

export default () => {
  onMount(async () => {
    await loadNodes();
  });

  return (
    <div id="main" class="relative h-full w-[calc(100%-65px)] overflow-hidden">
      <Wrapper />
    </div>
  );
};
