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

/*


.board {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.board.child_node {
  flex-direction: row;
  justify-content: start;
  padding: 5px;
  padding-left: 10px;
}

.board_icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.board_text {
  margin-top: 10px;
  margin-bottom: 5px;
}
.board_text_child {
  align-self: flex-start;
  margin-bottom: 5px;
}

.board_content {
  color: grey;
}
.board_content_child {
  color: grey;
  align-self: flex-start;
}

.text_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


*/
