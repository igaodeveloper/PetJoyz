import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const basename = import.meta.env.BASE_URL;

function Root() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <App key={location.pathname} />
    </AnimatePresence>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Root />
    </BrowserRouter>
  </React.StrictMode>,
);
