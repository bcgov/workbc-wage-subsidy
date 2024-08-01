import Modal from "react-modal"
import { RouterProvider } from "react-router-dom"
import router from "./router/index"
import "./App.css"

import Layout from "./_layout"

Modal.setAppElement("#root")

const App = () => (
    <Layout>
        <RouterProvider router={router} />
    </Layout>
)

export default App
