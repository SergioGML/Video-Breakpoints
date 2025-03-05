import React from "react";
import ReactDOM from "react-dom/client";
import { HomeProvider } from "./context/HomeContext";
import Home from "./pages/Home";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HomeProvider>
      <Home />
    </HomeProvider>
  </React.StrictMode>
);


