import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 5000,
        style: {
          background: "#1F2937",
          color: "#F9FAFB",
          borderRadius: "8px",
          border: "1px solid #374151",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: "#10B981",
            secondary: "#fff",
          },
          style: {
            background: "#065F46",
            border: "1px solid #10B981",
          },
        },
        error: {
          duration: 6000,
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
          style: {
            background: "#7F1D1D",
            border: "1px solid #EF4444",
          },
        },
      }}
    />
    <App />
  </StrictMode>,
);
