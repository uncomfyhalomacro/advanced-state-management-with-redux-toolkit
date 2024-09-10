import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";
import { fetchTodos } from "./services/todosSlice.ts";

// Prefetch your data starts here
store.dispatch(fetchTodos());

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
);
