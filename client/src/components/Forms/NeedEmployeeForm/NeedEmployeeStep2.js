import React, { Component } from 'react'
import { Field } from 'formik'
import { DatePickerField } from '../shared/DatePickerField'
import { feedBackClassName, feedBackInvalid,NumPositionsInvalid } from '../shared/ValidationMessages'

class NeedEmployeeStep2 extends Component {
    constructor(){
        super()
        this.state={
            positions:[{operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:"",skills:"",workExperience:""}],
        };
    }

    handleStartChange = (e) => {
        this.setState({
            startDate: e
        });
    };
    handleChange = (e) => {

        if (["operatingName", "numberOfPositions", "startDate", "hours", "wage", "duties", "skills", "workExperience"].includes(e.target.className.split(" ")[0])) {
          let positions = [...this.state.positions]
          positions[e.target.dataset.id][e.target.className.split(" ")[0]] = e.target.value
          this.setState({ positions }, () => this.state.positions)
        } else {
          this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
      }
    
    addPosition = (e) => {
        this.props.values.checkPositionInstances = "1";
        this.setState((prevState)=> ({
            positions: [...prevState.positions, {operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:"",skills:"",workExperience:""}]

        }));
    }

    removePosition = (e) =>{
        this.props.values.checkPositionInstances = "0";
        this.props.values.operatingName1 = "";
        this.props.values.numberOfPositions1 = "0";
        this.props.values.startDate1 = "";
        this.props.values.hours1 = "";
        this.props.values.wage1 = "";
        this.props.values.skills1 = "";
        this.props.values.workExperience1 = "";
        this.setState((prevState)=>({
            positions: [this.state.positions[0]]
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
                 <div className="form-group">
                <br /><h2 id="forms">Job Information</h2>

                </div>
                    <div className="form-group">
                    {(this.props.values.numberOfPositions0 !== "0" && Number(this.props.values.numberOfPositions0) < 5 && this.props.values.checkPositionInstances !== "1") &&
                        <button className="btn btn-primary" type="button" disabled={this.props.values.checkPositionInstances === "1" || this.props.values.numberOfPositions0 === "0"} onClick={this.addPosition}>Add Another Position Title</button>
                    }
                    </div>
              
                {
                    positions.map((val,Entry)=>{
                        let operatingName=`operatingName${Entry}`, numberOfPositions=`numberOfPositions${Entry}`, startDate=`startDate${Entry}`, hours=`hours${Entry}`, wage=`wage${Entry}`, duties=`duties${Entry}`,skills=`skills${Entry}`,workExperience=`workExperience${Entry}`
                    
                        return(
                          
                            <div key={Entry}>
                                  <h2>Position {Entry+1}</h2>
                                <hr></hr>
                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label className="col-form-label control-label" htmlFor={operatingName}>Position Title <span
                                            style={{ color: "red" }}>*</span></label>
                                        <Field className={`operatingName form-control ${feedBackClassName(this.props.errors, this.props.touched, operatingName)}`} id={operatingName} name={operatingName} data-id={Entry}  />
                                        {feedBackInvalid(this.props.errors,this.props.touched, operatingName)}
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={numberOfPositions}> Number of Available Positions <span
                                            style={{ color: "red" }}>*</span></label>
                                        <Field
                                            as="select"
                                            className={`numberOfPositions form-control ${feedBackClassName(this.props.errors, this.props.touched, numberOfPositions)}`}
                                            id={numberOfPositions} 
                                            name={numberOfPositions}
                                            data-id={Entry}
                                            >
                                            <option value="0">Please select</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Field>
                                        {feedBackInvalid(this.props.errors,this.props.touched, numberOfPositions)}
                                        {NumPositionsInvalid(this.props.values)}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={startDate}>Anticipated Start Date<span
                                                style={{ color: "red" }}>*</span></label>
                                                 {feedBackInvalid(this.props.errors,this.props.touched, startDate)}
                                            <DatePickerField 
                                                id={startDate}
                                                name={startDate}
                                                data-id={Entry}
                                                minDate={new Date()}
                                                maxDate={new Date("02-29-2030")}
                                                className= {`startDate form-control ${feedBackClassName(this.props.errors, this.props.touched, startDate)}`}
                                            />
                                       
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={hours}>Hours of Work Per Week<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className= {`hours form-control ${feedBackClassName(this.props.errors, this.props.touched, hours)}`} id={hours} name={hours} data-id={Entry}  />
                                        {feedBackInvalid(this.props.errors,this.props.touched, hours)}
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={wage}>Hourly Wage<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className= {`wage form-control ${feedBackClassName(this.props.errors, this.props.touched, wage)}`} id={wage} name={wage} data-id={Entry}  />
                                        {feedBackInvalid(this.props.errors,this.props.touched, wage)}
                                    </div>
                            </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={duties}>Description of duties:<span
                                                style={{ color: "red" }}>*</span></label>
                                        <small className="text-muted" id="duties"> 500 characters max.</small>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="500"
                                        className={`duties form-control ${feedBackClassName(this.props.errors, this.props.touched, duties)}`}
                                        id={duties} 
                                        name={duties} 
                                        data-id={Entry}  
                                        />
                                        {feedBackInvalid(this.props.errors,this.props.touched, duties)}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={skills}>Skills and experience normally required for this position:<span
                                                style={{ color: "red" }}>*</span></label>
                                        <small className="text-muted" id="skills"> 500 characters max.</small>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="500"
                                        className={`skills form-control ${feedBackClassName(this.props.errors, this.props.touched, skills)}`}
                                        id={skills} 
                                        name={skills} 
                                        data-id={Entry}  
                                        />
                                         {feedBackInvalid(this.props.errors,this.props.touched, skills)}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label className="col-form-label control-label" htmlFor={workExperience}>What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement?<span
                                                style={{ color: "red" }}>*</span></label>
                                        <small className="text-muted" id="workExperience"> 500 characters max.</small>
                                        <Field 
                                        as="textarea"
                                        rows="4"
                                        maxLength="500"
                                        className={`workExperience form-control ${feedBackClassName(this.props.errors, this.props.touched, workExperience)}`}
                                        id={workExperience} 
                                        name={workExperience} 
                                        data-id={Entry}  
                                        />
                                         {feedBackInvalid(this.props.errors,this.props.touched, workExperience)}
                                    </div>
                                </div><br />
                            </div>
                        )
                    })
                }
                {this.props.values.checkPositionInstances !== "0" && <div><button className="btn btn-primary" type="button" disabled={this.props.values.checkPositionInstances === "0"} onClick={this.removePosition}>Remove Last Position Title</button><br /><br /></div>}
            </div>
        )
    }
}
export default NeedEmployeeStep2