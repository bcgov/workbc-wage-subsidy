import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { LoadingIndicator, useCreate, useGetIdentity, useGetList, useRedirect } from "react-admin"
import { v4 as uuidv4 } from "uuid"
import BCGovPrimaryButton from "../common/components/BCGovPrimaryButton/BCGovPrimaryButton"
import Card from "../common/components/Card/Card"
import { useSearchParams } from "react-router-dom"

export const ApplicationCreate = () => {
    const redirect = useRedirect()
    const { identity } = useGetIdentity()
    const [create] = useCreate()
    const [loading, setLoading] = useState(false)
    const { total, isLoading } = useGetList("applications", { pagination: { page: 1, perPage: 1 } })
    const [searchParams] = useSearchParams()

    const handleClick = async (formType) => {
        if (identity?.guid) {
            setLoading(true)
            await create(
                "applications",
                { data: { formKey: uuidv4(), guid: identity?.guid || "", formType: formType } },
                {
                    onSuccess: (data) => {
                        setLoading(false)
                        redirect("/ViewForm/applications/" + data.id, "")
                    },
                    onError: () => {
                        setLoading(false)
                    }
                }
            )
        }
    }

    useEffect(() => {
        if (searchParams.get("redirectType") === "firstload" && typeof total === "number" && total !== 0) {
            redirect("list", "applications")
        }
    }, [isLoading, redirect, searchParams, total])

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
                    {loading && (
                        <Box justifyContent="center" alignSelf="center">
                            <LoadingIndicator />
                        </Box>
                    )}
                    {!loading && (
                        <>
                            <Grid item xs>
                                <Box
                                    display="flex"
                                    height="100%"
                                    justifyContent="center"
                                    alignItems="end"
                                    sx={{ flexGrow: 1 }}
                                >
                                    <Grid container direction="row" spacing={7}>
                                        <Grid item xs={6}>
                                            <Box display="flex" justifyContent="right">
                                                <BCGovPrimaryButton
                                                    text="I Have an Employee"
                                                    onClick={() => handleClick("Have Employee")}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box display="flex" justifyContent="left">
                                                <BCGovPrimaryButton
                                                    text="I Need an Employee"
                                                    onClick={() => handleClick("Need Employee")}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Card>
        </Box>
    )
}
