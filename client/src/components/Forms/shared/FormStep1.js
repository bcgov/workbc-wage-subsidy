import React, { Component } from 'react'
import {Field} from 'formik'

class FormStep1 extends Component {

    render() {
        if (this.props.currentStep !== 1) {
            return null
        }
        //Else return step 1
        return (
            <div>
                <div className="form-group">
                    <br /><h2 id="forms">Business Information</h2>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="operatingName">Operating Name <span
                        style={{ color: "red" }}>*</span></label>
                    <Field className="form-control" id="operatingName" name="operatingName" />
                </div>
                <div className="form-group">
                        <label className="col-form-label control-label" htmlFor="legalName">Legal Name <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id="legalName" name="legalName"/>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="businessNumber">Business Number<span
                        style={{ color: "red" }}>*</span></label>
                    <Field className="form-control" id="businessNumber" name="businessNumber" />
                </div>
                <div className="form-group">
                    <h2 id="forms">Organization Contact</h2>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="address">Street Address <span
                        style={{ color: "red" }}>*  </span></label>
                    <small className="text-muted" id="address">  123 Main St.</small>
                    <Field className="form-control" id="address" name="address" />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="col-form-label control-label" htmlFor="city">City <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className="form-control" id="city" name="city" />
                    </div>
                    <div className="form-group col-md-6">
                        <label className="col-form-label control-label" htmlFor="postal">Postal Code <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="postal">  V0R2V5</small>
                        <Field className="form-control" id="postal" name="postal" />
                    </div>
                </div>
            </div>
        )
    }


}

export default FormStep1