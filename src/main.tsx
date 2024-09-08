import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
);
