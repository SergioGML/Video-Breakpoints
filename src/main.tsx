import React from "react";
import ReactDOM from "react-dom/client";
import { HomeProvider } from "./context/AppContext";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <HomeProvider>
      <App />
    </HomeProvider>
  </React.StrictMode>
);


