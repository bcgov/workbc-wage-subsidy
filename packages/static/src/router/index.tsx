import { createBrowserRouter } from "react-router-dom"
import { Root } from "./routes/Root"
import Home from "./routes/Home"
import LogoutSuccess from "./routes/LogoutSuccess"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            { path: "", element: <Home /> },
            { path: "logout-success", element: <LogoutSuccess /> }
        ]
    }
])

export default router
