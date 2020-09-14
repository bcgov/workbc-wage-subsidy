import React, { Component } from 'react'
import {Field} from 'formik'

class FormStep3 extends Component {



    render() {
        if (this.props.currentStep !== 3) {
            return null
        }


        //Else return step 3
        return (
            <div>
               
            </div>


        )
    }
}

export default FormStep3
