import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Formik, Form, Field, yupToFormErrors } from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import { DatePickerField } from '../shared/DatePickerField'
import * as Yup from 'yup'

class ClaimForm extends Component {
    constructor() {
        super()
    }

    // temp logic in the getters until dynamic fields are done
    totalHoursWorked(values) {
        return Number(values.hoursWorked1) + Number(values.hoursWorked2) + Number(values.hoursWorked3) + Number(values.hoursWorked4) + Number(values.hoursWorked5);
    }

    totalHourlyWage(values) {
        return Number(values.hourlyWage1) + Number(values.hourlyWage2) + Number(values.hourlyWage3) + Number(values.hourlyWage4) + Number(values.hourlyWage5);
    }

    totalTotals(values) {
        return Number(values.total1) + Number(values.total2) + Number(values.total3) + Number(values.total4) + Number(values.total5);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
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
                                clientIssues1: '',
                                hoursWorked1: '',
                                hourlyWage1: '',
                                total1: 0,
                                clientIssues2: '',
                                hoursWorked2: '',
                                hourlyWage2: '',
                                total2: 0,
                                clientIssues3: '',
                                hoursWorked3: '',
                                hourlyWage3: '',
                                total3: 0,
                                clientIssues4: '',
                                hoursWorked4: '',
                                hourlyWage4: '',
                                total4: 0,
                                clientIssues5: '',
                                hoursWorked5: '',
                                hourlyWage5: '',
                                total5: 0,
                                hoursWorkedTotal1: 0,
                                hourlyWageTotal1: 0,
                                totalTotal1: '',
                                
                            }}
                            validationSchema={Yup.object({
                                employerAddress1: Yup.string().required('Required').max(255, 'Address too long, please use address line 2'),
                                employerAddress2: Yup.string().max(255, 'Address too long'),
                                employerCity: Yup.string().required('Required').max(100, 'City name too long'),
                                employerPostal: Yup.string().required('Required').matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,"Please enter a valid Postal Code")
                            })}

                        >
                            {({ values, errors, touched }) => (
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
                                            {feedBackInvalid(errors, touched, "confirmOrganizationNonProfit")}
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
                                            <legend>Address (if different from previous claim)</legend>
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
                                                    <td><DatePickerField  className="form-control" id="dateFrom1" name="dateFrom1" /></td>
                                                    <td><Field className="form-control" id="dateFrom1" name="hoursWorked1" /></td>
                                                    <td><Field className="form-control" id="dateFrom1" name="hourlyWage1" /></td>
                                                    <td><Field className="form-control" id="dateFrom1" name="total1" 
                                                    value={values.hoursWorked1 * values.hourlyWage1} disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className="form-control" id="dateFrom2" name="dateFrom2" /></td>
                                                    <td><Field className="form-control" id="dateFrom2" name="hoursWorked2" /></td>
                                                    <td><Field className="form-control" id="dateFrom2" name="hourlyWage2" /></td>
                                                    <td><Field className="form-control" id="dateFrom2" name="total2" 
                                                        value={values.hoursWorked2 * values.hourlyWage2} disabled/></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className="form-control" id="dateFrom3" name="dateFrom3" /></td>
                                                    <td><Field className="form-control" id="dateFrom3" name="hoursWorked3" /></td>
                                                    <td><Field className="form-control" id="dateFrom3" name="hourlyWage3" /></td>
                                                    <td><Field className="form-control" id="dateFrom3" name="total3" 
                                                        value={values.hoursWorked3 * values.hourlyWage3} disabled/></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className="form-control" id="dateFrom4" name="dateFrom4" /></td>
                                                    <td><Field className="form-control" id="dateFrom4" name="hoursWorked4" /></td>
                                                    <td><Field className="form-control" id="dateFrom4" name="hourlyWage4" /></td>
                                                    <td><Field className="form-control" id="dateFrom4" name="total4" 
                                                        value={values.hoursWorked4 * values.hourlyWage4} disabled/></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className="form-control" id="dateFrom5" name="dateFrom5" /></td>
                                                    <td><Field className="form-control" id="dateFrom5" name="hoursWorked5" /></td>
                                                    <td><Field className="form-control" id="dateFrom5" name="hourlyWage5" /></td>
                                                    <td><Field className="form-control" id="dateFrom5" name="total5" 
                                                    value={values.hoursWorked5 * values.hourlyWage5} disabled/></td>
                                                </tr>
                                                <tr>
                                                    <td colspan="4" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        <b>Total MERCS for claim period</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ verticalAlign: "middle" }}><b>Total</b></td>
                                                    <td><Field className="form-control" id="hoursWorkedTotal1" name="hoursWorkedTotal1" 
                                                    value={this.totalHoursWorked(values)} disabled/></td>
                                                    <td><Field className="form-control" id="hourlyWageTotal1" name="hourlyWageTotal1" 
                                                    value={this.totalHourlyWage(values)} disabled/></td>
                                                    <td><Field className="form-control" id="totalTotal1" name="totalTotal1" 
                                                    value={this.totalTotals(values)} disabled/></td> {/* This isn't updating */}
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