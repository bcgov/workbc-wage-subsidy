import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "@bcgov/bc-sans/css/BCSans.css"

try {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
} catch (err) {
    console.error("App failed to initialize:", err)
    // Optionally show a fallback page
    document.body.innerHTML = `
    <h1 style="text-align:center; margin-top:20%">Something went wrong loading this page.</h1>
  `
}
