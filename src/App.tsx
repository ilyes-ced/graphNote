import "./App.css";
import SideBar from "./components/Sidebar.tsx";
import TopBar from "./components/Topbar.tsx";
import Main from "./components/Main.tsx";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager,
} from "@kobalte/core";

function App() {
  const storageManager = createLocalStorageManager("vite-ui-theme");
  return (
    <div id="app" class="size-full border-1 border-red-950 ">
      <ColorModeScript storageType={storageManager.type} />
      <ColorModeProvider storageManager={storageManager}>
        <TopBar />
        <div id="center" class="flex flex-row w-full h-[calc(100%-50px)]">
          <SideBar />
          <Main />
        </div>
      </ColorModeProvider>
    </div>
  );
}

export default App;
