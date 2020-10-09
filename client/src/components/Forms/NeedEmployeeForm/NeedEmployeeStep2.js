import React, { Component } from 'react'
import { Field } from 'formik'
import { DatePickerField } from '../shared/DatePickerField'

/*
<div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor="skills">Skills and experience normally required for this position:<span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="textarea"
                            rows="4"
                            maxLength="700"
                            className="skills form-control"
                            id="skills"
                            name="skills"
                            value={skills}
                        />
                        {/*<small>{this.props.skills.length}/700</small>}
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
                                    className="workExperience form-control"
                                    id="workExperience"
                                    name="workExperience"
                                    value={workExperience}
                                />
                                {/*<small>{this.props.workExperience.length}/700</small>}
                            </div>
                        </div> 
*/
class NeedEmployeeStep2 extends Component {
    
    state={
        positions:[{operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:"",skills:"",workExperience:""}],

    };
    handleStartChange = date => {
        console.log(date)
        this.setState({
            startDate: date
        });
    };
    handleChange = (e) => {
        console.log("arrived");

        if (["operatingName", "numberOfPositions", "startDate", "hours", "wage", "duties", "skills", "workExperience"].includes(e.target.className.split(" ")[0])) {
          let positions = [...this.state.positions]
          positions[e.target.dataset.id][e.target.className.split(" ")[0]] = e.target.value
          this.setState({ positions }, () => console.log(this.state.positions))
        } else {
          this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
      }
    addPosition = (e) => {
        console.log("calls add positions!")
        this.setState((prevState)=> ({
            positions: [...prevState.positions, {operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:"",skills:"",workExperience:""}]

    }));
    }
    handleSubmit = (e) => { e.preventDefault() }
    render() {
        let { positions} = this.state
        if (this.props.currentStep !== 2) {
            return null
        }
    //Else return step 2
        return (
            <div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                      <button  type="button" onClick={this.addPosition}>Add Another Position Title</button>
                    </div>          
                </div>
                {
                    positions.map((val,Entry)=>{
                        let operatingName=`operatingName${Entry}`, numberOfPositions=`numberOfPositions${Entry}`, startDate=`startDate${Entry}`, hours=`hours${Entry}`, wage=`wage${Entry}`, duties=`duties${Entry}`,skills=`skills${Entry}`,workExperience=`workExperience${Entry}`
                    
                        return(
                            <div key={Entry}>
                                 <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label className="col-form-label control-label" htmlFor={operatingName}>Organization Name <span
                                            style={{ color: "red" }}>*</span></label>
                                        <Field className="operatingName form-control" id={operatingName} name={operatingName} data-id={Entry}  value={positions[Entry].operatingName} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={numberOfPositions}> Number of Available Positions <span
                                            style={{ color: "red" }}>*</span></label>
                                        <Field
                                            as="select"
                                            className="numberOfPositions form-control" 
                                            id={numberOfPositions} 
                                            name={numberOfPositions}
                                            data-id={Entry}
                                            value={positions[Entry].numberOfPositions}
                                            onChange={this.handleChange}
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
                                        <label className="col-form-label control-label" htmlFor={startDate}>Anticipated Start Date<span
                                                style={{ color: "red" }}>*</span></label>
                                            <DatePickerField 
                                                id={startDate}
                                                name={startDate}
                                                data-id={Entry}
                                                value={positions[Entry].startDate}
                                                className="startDate form-control"
                                                onChange={this.handleStartChange}
                                            />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={hours}>Hours of Work Per Week<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className="hours form-control" id={hours} name={hours} data-id={Entry}  value={positions[Entry].hours} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={wage}>Hourly Wage<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className="wage form-control" id={wage} name={wage} data-id={Entry}  value={positions[Entry].wage} onChange={this.handleChange} />
                                    </div>
                            </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={duties}>Description of duties:<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="700"
                                        className="duties form-control"
                                        id={duties} 
                                        name={duties} 
                                        data-id={Entry}  
                                        value={positions[Entry].duties}
                                        onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={skills}>Skills and experience normally required for this position:<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="700"
                                        className="skills form-control"
                                        id={skills} 
                                        name={skills} 
                                        data-id={Entry}  
                                        value={positions[Entry].skills}
                                        onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={workExperience}>What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement?<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="700"
                                        className="workExperience form-control"
                                        id={workExperience} 
                                        name={workExperience} 
                                        data-id={Entry}  
                                        value={positions[Entry].workExperience}
                                        onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
export default NeedEmployeeStep2