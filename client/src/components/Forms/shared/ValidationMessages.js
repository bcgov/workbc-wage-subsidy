import React from 'react'

export function feedBackClassName(errors,touched,fieldName){
    if (errors[fieldName] && touched[fieldName]){
        return "is-invalid"
    }
}

export function feedBackInvalid(errors,touched,fieldName){
    if (errors[fieldName] && touched[fieldName]){
        return <div className="invalid-feedback">{errors[fieldName]}</div>
    }
}