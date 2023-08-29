import Box from "@mui/material/Box"
import React, { ReactNode } from "react"
import Modal from "react-modal"

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "6px",
        maxWidth: "47em",
        boxShadow: "0 0 30px 0 rgb(0 0 0 / 15%)",
        maxHeight: "80%"
    },
    overlay: {
        backgroundColor: "rgba(210, 210, 210, 0.58)",
        zIndex: "4"
    }
}

interface BCGovModalProps {
    isOpen: boolean
    onRequestClose: (event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => void
    contentLabel: string
    children: ReactNode
}

const BCGovModal: React.FC<BCGovModalProps> = ({ isOpen, onRequestClose, contentLabel, children }) => (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles} contentLabel={contentLabel}>
        <Box padding="0em 1em">{children}</Box>
    </Modal>
)

export default BCGovModal
