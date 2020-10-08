import React, { Component } from 'react'
import { Field } from 'formik'
import { DatePickerField } from '../shared/DatePickerField'

window.$count = 0;
window.$number = 0;

class NeedEmployeeStep2 extends Component {
    
    state={
        startDate: new Date(),
        endDate: new Date()
    };
    handleStartChange = date => {
        this.setState({
            startDate: date
        });
    };
    get NewPosition() {
        let Entry = window.$count;
        let check = this.props.values.AddPosition
        if(Entry === 1){
            check = this.props.values.AddPosition1
        }
        if(Entry === 2){
            check = this.props.values.AddPosition2
        }
        if(Entry === 3){
            check = this.props.values.AddPosition3
        }
        let NumPositions = parseInt(this.props.values.NumberOfPositions) +parseInt(this.props.values.NumberOfPositions1) +parseInt(this.props.values.NumberOfPositions2)+parseInt(this.props.values.NumberOfPositions3);
        let lastNumPosition = window.$number;

        console.log("checking "+ NumPositions);
        console.log("entry "+ Entry);
        console.log("checking "+ check);
        if (NumPositions < 5 && check === "Yes" && (NumPositions > lastNumPosition)) {
            Entry = Entry + 1;
            window.$count = Entry;
            window.$number = NumPositions;

            return (
            <div>
                    <div className="form-row">
                    <div className="form-group col-md-8">
                        <label className="col-form-label control-label" htmlFor={`operatingName${Entry}`}>Organization Name <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`operatingName${Entry}`} name={`operatingName${Entry}`} />
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor={`NumberOfPositions${Entry}`}> Number of Available Positions <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className="form-control" 
                            id={`NumberOfPositions${Entry}`} 
                            name={`NumberOfPositions${Entry}`}
                            >
                            <option value="0">Please select</option>
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
                        <label className="col-form-label control-label" htmlFor={`hours${Entry}`}>Hours of Work Per Week<span
                                style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`hours${Entry}`} name={`hours${Entry}`} />
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor={`wage${Entry}`}>Hourly Wage<span
                                style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`wage${Entry}`} name={`wage${Entry}`} />
                    </div>
            </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor={`duties${Entry}`}>Description of duties:<span
                                style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`duties${Entry}`} name={`duties${Entry}`} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor={`skills${Entry}`}>Skills and experience normally required for this position:<span
                                style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`skills${Entry}`} name={`skills${Entry}`} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor={`workExperience${Entry}`}>What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement?<span
                                style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id={`workExperience${Entry}`} name={`workExperience${Entry}`} />
                    </div>
                </div>
                <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor={`AddPosition${Entry}`}> Would you Like to add another position to this form? <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className="form-control" 
                            id={`AddPosition${Entry}`}
                            name={`AddPosition${Entry}`}
                            >
                            <option value="">Please select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </Field>
                </div>   
                {this.NewPosition}
            </div> 
            )
        }
        return null;
    }

    render() {
        if (this.props.currentStep !== 2) {
            return null
        }
        //Else return step 2
        return (
            <div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor="skills">Skills and experience normally required for this position:<span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="textarea"
                            rows="4"
                            maxLength="700"
                            className="form-control"
                            id="skills"
                            name="skills"
                        />
                        {/*<small>{this.props.skills.length}/700</small>*/}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor="workExperience">What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement?<span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="textarea"
                            rows="4"
                            maxLength="700"
                            className="form-control"
                            id="workExperience"
                            name="workExperience"
                        />
                        {/*<small>{this.props.workExperience.length}/700</small>*/}
                    </div>
                </div> 
                <div className="form-row">
                <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="AddPosition"> Would you Like to add another position to this form? <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className="form-control" 
                            id="AddPosition" 
                            name="AddPosition"
                            >
                            <option value="">Please select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </Field>
                    </div>          
                </div>
                {this.NewPosition}
            </div>
        )
    }
}
export default NeedEmployeeStep2