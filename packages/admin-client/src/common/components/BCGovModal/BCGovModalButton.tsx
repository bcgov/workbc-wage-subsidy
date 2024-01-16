import React from "react"
import { Button } from "@mui/material"

interface ModalButtonProps {
    text: string
    showIcon: boolean
    onClick: (event: any) => void
    ariaLabel?: string
    ariaHasPopup?: boolean | "dialog" | "menu" | "grid" | "true" | "false" | "listbox" | "tree"
    disabled?: boolean
}

const ModalButton: React.FC<ModalButtonProps> = ({ text, showIcon, onClick, ariaLabel, ariaHasPopup, disabled }) => {
    let extLinkIcon
    if (showIcon) {
        extLinkIcon = (
            <img
                width="20em"
                src="/external-link-alt-solid.svg"
                alt=""
                style={{ transform: "translate(0.5em, 0.12em)", padding: "0em 1.25em 0em 0em" }}
            />
        )
    } else {
        extLinkIcon = <span />
    }

    return (
        <Button
            onClick={onClick}
            aria-label={ariaLabel}
            aria-haspopup={ariaHasPopup}
            disabled={disabled}
            sx={{
                color: "#307FE2",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontFamily: "'BCSans', 'Noto Sans', Verdana, Arial, sans-serif",
                fontWeight: "400",
                minHeight: "2.75em",
                minWidth: "2.75em",
                padding: "0em 0em 0em 0em",
                "&:hover": {
                    opacity: "0.80",
                    backgroundColor: "transparent"
                }
            }}
        >
            {text}
            {extLinkIcon}
        </Button>
    )
}

ModalButton.defaultProps = {
    ariaLabel: "",
    ariaHasPopup: "false",
    disabled: false
}

export default ModalButton
