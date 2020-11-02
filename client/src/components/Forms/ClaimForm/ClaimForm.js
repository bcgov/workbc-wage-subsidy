import React, { Component } from 'react'
import '../../../utils/polyfills'
import { ClaimFormValidationSchema } from './ClaimFormValidationSchema'
import { Formik, Form, Field } from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import { DatePickerField } from '../shared/DatePickerField'
import { FORM_URL } from '../../../constants/form'
import { nanoid } from 'nanoid'
import { generateAlert } from '../shared/Alert'

class ClaimForm extends Component {
    constructor() {
        super();
        this.state = {
            _csrf: '',
            _id: nanoid(10)
        }
    }

    componentDidMount() {
        fetch(FORM_URL.claimForm, {
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

    totalHoursWorked(values) {
        return Number(values.hoursWorked1) + Number(values.hoursWorked2) + Number(values.hoursWorked3) + Number(values.hoursWorked4) + Number(values.hoursWorked5);
    }

    totalHourlyWage(values) {
        return Number(values.hourlyWage1) + Number(values.hourlyWage2) + Number(values.hourlyWage3) + Number(values.hourlyWage4) + Number(values.hourlyWage5);
    }

    totalTotals(values) {
        return Number(values.total1) + Number(values.total2) + Number(values.total3) + Number(values.total4) + Number(values.total5);
    }


    setHoursTotal(func, values, field, amount) {
        // set line total
        func(field, amount);
        // update hours worked totals
        func('hoursWorkedTotal1', this.totalHoursWorked(values));
        // update totals total
        func('totalTotal1', this.totalTotals(values));
    }

    setWageTotal(func, values, field, amount) {
        // set line total
        func(field, amount);
        // update wage totals
        func('hourlyWageTotal1', this.totalHourlyWage(values));
        // update totals total
        func('totalTotal1', this.totalTotals(values));
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
                                periodStart1: '',
                                periodStart2: '',
                                isFinalClaim: '',
                                employerName: '',
                                employerContact: '',
                                employerPhone: '',
                                employerAddress1: '',
                                employerAddress2: '',
                                employerCity: '',
                                employerPostal: '',
                                employeeFirstName: '',
                                employeeLastName: '',
                                clientIssues1: '',
                                dateFrom1: '',
                                hoursWorked1: '',
                                hourlyWage1: '',
                                total1: 0,
                                clientIssues2: '',
                                dateFrom2: '',
                                hoursWorked2: '',
                                hourlyWage2: '',
                                total2: 0,
                                clientIssues3: '',
                                dateFrom3: '',
                                hoursWorked3: '',
                                hourlyWage3: '',
                                total3: 0,
                                clientIssues4: '',
                                dateFrom4: '',
                                hoursWorked4: '',
                                hourlyWage4: '',
                                total4: 0,
                                clientIssues5: '',
                                dateFrom5: '',
                                hoursWorked5: '',
                                hourlyWage5: '',
                                total5: 0,
                                hoursWorkedTotal1: 0,
                                hourlyWageTotal1: 0,
                                totalTotal1: '',
                            }}
                            validationSchema={ClaimFormValidationSchema}
                            onSubmit={(values, actions) => {
                                // doing this here to avoid any weird edge cases with onBlur and hitting submit
                                actions.setFieldValue('totalsTotal1', this.totalTotals(values));
                                // post form
                                fetch(FORM_URL.claimForm, {
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
                                                this.props.history.push('/thankyouClaimForm', values);
                                            }
                                        }
                                    ));
                                // actions.setSubmitting(false);
                                // this.props.history.push('/thankyouClaimForm', values);
                            }}
                        >
                            {({ values, errors, touched, setFieldValue, isSubmitting, isValid }) => (
                                <Form>
                                    <div className="form-group">
                                        <h2 id="forms">Wage Subsidy Claim Form</h2>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-6">
                                            <label className="col-form-label control-label" htmlFor="periodStart1">Period claim covered from <span
                                                style={{ color: "red" }}>*</span></label>
                                            <DatePickerField
                                                name="periodStart1"
                                                className={`form-control ${feedBackClassName(errors, touched, "periodStart1")}`}
                                            />
                                            {feedBackInvalid(errors, touched, "periodStart1")}
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label className="col-form-label control-label" htmlFor="periodStart2">Period claim covered to <span
                                                style={{ color: "red" }}>*</span></label>
                                            <DatePickerField
                                                name="periodStart2"
                                                className={`form-control ${feedBackClassName(errors, touched, "periodStart2")}`}
                                            />
                                            {feedBackInvalid(errors, touched, "periodStart2")}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-form-label control-label" htmlFor="isFinalClaim">Final Claim? <span
                                            style={{ color: "red" }}>*</span> </label>
                                        <div className="form-check">
                                            <Field
                                                className={`form-check-input ${feedBackClassName(errors, touched, "isFinalClaim")}`}
                                                type="radio"
                                                name="isFinalClaim"
                                                value="yes"
                                            />
                                            <label className="form-check-label" htmlFor="isFinalClaim">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <Field
                                                className={`form-check-input ${feedBackClassName(errors, touched, "isFinalClaim")}`}
                                                type="radio"
                                                name="isFinalClaim"
                                                value="no"
                                            />
                                            <label className="form-check-label" htmlFor="isFinalClaim">No</label>
                                            {feedBackInvalid(errors, touched, "isFinalClaim")}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label control-label" htmlFor="employerName">Employer Name (Business Name) <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employerName")}`} id="employerName" name="employerName" />
                                                {feedBackInvalid(errors, touched, "employerName")}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label control-label" htmlFor="employerContact">Employer Contact <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employerContact")}`} id="employerContact" name="employerContact" />
                                                {feedBackInvalid(errors, touched, "employerContact")}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label className="col-form-label control-label" htmlFor="employerPhone">Phone Number <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <small className="text-muted" id="contactPhone">  250-555-5555</small>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employerPhone")}`} id="employerPhone" name="employerPhone" />
                                                {feedBackInvalid(errors, touched, "employerPhone")}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <legend>Address</legend>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label control-label" htmlFor="employerAddress1">Address 1 <span
                                                style={{ color: "red" }}>*</span></label>
                                            <small className="text-muted" id="employerAddress1">  Street address, P.O. box, company name, c/o</small>
                                            <Field className={`form-control ${feedBackClassName(errors, touched, "employerAddress1")}`} id="employerAddress1" name="employerAddress1" />
                                            {feedBackInvalid(errors, touched, "employerAddress1")}
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label control-label" htmlFor="employerAddress2">Address 2</label>
                                            <small className="text-muted" id="employerAddress2">  Apartment, suite, unit, building, floor, etc.</small>
                                            <Field className={`form-control ${feedBackClassName(errors, touched, "employerAddress2")}`} id="employerAddress2" name="employerAddress2" />
                                            {feedBackInvalid(errors, touched, "employerAddress2")}
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label control-label" htmlFor="employerCity">City <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employerCity")}`} id="employerCity" name="employerCity" />
                                                {feedBackInvalid(errors, touched, "employerCity")}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label control-label" htmlFor="employerPostal">Postal Code <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <small className="text-muted" id="employerPostal">  V0R2V5</small>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employerPostal")}`} id="employerPostal" name="employerPostal" />
                                                {feedBackInvalid(errors, touched, "employerPostal")}
                                            </div>
                                        </div>
                                        <div className="form-row">

                                            <div className="form-group col-md-6">
                                                <label className="col-form-label control-label" htmlFor="employeeFirstName">Employee First Name <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employeeFirstName")}`} id="employeeFirstName" name="employeeFirstName" />
                                                {feedBackInvalid(errors, touched, "employeeFirstName")}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label className="col-form-label control-label" htmlFor="employeeLastName">Employee Last Name <span
                                                    style={{ color: "red" }}>*</span></label>
                                                <Field className={`form-control ${feedBackClassName(errors, touched, "employeeLastName")}`} id="employeeLastName" name="employeeLastName" />
                                                {feedBackInvalid(errors, touched, "employeeLastName")}
                                            </div>
                                        </div>
                                        <table class="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date From</th>
                                                    <th>Hours Worked</th>
                                                    <th>Hourly Wage</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom1")}`} id="dateFrom1" name="dateFrom1" /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked1")}`} id="dateFrom1" name="hoursWorked1"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total1', values.hoursWorked1 * values.hourlyWage1) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage1")}`} id="dateFrom1" name="hourlyWage1"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total1', values.hoursWorked1 * values.hourlyWage1) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total1")}`} id="dateFrom1" name="total1" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom2")}`} id="dateFrom2" name="dateFrom2" /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked2")}`} id="dateFrom2" name="hoursWorked2"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total2', values.hoursWorked2 * values.hourlyWage2) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage2")}`} id="dateFrom2" name="hourlyWage2"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total2', values.hoursWorked2 * values.hourlyWage2) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total2")}`} id="dateFrom2" name="total2" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom3")}`} id="dateFrom3" name="dateFrom3" /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked3")}`} id="dateFrom3" name="hoursWorked3"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total3', values.hoursWorked3 * values.hourlyWage3) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage3")}`} id="dateFrom3" name="hourlyWage3"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total3', values.hoursWorked3 * values.hourlyWage3) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total3")}`} id="dateFrom3" name="total3" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom4")}`} id="dateFrom4" name="dateFrom4" /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked4")}`} id="dateFrom4" name="hoursWorked4"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total4', values.hoursWorked4 * values.hourlyWage4) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage4")}`} id="dateFrom4" name="hourlyWage4"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total4', values.hoursWorked4 * values.hourlyWage4) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total4")}`} id="dateFrom4" name="total4" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom5")}`} id="dateFrom5" name="dateFrom5" /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked5")}`} id="dateFrom5" name="hoursWorked5"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total5', values.hoursWorked5 * values.hourlyWage5) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage5")}`} id="dateFrom5" name="hourlyWage5"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total5', values.hoursWorked5 * values.hourlyWage5) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total5")}`} id="dateFrom5" name="total5" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        <b>Total MERCS for claim period</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: "middle" }}><b>Total</b></td>
                                                    <td><Field className="form-control" id="hoursWorkedTotal1" name="hoursWorkedTotal1"
                                                        disabled /></td>
                                                    <td><Field className="form-control" id="hourlyWageTotal1" name="hourlyWageTotal1"
                                                        disabled /></td>
                                                    <td><Field className="form-control" id="totalTotal1" name="totalTotal1"
                                                        disabled /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="form-group">
                                            <label className="col-form-label control-label" htmlFor="clientIssues1">Note any client issues, if applicable
                                             </label>
                                            <small className="text-muted" id="clientIssues1"> 700 characters max.</small>
                                            <Field
                                                as="textarea"
                                                className="form-control"
                                                id="clientIssues1"
                                                name="clientIssues1"
                                                rows="4"
                                            />
                                            <small>{values.clientIssues1.length}/700</small>
                                        </div>
                                        <div className="form-group">
                                            <button
                                                className="btn btn-success btn-block"
                                                type="submit"
                                                style={{ marginBottom: "2rem" }}
                                                disabled={isSubmitting || !isValid}
                                            >
                                                {
                                                    isSubmitting ?
                                                        <div>
                                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                            Submitting...
                                                        </div>
                                                        :
                                                        "Submit"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                </div>
            </div>
        )
    }
}
export default ClaimForm