import React, { MouseEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/pro-solid-svg-icons"
import { COLOURS } from "../../../Colours"
import "./NotifyButton.css"

interface NotifyButtonProps {
    notificationsOn: boolean
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const NotifyButton: React.FC<NotifyButtonProps> = ({ notificationsOn, onClick }) => {
    return (
        <button
            className="notify-button"
            type="button"
            onClick={onClick}
            style={notificationsOn ? { color: COLOURS.LIGHTBLUE_TEXT } : { color: COLOURS.MEDIUMGREY }}
        >
            <FontAwesomeIcon icon={faFlag} size="lg" style={{ marginRight: 12 }} scale="2" />
            NOTIFY
        </button>
    )
}

export default NotifyButton
