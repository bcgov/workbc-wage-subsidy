import "./App.css"
import CardContainer from "./components/common/CardContainer/CardContainer"
import EmployerCard from "./components/EmployerCard"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Intro from "./components/Intro/Intro"
import ServiceProviderCard from "./components/ServiceProviderCard"

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
