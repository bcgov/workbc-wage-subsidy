import React, {Component} from 'react'
import {Field} from 'formik'

class FormStep2 extends Component {
    
    render() {
        if (this.props.currentStep !== 2) {
            return null
        }
        //Else return step 2
        return (
            <div>

            </div>
        )
    }
}

export default FormStep2