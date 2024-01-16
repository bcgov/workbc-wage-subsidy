import React from "react"
import "./Tag.css"

const Tag = () => {
    return (
        <div aria-label="The current environment" className="Beta-PhaseBanner">
            {process.env.REACT_APP_ENVIRONMENT === "PRODUCTION" ? "" : process.env.REACT_APP_ENVIRONMENT}
        </div>
    )
}

export default Tag
