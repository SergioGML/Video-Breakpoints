import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import { HomeProvider } from "./context/HomeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomeProvider>
      <App />
    </HomeProvider>
  </StrictMode>,
);
