import React, { ReactNode } from "react"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

const Layout = ({ children }: { children: ReactNode }) => (
    <div className="App">
        <Header />
        {children}
        <Footer />
    </div>
)

export default Layout
