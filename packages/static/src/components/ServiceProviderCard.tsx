import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Card from "./common/Card/Card"

const ServiceProviderCard = () => (
    <Card>
        <Grid container direction="column">
            <Grid item>
                <h2>Are you a WorkBC Service Provider?</h2>
                <p>If you are a WorkBC Service Provider, log in here</p>
            </Grid>
            <Grid item>
                <Box display="flex" justifyContent="right">
                    <img width="250px" src="/employer.svg" alt="Employer logo" />
                </Box>
            </Grid>
            <Grid item>
                <button
                    className="BC-Gov-PrimaryButton"
                    type="button"
                    onClick={() => window.open("https://wage-sub-dev-sp.es.workbc.ca")}
                >
                    Service Provider Login
                </button>
            </Grid>
        </Grid>
    </Card>
)

export default ServiceProviderCard
