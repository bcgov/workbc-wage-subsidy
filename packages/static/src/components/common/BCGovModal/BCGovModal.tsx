import Box from "@mui/material/Box"
import React, { ReactNode } from "react"
import Modal from "react-modal"
import ModalButton from "../BCGovModalButton/BCGovModalButton"

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "12px",
        maxWidth: "50em"
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)"
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
        {children}
        <Box width="100%" textAlign="right">
            <ModalButton text="OK" showIcon={false} onClick={onRequestClose as () => void} />
        </Box>
    </Modal>
)

export default BCGovModal
