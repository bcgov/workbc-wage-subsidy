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

export function NumPositionsInvalid(props){
    if ((parseInt(props['numberOfPositions0'] )+ parseInt(props['numberOfPositions1']))> 5 ){
        return <div className="invalid-Position-numbers"> The number of positions may not exceed 5</div>
    }
}
