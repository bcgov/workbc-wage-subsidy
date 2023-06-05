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
        borderRadius: "6px",
        maxWidth: "47em",
        boxShadow: "0 0 30px 0 rgb(0 0 0 / 15%)"
    },
    overlay: {
        backgroundColor: "rgba(210, 210, 210, 0.58)"
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
        <Box paddingRight="2.5em">
            {children}
            <Box width="100%" textAlign="right" paddingTop="1em" style={{ transform: "translate(0.8em, 0.0em)" }}>
                <ModalButton text="OK" showIcon={false} onClick={onRequestClose as () => void} />
            </Box>
        </Box>
    </Modal>
)

export default BCGovModal
