import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import BCGovPrimaryButton from "../common/BCGovPrimaryButton/BCGovPrimaryButton"
import Card from "../common/Card/Card"

const ServiceProviderCard = () => (
    <Card>
        <Grid container direction="column" height="100%">
            <Grid item>
                <h2>Are you a WorkBC Service Provider?</h2>
                <Box paddingLeft="0.75em">
                    <p>If you are a WorkBC Service Provider, log in here</p>
                </Box>
            </Grid>
            <Grid item>
                <Box display="flex" justifyContent="right">
                    <img width="400em" src="/service-provider.svg" alt="Service Provider logo" />
                </Box>
            </Grid>
            <Grid item xs>
                <Box display="flex" height="100%" justifyContent="center" alignItems="end" sx={{ flexGrow: 1 }}>
                    <BCGovPrimaryButton
                        text="Service Provider Login"
                        onClick={() => window.open("https://wage-sub-dev-sp.es.workbc.ca")}
                    />
                </Box>
            </Grid>
        </Grid>
    </Card>
)

export default ServiceProviderCard
