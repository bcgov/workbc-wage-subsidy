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
            <div className="form-group">
                <br /><h2 id="forms">Job Information</h2><br/>
            </div>
            <div className="form-row">
                <div className="form-group col-md-8">
                    <label className="col-form-label control-label" htmlFor="operatingName">Organization Name <span
                         style={{ color: "red" }}>*</span></label>
                    <Field className="form-control" id="operatingName" name="operatingName" />
                </div>
                <div className="form-group col-md-4">
                    <label className="col-form-label control-label" htmlFor="NumberOfPositions"> Number of Available Positions <span
                        style={{ color: "red" }}>*</span></label>
                    <Field
                        as="select"
                        className="form-control" 
                        id="NumberOfPositions" 
                        name="NumberOfPositions" 
                        >
                        <option value="">Please select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </Field>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-4">
                    <label className="col-form-label control-label" htmlFor="StartDate">Anticipated Start Date<span
                            style={{ color: "red" }}>*</span></label>
                        <DatePickerField 
                            name="StartDate"
                            className="form-control"
                        />
                </div>
                <div className="form-group col-md-4">
                    <label className="col-form-label control-label" htmlFor="hours">Hours of Work Per Week<span
                            style={{ color: "red" }}>*</span></label>
                    <Field className="form-control" id="hours" name="hours" />
                </div>
                <div className="form-group col-md-4">
                    <label className="col-form-label control-label" htmlFor="wage">Hourly Wage<span
                            style={{ color: "red" }}>*</span></label>
                    <Field className="form-control" id="wage" name="wage" />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-12">
                    <label className="col-form-label control-label" htmlFor="duties">Description of duties:<span
                            style={{ color: "red" }}>*</span></label>
                    <Field 
                        as="textarea"
                        rows="4"
                        maxLength="700"
                        className="form-control" 
                        id="duties" 
                        name="duties" 
                    />
                </div>
            </div>

        </div>
        )
    }
}

export default FormStep2