import React, { Component } from 'react'
import { Field } from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'

class FormStep3 extends Component {

    get showErrors() {
        if (this.props.submitCount > 0) {
            return (
                <div>
                    <p>Please correct the following errors:</p>
                    <ul>
                        {Object.values(this.props.errors).map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </div>
            )
        } else {
            return null
        }
    }

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
                    <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "signatoryTitle")}`}id="signatoryTitle" name="signatoryTitle" />
                    {feedBackInvalid(this.props.errors,this.props.touched,"signatoryTitle")}
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="signatory1">Signing Authority Full Name <span
                        style={{ color: "red" }}>*  </span></label>
                    <small className="text-muted" id="signatory1">Please enter the full name of the organization signatory</small>
                    <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "signatory1")}`} id="signatory1" name="signatory1" />
                    {feedBackInvalid(this.props.errors,this.props.touched,"signatory1")}
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <Field type="checkbox" className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "organizationConsent")}`} id="organizationConsent" name="organizationConsent" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"organizationConsent")}
                        <label className="form-check-label" htmlFor="organizationConsent"><span style={{ color: "red" }}>*</span> I acknowledge and understand that by clicking the "submit" I am attaching my electronic signature to this form and that by doing so I acquire the same rights, incur the same obligations and confer the same consent as I would by manually signing a physical copy of this form.</label>
                    </div>
                </div>
                <div className="form-group">
                    {this.showErrors}
                    <div className="alert alert-primary" role="alert">
                            Once submitted, a WorkBC representative will contact you to review your application and confirm if your organization qualifies for Wage Subsidy.
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