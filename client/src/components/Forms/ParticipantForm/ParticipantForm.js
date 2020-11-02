import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import { DatePickerField } from '../shared/DatePickerField'
import CollectionNotice from './CollectionNotice'
import { ParticipantValidationSchema } from './ParticipantValidationSchema'
import { FORM_URL } from '../../../constants/form'
import { nanoid } from 'nanoid'
import { generateAlert } from '../shared/Alert'

class ParticipantForm extends Component {

    constructor() {
        super()
        this.state = {
            _csrf: '',
            _id: nanoid(10),
            hasError: false
        }
    }

    componentDidMount() {
        fetch(FORM_URL.clientForm, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result.csrfToken)
                    this.setState({
                        _csrf: result.csrfToken,
                    })
                },
                (error) => {
                    console.log(error)
                    this.setState({
                        hasError: true
                    })
                }
            )
    }

    handleApplicationId(id, hasId, errors, touched) {
        if (id === "" || id.length !== 10) {
            //show non id handler
            return (
                <div>
                    <p>Please follow the link provided to you via email, or provide the application ID below.</p>
                    <div className="form-group">
                        <label className="col-form-label control-label" htmlFor="applicationId">Application ID <span
                            style={{ color: "red" }}>*</span></label>
                        <small className="text-muted" id="clientAddress1"> Please provide the 10 character ID.</small>
                        <Field className={`form-control ${feedBackClassName(errors, touched, "applicationId")}`} id="applicationId" name="applicationId" />
                        {feedBackInvalid(errors, touched, "applicationId")}
                    </div>
                </div>
            )
        } else {
            //display the id
            return (
                <p>Application ID: {id}</p>
            )
        }
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                    {this.state.hasError && (
                            generateAlert("alert-danger", "An error has occurred, please refresh the page. If the error persists, please try again later.")
                        )}
                        <Formik
                            initialValues={{
                                _csrf: '',
                                applicationId: (typeof this.props.match.params.id !== 'undefined') ? this.props.match.params.id : '',
                                existingWorkBCClient: '',
                                participantFirstName: '',
                                participantLastName: '',
                                participantDOB: '',
                                participantConsent: false,
                            }}
                            validationSchema={ParticipantValidationSchema}
                            onSubmit={(values, actions) => {
                                fetch(FORM_URL.clientForm, {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(values),
                                })
                                    .then(res => res.json())
                                    .then((
                                        resp => {
                                            if (resp.err) {
                                                actions.setSubmitting(false);
                                                actions.setErrors(resp.err);
                                                this.setState({
                                                    hasError: true
                                                })
                                            } else if (resp.emailErr) {
                                                console.log("emailError")
                                                actions.setSubmitting(false)
                                                this.setState({
                                                    hasError: true
                                                })
                                            }
                                            else if (resp.ok) {
                                                actions.setSubmitting(false);
                                            }
                                        }
                                    ));
                            }}
                        >
                            {({ values, errors, touched, isSubmitting }) => (
                                <Form>
                                    <div className="form-group">
                                        <h2 id="forms">Wage Subsidy Participant Form</h2>
                                    </div>
                                    {this.handleApplicationId(values.applicationId, values.noOrgId, errors, touched)}
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="col-form-label control-label" htmlFor="participantFirstName">First Name <span
                                                style={{ color: "red" }}>*</span></label>
                                            <Field className={`form-control ${feedBackClassName(errors, touched, "participantFirstName")}`} id="participantFirstName" name="participantFirstName" />
                                            {feedBackInvalid(errors, touched, "participantFirstName")}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="col-form-label control-label" htmlFor="participantLastName">Last Name <span
                                                style={{ color: "red" }}>*</span></label>
                                            <Field className={`form-control ${feedBackClassName(errors, touched, "participantLastName")}`} id="participantLastName" name="participantLastName" />
                                            {feedBackInvalid(errors, touched, "participantLastName")}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label control-label" htmlFor="participantDOB">Date of birth <span
                                            style={{ color: "red" }}>*</span></label>
                                        <DatePickerField
                                            name="participantDOB"
                                            className={`form-control ${feedBackClassName(errors, touched, "participantDOB")}`}
                                        />
                                        {feedBackInvalid(errors, touched, "participantDOB")}
                                    </div>
                                    <CollectionNotice />
                                    <div className="form-group">
                                        <div className="form-check">
                                            <Field type="checkbox" className={`form-check-input ${feedBackClassName(errors, touched, "participantConsent")}`} id="participantConsent"
                                                name="participantConsent" />
                                            <label className="form-check-label control-label" htmlFor="participantConsent"><span style={{ color: "red" }}>*</span> I acknowledge and
                                            understand that by clicking the "submit" icon, I am attaching my electronic signature to this form, and that
                                            by doing so, I am providing the same consent as I would by manually signing a physical copy of this
                                            form.
                                            </label>
                                            {feedBackInvalid(errors, touched, "participantConsent")}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-success btn-block"
                                        type="submit"
                                        style={{ marginBottom: "2rem" }}
                                        disabled={isSubmitting || this.state.hasError}
                                    >
                                        {
                                            isSubmitting ?
                                                <div>
                                                    <span className="spinner-border spinner-border-sm" htmlRole="status" aria-hidden="true"></span>
                                                       Submitting...
                                                </div>
                                                :
                                                "Submit"

                                        }
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(ParticipantForm);