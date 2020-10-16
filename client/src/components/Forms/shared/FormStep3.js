import React, { Component } from 'react'
import { Field } from 'formik'

class FormStep3 extends Component {



    render() {
        if (this.props.currentStep !== 3) {
            return null
        }


        //Else return step 3
        return (
            <div>
                <div className="form-group">
                    <br /><h2 id="forms">Declaration and Signature</h2>
                </div>
                <p><b>Note:</b> Intentional falsification of information on this form may lead to termination and exclusion from all WorkBC Employment Services.</p>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="signatoryTitle">Signing Authority Title <span
                        style={{ color: "red" }}>*  </span></label>
                    <small className="text-muted" id="signatoryTitle">Please enter the title of the organization signatory</small>
                    <Field className="form-control" id="signatoryTitle" name="signatoryTitle" />
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="signatory1">Signing Authority Full Name <span
                        style={{ color: "red" }}>*  </span></label>
                    <small className="text-muted" id="signatory1">Please enter the full name of the organization signatory</small>
                    <Field className="form-control" id="signatory1" name="signatory1" />
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <Field type="checkbox" className="form-check-input" id="organizationConsent"
                            name="organizationConsent" />
                        <label className="form-check-label" htmlFor="organizationConsent"><span style={{ color: "red" }}>*</span> I acknowledge and understand that by clicking the "submit" icon,
                    I am attaching my electronic signature to this form.
                    I am authorized to act and to enter into this Agreement on behalf of the Organization.
                    On the Organization's behalf, I do hereby accept and agree to the terms and conditions of this Agreement</label>
                    </div>
                </div>
                <button
                    className="btn btn-success btn-block"
                    type="submit"
                    style={{ marginBottom: "2rem" }}
                    disabled={this.props.isSubmitting || this.props.hasError}
                >
                    {
                    this.props.isSubmitting ?
                        <div>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              Submitting...
                        </div>
                        :
                        "Submit"

                    }                      
                
                </button>
            </div>

        )
    }
}

export default FormStep3