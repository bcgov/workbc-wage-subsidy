import React from "react"
import "./BCGovModalButton.css"

interface ModalButtonProps {
    text: string
    showIcon: boolean
    onClick: () => void
}

const ModalButton: React.FC<ModalButtonProps> = ({ text, showIcon, onClick }) => {
    let extLinkIcon
    if (showIcon) {
        extLinkIcon = (
            <img
                width="20em"
                src="/external-link-alt-solid.svg"
                alt="Information popout link icon"
                style={{ transform: "translate(0.5em, 0.12em)" }}
            />
        )
    } else {
        extLinkIcon = <span />
    }

    return (
        <button className="bc-gov-modal-button" type="button" onClick={onClick}>
            {text}
            {extLinkIcon}
        </button>
    )
}

export default ModalButton
