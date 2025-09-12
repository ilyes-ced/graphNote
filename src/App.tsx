import "./App.css";
import SideBar from "./components/Sidebar.tsx";
import TopBar from "./components/Topbar.tsx";
import Main from "./components/Main.tsx";
import FloatingDemo from "./components/FloatingDemo.tsx";
import SidebarFloating from "./components/SidebarFloating.tsx";

function App() {
  return (
    <div id="app" class="size-full overflow-hidden">
      <TopBar />
      <div id="center" class="flex flex-row size-full overflow-hidden">
        <Main />
        <SidebarFloating />
      </div>
    </div>
  );
}

export default App;

/*
        <SideBar />


*/
