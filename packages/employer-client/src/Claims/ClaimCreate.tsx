import { useEffect } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { useGetList, useRedirect } from "react-admin"
import BCGovPrimaryButton from "../common/components/BCGovPrimaryButton/BCGovPrimaryButton"
import Card from "../common/components/Card/Card"
import { useSearchParams } from "react-router-dom"

export const ClaimCreate = () => {
    const redirect = useRedirect()
    const { total, isLoading } = useGetList("claims", { pagination: { page: 1, perPage: 1 } })
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (searchParams.get("redirectType") === "firstload" && typeof total === "number" && total !== 0) {
            redirect("list", "claims")
        }
    }, [isLoading, redirect, searchParams, total])

    return (
        <Box paddingTop="6em" paddingBottom="3em" width="100%" display="flex" justifyContent="center" minWidth="58em">
            <Card>
                <Grid container direction="column" height="100%" spacing={4}>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={7}>
                                <h2>Submit a Claim for Wage Subsidy</h2>
                                <Box paddingLeft="0.75em">
                                    <p>
                                        In order to receive your wage subsidy reimbursement, you must{<br />}
                                        submit a claim form which is associated to a previously{<br />}
                                        completed application
                                    </p>
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <Box display="flex" height="100%" justifyContent="center" alignItems="center">
                                    <img
                                        width="200em"
                                        src="/employer-claim-form.svg"
                                        alt=""
                                        style={{ transform: "translate(-1.0em, 2.0em)" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Box display="flex" height="100%" justifyContent="center" alignItems="end" sx={{ flexGrow: 1 }}>
                            <BCGovPrimaryButton
                                text="Submit a Claim Form"
                                onClick={() => redirect("SelectApplication", "claims")}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    )
}
