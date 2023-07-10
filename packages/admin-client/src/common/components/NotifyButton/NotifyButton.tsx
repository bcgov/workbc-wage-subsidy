import React, { MouseEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/pro-solid-svg-icons"
import "./NotifyButton.css"

interface NotifyButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const NotifyButton: React.FC<NotifyButtonProps> = ({ onClick }) => (
    <button className="notify-button" type="button" onClick={onClick}>
        <FontAwesomeIcon icon={faFlag} size="lg" style={{ marginRight: 12 }} scale="2" />
        NOTIFY
    </button>
)

export default NotifyButton
