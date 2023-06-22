import React, { MouseEvent } from "react"
import "./BCGovPrimaryButton.css"

interface BCGovPrimaryButtonProps {
    text: string
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

const BCGovPrimaryButton: React.FC<BCGovPrimaryButtonProps> = ({ text, onClick }) => (
    <button className="BC-Gov-PrimaryButton" type="button" style={{ width: "64%" }} onClick={onClick}>
        {text}
    </button>
)

export default BCGovPrimaryButton
