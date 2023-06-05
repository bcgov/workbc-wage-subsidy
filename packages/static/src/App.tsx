import Box from "@mui/material/Box"
import Modal from "react-modal"
import "./App.css"
import EmployerCard from "./components/EmployerCard/EmployerCard"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import Intro from "./components/Intro/Intro"
import ServiceProviderCard from "./components/ServiceProviderCard/ServiceProviderCard"
import CardContainer from "./components/common/CardContainer/CardContainer"

Modal.setAppElement("#root")

function App() {
    return (
        <div className="App">
            <Header />
            <Box padding="0em 8em 0em 8em">
                <Intro />
                <CardContainer>
                    <EmployerCard />
                    <ServiceProviderCard />
                </CardContainer>
            </Box>
            <Footer />
        </div>
    )
}

export default App
