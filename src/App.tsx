import "./App.css";
import SideBar from "./components/Sidebar.tsx";
import TopBar from "./components/Topbar.tsx";
import Main from "./components/Main.tsx";

function App() {
  return (
    <div id="app" class="size-full">
      <TopBar />
      <div id="center" class="flex flex-row w-full h-[calc(100%-50px)]">
        <Main />
        <SideBar />
      </div>
    </div>
  );
}

export default App;

/*


*/
