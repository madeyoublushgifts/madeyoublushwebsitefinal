import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./demo/demo-theme.css";
import { isDemoMode } from "./lib/demo";

const CHUNK_RELOAD_KEY = "myb-chunk-reload";

function installChunkReloadRecovery() {
  const reloadOnce = () => {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
    window.location.reload();
  };

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadOnce();
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      typeof reason === "string"
        ? reason
        : reason instanceof Error
          ? reason.message
          : "";

    if (
      /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed/i.test(
        message,
      )
    ) {
      event.preventDefault();
      reloadOnce();
    }
  });
}

installChunkReloadRecovery();

if (isDemoMode) {
  document.documentElement.dataset.theme = "demo";
  document.title = "Made You Blush · Theme demo";
}

createRoot(document.getElementById("root")!).render(<App />);
