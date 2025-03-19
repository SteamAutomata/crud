import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useRoutes } from "react-router";

import "./style.css";

import routes from "~react-pages";
import MainLayout from "./MainLayout";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <MainLayout>{useRoutes(routes)}</MainLayout>
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
