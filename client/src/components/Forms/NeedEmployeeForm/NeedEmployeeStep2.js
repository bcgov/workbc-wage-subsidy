import React, { Component } from 'react'
import { Field } from 'formik'

class NeedEmployeeStep2 extends Component {

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
            </div>
        )
    }
}
export default NeedEmployeeStep2