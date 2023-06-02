import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import React, { useCallback } from "react"
import Modal from "react-modal"
import Card from "./common/Card/Card"

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
}

const EmployerCard = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false)

    const openModal = useCallback(() => {
        setIsOpen(true)
    }, [])

    const afterOpenModal = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <Card>
            <Grid container direction="column">
                <Grid item>
                    <Grid container direction="row">
                        <Grid item xs={6}>
                            <h2>Are you an Employer?</h2>
                            <p>You will need to log in to Wage Subsidy to access:</p>
                            <ul>
                                <li>Applications</li>
                                <li>Claim Forms</li>
                            </ul>
                            <p>
                                You can log in with either a <strong>Basic BCeID</strong> or a{" "}
                                <strong>Business BCeID</strong>
                            </p>
                            <button type="button" onClick={openModal}>
                                More info on BCeID
                            </button>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" justifyContent="center">
                                <img width="250px" src="/employer.svg" alt="Employer logo" />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <button
                        className="BC-Gov-PrimaryButton"
                        type="button"
                        onClick={() => window.open("https://wage-sub-dev-employer.es.workbc.ca")}
                    >
                        Employer Login
                    </button>
                </Grid>
            </Grid>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={modalStyles}
                contentLabel="Find out more about the WorkBC Wage Subsidy"
            >
                <h2>BCeID Options</h2>
                <h3>Business BCeID</h3>
                <p>
                    Use a Business BCeID if you would like to view and <strong>share applications</strong> and
                    <strong> claim forms within your organization.</strong>
                </p>
                <p>
                    Note that if you are starting a new Business BCeID registration, it can take some time to verify
                    your business if it is not already registered with BC Registries and Online Services.
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
                    With a Basic BCeID, you will be able to log in to Wage Subsidy to submit and view your own
                    applications and claim forms.
                </p>
                <p>
                    Note that you will <strong>not</strong> be able to share applications and claim forms with others if
                    you are using a Basic BCeID; only Business BCeID users will be able to share these forms with those
                    within their own organization.
                </p>
                <p>For more information and Frequently Asked Questions, visit www.bceid.ca</p>
                <button className="right-align-button" type="button" onClick={closeModal}>
                    OK
                </button>
            </Modal>
        </Card>
    )
}

export default EmployerCard
