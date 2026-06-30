import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./demo/demo-theme.css";
import { isDemoMode } from "./lib/demo";

if (isDemoMode) {
  document.documentElement.dataset.theme = "demo";
  document.title = "Made You Blush · Theme demo";
}

createRoot(document.getElementById("root")!).render(<App />);
