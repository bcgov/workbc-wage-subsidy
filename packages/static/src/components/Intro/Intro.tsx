import React, { useCallback } from "react"
import Modal from "react-modal"
import "./Intro.css"

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

const Intro = () => {
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
        <div className="intro">
            <h1>WorkBC Wage Subsidy</h1>
            <p>
                The WorkBC Wage Subsidy program provides funding to eligible employers to hire, provide work experience
                and on-the-job training to unemployed British Columbians.
            </p>
            <button type="button" onClick={openModal}>
                Find out more
            </button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={modalStyles}
                contentLabel="Find out more about the WorkBC Wage Subsidy"
            >
                <h2>Wage Subsidy Benefits for Employers</h2>
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
                <button type="button" onClick={closeModal}>
                    OK
                </button>
            </Modal>
        </div>
    )
}

export default Intro
