import React, { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import { Button } from "@mui/material"

const NotifyButton: React.FC = () => {
    // TODO: this variable should correspond to a value persisted in the user's settings.
    const [notificationsOn, setNotificationsOn] = useState(true)
    const [ariaLabel, setAriaLabel] = useState("Turn off notifications")

    const handleClick = (event) => {
        setNotificationsOn(!notificationsOn)
    }

    useEffect(() => {
        setAriaLabel("Turn " + (notificationsOn ? "off" : "on") + " notifications")
    }, [notificationsOn])

    return (
        <Button
            type="button"
            onClick={handleClick}
            sx={{
                color: notificationsOn ? COLOURS.LIGHTBLUE_TEXT : COLOURS.MEDIUMGREY,
                padding: "0.65em 1em",
                marginRight: "2em",
                backgroundColor: "transparent",
                fontSize: "1rem",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" }
            }}
            aria-label={ariaLabel}
        >
            <span aria-hidden={true}>
                <FontAwesomeIcon icon={faFlag} size="lg" style={{ marginRight: 12 }} scale="2" />
                NOTIFY
            </span>
        </Button>
    )
}

export default NotifyButton
