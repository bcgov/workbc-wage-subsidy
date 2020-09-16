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
            <div className="form-group">
                <br /><h2 id="forms">Work Place Information (If different from Section 1)</h2><br/>
                <p>Complete a separate page for each work place</p>
            </div>
            <div className="form-group">
                <label className="col-form-label control-label" htmlFor="address">Work Address <span
                    style={{ color: "red" }}>*  </span></label>
                <small className="text-muted" id="address">  123 Main St.</small>
                <Field className="form-control" id="address" name="address" />
            </div>
            <div className="form-row">
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="city">City / Town <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id="city" name="city" />
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="Province">Province <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className="form-control" 
                            id="Province" 
                            name="Province" 
                        >
                            <option value="">Please select</option>
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland and Labrador</option>
                            <option value="NT">Northwest Territories</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="NU">Nunavut</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                            <option value="YT">Yukon</option>
                        </Field>
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="postal">Postal Code <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="postal">  V0R2V5</small>
                        <Field className="form-control" id="postal" name="postal" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md -8">
                            <label className="col-form-label control-label" htmlFor="legalName">Contact Name<span
                                style={{ color: "red" }}>*</span></label>
                            <Field className="form-control" id="legalName" name="legalName"/>
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessNumber">CRA Business Number<span
                            style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id="businessNumber" name="businessNumber" />
                    </div>
            </div>
            <div className="form-row">
                    <div className="form-group col-md-4">
                            <label className="col-form-label control-label" htmlFor="phone">Telephone<span
                                style={{ color: "red" }}>*</span></label>
                            <small className="text-muted" id="phone">  250-555-5555</small>
                            <Field className="form-control" id="phone" name="phone" />
                    </div>
                    <div className="form-group col-md-4">
                            <label className="col-form-label control-label" htmlFor="fax">Fax</label>
                            <small className="text-muted" id="Fax"> 1-250-555-5555</small>
                            <Field className="form-control" id="Fax" name="Fax" />
                        </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="email">Email Address<span
                                style={{ color: "red" }}>*</span></label>
                        <small className="text-muted" id="email">  someone@example.com</small>
                        <Field className="form-control" id="email" name="email" />
                    </div>
                </div>
           
        </div>
        )
    }
}

export default FormStep2