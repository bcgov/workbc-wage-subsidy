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
                <h2>Wage Subsidy Benefits</h2>
                <Box paddingLeft="1em">
                    <p>Wage Subsidy offers employers:</p>
                    <ul>
                        <li>Reduced cost of hiring and training a new employee</li>
                        <li>Coverage of a portion of employee wages</li>
                        <li>Fill vacant positions</li>
                        <li>Disability supports to reduce work-related barriers for an employee</li>
                    </ul>
                    <p>Wage Subsidy offers job seekers:</p>
                    <ul>
                        <li>Paid work experience opportunities</li>
                        <li>On-the-job training</li>
                        <li>Possible long-term employment options</li>
                    </ul>
                </Box>
            </BCGovModal>
        </div>
    )
}

export default Intro
