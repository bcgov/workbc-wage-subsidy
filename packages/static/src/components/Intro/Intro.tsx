import Box from "@mui/material/Box"
import React, { useCallback } from "react"
import BCGovModal from "../common/BCGovModal/BCGovModal"
import ModalButton from "../common/BCGovModalButton/BCGovModalButton"
import "./Intro.css"

const Intro = () => {
    const [modalIsOpen, setIsOpen] = React.useState(false)

    const openModal = useCallback(() => {
        setIsOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <div className="intro">
            <h1>WorkBC Wage Subsidy</h1>
            <p>
                The WorkBC Wage Subsidy program provides funding to eligible employers to hire, provide work experience
                and on-the-job training to unemployed British Columbians.
            </p>
            <ModalButton text="Find out more" showIcon onClick={openModal} ariaHasPopup="dialog" />
            <BCGovModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="More information about the WorkBC Wage Subsidy"
            >
                <h2>Wage Subsidy Benefits for Employers</h2>
                <Box paddingLeft="1em">
                    <p>Wage Subsidy offers employers:</p>
                    <ul>
                        <li>A portion of employee wages</li>
                        <li>Support for ongoing operations and expansion</li>
                        <li>Disability supports to reduce work-related barriers for an employee</li>
                        <li>An opportunity to:</li>
                        <ul>
                            <li>Re-hire laid off employees</li>
                            <li>Hire new employees</li>
                            <li>Better connect job seekers and employers to meet hiring needs</li>
                        </ul>
                        <li>Job Seeker Eligibility: All residents of B.C. who are not employed at all</li>
                    </ul>
                </Box>
            </BCGovModal>
        </div>
    )
}

export default Intro
