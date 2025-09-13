import "./App.css";
import SideBar from "./components/Sidebar.tsx";
import TopBar from "./components/Topbar.tsx";
import Main from "./components/Main.tsx";
import FloatingDemo from "./components/FloatingDemo.tsx";
import Sidebar from "./components/Sidebar.tsx";

function App() {
  return (
    <div id="app" class="size-full overflow-hidden flex flex-col">
      <TopBar />
      <div id="center" class="flex flex-row size-full overflow-hidden">
        <Sidebar />
        <Main />
      </div>
    </div>
  );
}

export default App;

/*
        <SideBar />


*/
