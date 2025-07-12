import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import ProseMirrorViewer from "./ProseMirrorEditor/ProseMirrorViewer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/view" element={<ProseMirrorViewer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
