import React, {Component} from 'react'
import {Field} from 'formik'
import { DatePickerField } from '../shared/DatePickerField'


class FormStep2 extends Component {
        state={
            startDate: new Date(),
            endDate: new Date()
        };
        handleStartChange = date => {
            this.setState({
                startDate: date
            });
        };
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