import "./App.css"
import TopBar from "./components/Topbar"
import Main from "./components/Main"
import Sidebar from "./components/sidebar/Sidebar"
import NodeViewer from "./components/core/NodeViewer"

function App() {
	return (
		<div id="app" class="size-full overflow-hidden flex flex-col">
			<TopBar />
			<div id="center" class="flex flex-row size-full overflow-hidden">
				<Sidebar />
				<Main />
				<NodeViewer />
			</div>
		</div>
	)
}

export default App
