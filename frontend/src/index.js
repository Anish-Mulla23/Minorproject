import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client for createRoot
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

// Use createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
