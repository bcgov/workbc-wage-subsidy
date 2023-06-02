import Modal from "react-modal"
import "./App.css"
import EmployerCard from "./components/EmployerCard"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Intro from "./components/Intro/Intro"
import ServiceProviderCard from "./components/ServiceProviderCard"
import CardContainer from "./components/common/CardContainer/CardContainer"

Modal.setAppElement("#root")

function App() {
    return (
        <div className="App">
            <Header />
            <Intro />
            <CardContainer>
                <EmployerCard />
                <ServiceProviderCard />
            </CardContainer>
            <Footer />
        </div>
    )
}

export default App
