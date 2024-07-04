import Box from "@mui/material/Box"
import EmployerCard from "../../components/EmployerCard/EmployerCard"
import Intro from "../../components/Intro/Intro"
import ServiceProviderCard from "../../components/ServiceProviderCard/ServiceProviderCard"
import CardContainer from "../../components/common/CardContainer/CardContainer"

const Home = () => (
    <Box padding="0em 8em">
        <Intro />
        <CardContainer>
            <EmployerCard />
            <ServiceProviderCard />
        </CardContainer>
    </Box>
)

export default Home
