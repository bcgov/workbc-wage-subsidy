import React, { Component } from 'react'
import { Field } from 'formik'
import { DatePickerField } from '../shared/DatePickerField'
import { NumPositionsInvalid } from '../shared/ValidationMessages'

window.$buttonStatus = false;
class HaveEmployeeStep2 extends Component {
    
    state={
        positions:[{operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:""}],

    };
    handleStartChange = (e) => {
        this.setState({
            startDate: e
        });
    };
    handleChange = (e) => {

        if (["operatingName", "numberOfPositions", "startDate", "hours", "wage", "duties"].includes(e.target.className.split(" ")[0])) {
          let positions = [...this.state.positions]
          positions[e.target.dataset.id][e.target.className.split(" ")[0]] = e.target.value
          this.setState({ positions }, () => console.log(this.state.positions))
        } else {
          this.setState({ [e.target.name]: e.target.value.toUpperCase() })
        }
      }
    get positionCheck (){
       let check =  parseInt(this.props.values.numberOfPositions0) + parseInt(this.props.values.numberOfPositions1) + parseInt(this.props.values.numberOfPositions2) + parseInt(this.props.values.numberOfPositions3) + parseInt(this.props.values.numberOfPositions4)
       console.log(check)
       if(check >= 5){
            window.$buttonStatus = true;
            if(check > 5){
                console.log("error message");
            }
        }
        else{
            window.$buttonStatus = false;
        }
        return null;
    }
    addPosition = (e) => {
        window.$buttonStatus = true;
        this.setState((prevState)=> ({
            positions: [...prevState.positions, {operatingName:"", numberOfPositions:"", startDate:"",hours:"",wage:"",duties:""}]

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
                      <button className="btn btn-primary" type="button" disabled ={window.$buttonStatus} onClick={this.addPosition}>Add Another Position Title</button><br></br>
                    </div>
                    {this.positionCheck}          
                {
                    positions.map((val,Entry)=>{
                        let operatingName=`operatingName${Entry}`, numberOfPositions=`numberOfPositions${Entry}`, startDate=`startDate${Entry}`, hours=`hours${Entry}`, wage=`wage${Entry}`, duties=`duties${Entry}`
                    
                        return(
                          
                            <div key={Entry}>
                                  <h2>Position {Entry+1}</h2>
                                <hr></hr>
                                 <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label className="col-form-label control-label" htmlFor={operatingName}>Organization Name <span
                                            style={{ color: "red" }}>*</span></label>
                                        <Field className="operatingName form-control" id={operatingName} name={operatingName} data-id={Entry}  />
                                        
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
                                            >
                                            <option value="0">Please select</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Field>
                                        {NumPositionsInvalid(this.props.values)}
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
                                                className="startDate form-control"
                                            />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={hours}>Hours of Work Per Week<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className="hours form-control" id={hours} name={hours} data-id={Entry}  />
                                    </div>
                                    <div className="form-group col-md-4">
                                        <label className="col-form-label control-label" htmlFor={wage}>Hourly Wage<span
                                                style={{ color: "red" }}>*</span></label>
                                        <Field className="wage form-control" id={wage} name={wage} data-id={Entry}  />
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
export default HaveEmployeeStep2