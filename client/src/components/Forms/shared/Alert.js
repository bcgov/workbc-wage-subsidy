import React from 'react'

export function generateAlert(alertType, message) {
    return (
        <div className={`alert ${alertType}`} role="alert">
            {message}
        </div>
    )
}