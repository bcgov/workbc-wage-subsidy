import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import React, { useCallback } from "react"
import BCGovModal from "../common/BCGovModal/BCGovModal"
import ModalButton from "../common/BCGovModalButton/BCGovModalButton"
import BCGovPrimaryButton from "../common/BCGovPrimaryButton/BCGovPrimaryButton"
import Card from "../common/Card/Card"

const EmployerCard = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false)

    const openModal = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <Card>
            <Grid container direction="column" height="100%">
                <Grid item>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <h2>Are you an Employer?</h2>
                            <Box paddingLeft="0.75em">
                                <p>You will need to log in to Wage Subsidy to access:</p>
                                <ul>
                                    <li>Applications</li>
                                    <li>Claim Forms</li>
                                </ul>
                                <p>
                                    You can log in with either a <strong>Basic BCeID</strong> or a{" "}
                                    <strong>Business BCeID</strong>
                                </p>
                                <ModalButton text="More info on BCeID" showIcon onClick={openModal} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" height="100%" justifyContent="center" alignItems="center">
                                <img width="250em" src="/employer.svg" alt="Employer logo" />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <Box display="flex" height="100%" justifyContent="center" alignItems="end" sx={{ flexGrow: 1 }}>
                        <BCGovPrimaryButton
                            text="Employer Login"
                            onClick={() => window.open("https://wage-sub-dev-employer.es.workbc.ca")}
                        />
                    </Box>
                </Grid>
            </Grid>
            <BCGovModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Find out more about the WorkBC Wage Subsidy"
            >
                <h2>BCeID Options</h2>
                <h3>Business BCeID</h3>
                <p>
                    Use a{" "}
                    <a href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx">
                        Business BCeID
                    </a>{" "}
                    if you would like to view and <strong>share applications</strong> and
                    <strong> claim forms within your organization.</strong>
                </p>
                <p>
                    Note that if you are starting a new Business BCeID registration, it can take some time to verify
                    your business if it is not already registered with{" "}
                    <a href="https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/citizens-services/bc-registries-online-services">
                        BC Registries and Online Services
                    </a>
                    .
                </p>
                <p>
                    Note also that you can <strong>convert</strong> a <strong>Basic BCeID</strong> to a
                    <strong> Business BCeID.</strong> If time is an issue and you don&apos;t already have a Business
                    BCeID, set up a Basic BCeID now and convert it later.
                </p>
                <p>
                    If your organization already has a Business BCeID account, talk to your account administrator to
                    ensure you have a user account under the organization&apos;s overall account. Once you have this
                    user account set up, use this to log in to Wage Subsidy.
                </p>
                <h3>Basic BCeID</h3>
                <p>
                    With a{" "}
                    <a href="https://www.bceid.ca/register/basic/account_details.aspx?type=regular&eServiceType=basic">
                        Basic BCeID
                    </a>
                    , you will be able to log in to Wage Subsidy to submit and view your own applications and claim
                    forms.
                </p>
                <p>
                    Note that you will <strong>not</strong> be able to share applications and claim forms with others if
                    you are using a Basic BCeID; only Business BCeID users will be able to share these forms with those
                    within their own organization.
                </p>
                <p>
                    For <a href="https://www.bceid.ca/">more information</a> and{" "}
                    <a href="https://www.bceid.ca/aboutbceid/faqs.aspx">Frequently Asked Questions</a>, visit{" "}
                    <a href="https://www.bceid.ca/">www.bceid.ca</a>
                </p>
            </BCGovModal>
        </Card>
    )
}

export default EmployerCard
