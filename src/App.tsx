import "./App.css";
import SideBar from "./components/Sidebar.tsx";
import TopBar from "./components/Topbar.tsx";
import Main from "./components/Main.tsx";

function App() {
  return (
    <div id="app">
      <TopBar />
      <div
        id="center"
        style={{
          overflow: "hidden",
        }}
      >
        <SideBar />
        <Main />
      </div>
    </div>
  );
}

export default App;
