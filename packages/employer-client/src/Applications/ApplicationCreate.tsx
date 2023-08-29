import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { useRedirect } from "react-admin"
import BCGovPrimaryButton from "../common/components/BCGovPrimaryButton/BCGovPrimaryButton"
import Card from "../common/components/Card/Card"

export const ApplicationCreate = () => {
    const redirect = useRedirect()

    const handleClick = (formType) => {
        redirect(`/ViewForm`, "")
    }

    return (
        <Box paddingTop="6em" paddingBottom="3em" width="100%" display="flex" justifyContent="center" minWidth="58em">
            <Card>
                <Grid container direction="column" height="100%" spacing={4}>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={7}>
                                <h2>Let's get started</h2>
                                <Box paddingLeft="0.75em">
                                    <p>
                                        In order to submit an application for Wage Subsidy, you will need{<br />}
                                        the following information:
                                    </p>
                                    <ul>
                                        <li>Your CRA Business Number</li>
                                        <li>Your employee's e-mail address (if you{<br />}have an employee)</li>
                                    </ul>
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <Box display="flex" height="100%" justifyContent="center" alignItems="center">
                                    <img
                                        width="90em"
                                        src="/employer-application.svg"
                                        alt=""
                                        style={{ transform: "translate(-1.0em, 1.0em)" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" height="100%" justifyContent="center" alignItems="end" sx={{ flexGrow: 1 }}>
                            <Grid container direction="row" spacing={7}>
                                <Grid item xs={6}>
                                    <Box display="flex" justifyContent="right">
                                        <BCGovPrimaryButton
                                            text="I Have an Employee"
                                            onClick={() => handleClick("HaveEmployee")}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box display="flex" justifyContent="left">
                                        <BCGovPrimaryButton
                                            text="I Need an Employee"
                                            onClick={() => handleClick("NeedEmployee")}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    )
}
