import React, { Component } from 'react'
import '../../../utils/polyfills'
import { ClaimFormValidationSchema } from './ClaimFormValidationSchema'
import { Formik, Form, Field } from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import { DatePickerField } from '../shared/DatePickerField'
import { FORM_URL } from '../../../constants/form'
import '../../../utils/polyfills'
import { customAlphabet } from 'nanoid'
import { generateAlert } from '../shared/Alert'
import { pins } from '../../../constants/pins'

class ClaimForm extends Component {
    constructor() {
        super();
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10)
        this.state = {
            _csrf: '',
            _id: nanoid(),
            hasError: false
        }
    }

    componentDidMount() {
        fetch(FORM_URL.claimForm, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result.csrfToken)
                    this.setState({
                        _csrf: result.csrfToken,
                    })
                },
                (error) => {
                    //console.log(error)
                    this.setState({
                        hasError: true
                    })
                }
            )
    }


    showErrors(errors,submitCount) {
        if (submitCount > 0) {
            return (
                <div>
                    <p>Please correct the following errors:</p>
                    <ul>
                        {Object.values(errors).map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </div>
            )
        } else {
            return null
        }
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

    /*
    addressToCatchment(address1, address2, city,province,postal){
        if (address1 === "" || city === "" || postal === ""){
            return null
        }else {
            if (city.length > 3 && address1.length > 4 && postal.length >= 6){
                if (address1 === this.state.address1 && city === this.state.city){
                    return null
                }
                fetch(`https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=${address1},${city},${province}`,{

                })
                .then(res => res.json())
                .then(result => {
                    console.log(result)
                    let coordinates = result.features[0].geometry.coordinates
                    let min = 99999
                    let closestIndex
                    for (const [index,value] of pins.features.entries()){
                        console.log(index)
                        console.log(value.geometry.coordinates) 
                        let distance = this.distance(coordinates[1],coordinates[0],value.geometry.coordinates[1],value.geometry.coordinates[0],'K')
                        if (distance < min){
                            min = distance
                            closestIndex = index
                        }
                    }
                    this.setState({
                        coordinates: coordinates
                    })
                    console.log(pins.features[closestIndex].properties.name)
                    //return <p>Closest WorkBC Centre: {pins.features[closestIndex].properties.name}</p>
                })
                this.setState({
                    address1: address1,
                    address2: address2,
                    city: city
                    
                })
            } else {
                return null
            }
            
        }
    }
    */
    /*
    distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit==="K") { dist = dist * 1.609344 }
            if (unit==="N") { dist = dist * 0.8684 }
            return dist;
        }
    }
    dateErrorStyle = {width:"100%",
   margin-top:"0.25rem",font-size:"80%",color:"#d93e45"}
    */
   

    setHoursTotal(func, values, field, amount) {
        // set line total
        func(field, amount);
        // update hours worked totals
        func('hoursWorkedTotal1', this.totalHoursWorked(values));
        // update totals total
        //func('totalTotal1', this.totalTotals(values));
    }

    setWageTotal(func, values, field, amount) {
        // set line total
        func(field, amount);
        // update wage totals
        func('hourlyWageTotal1', this.totalHourlyWage(values));
        // update totals total
        //func('totalTotal1', this.totalTotals(values));
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
                                _csrf: this.state._csrf,
                                _id: this.state._id,
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
                                dateTo1: '',
                                hoursWorked1: '',
                                hourlyWage1: '',
                                total1: 0,
                                clientIssues2: '',
                                dateFrom2: '',
                                dateTo2: '',
                                hoursWorked2: '',
                                hourlyWage2: '',
                                total2: 0,
                                clientIssues3: '',
                                dateFrom3: '',
                                dateTo3: '',
                                hoursWorked3: '',
                                hourlyWage3: '',
                                total3: 0,
                                clientIssues4: '',
                                dateFrom4: '',
                                dateTo4: '',
                                hoursWorked4: '',
                                hourlyWage4: '',
                                total4: 0,
                                clientIssues5: '',
                                dateFrom5: '',
                                dateTo5: '',
                                hoursWorked5: '',
                                hourlyWage5: '',
                                total5: 0,
                                totalMERCs: '',
                                hoursWorkedTotal1: 0,
                                hourlyWageTotal1: 0,
                                totalTotal1: '',
                                workbcCentre: '',
                                signatory1: '',
                            }}
                            enableReinitialize={true}
                            validationSchema={ClaimFormValidationSchema}
                            onSubmit={(values, actions) => {
                                // doing this here to avoid any weird edge cases with onBlur and hitting submit
                                let totalTotal = this.totalTotals(values);
                                // SHOULD do it like this:
                                // actions.setFieldValue('totalTotal1', totalTotal);
                                // but that doesn't actually do anything.

                                // Doing it this way feels wrong and dirty
                                // but it works so here we are
                                values.totalTotal1 = totalTotal;

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
                                                //console.log("emailError")
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
                            {({ values, errors, touched, setFieldValue, isSubmitting, isValid, submitCount, handleBlur, handleChange }) => (
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
                                        {
                                            //no longer needed as center will be chosen from dropdown
                                            /*
                                            useEffect(() => {
                                                this.addressToCatchment(values.employerAddress1, values.employerAddress2,values.employerCity,"BC",values.employerPostal)
                                            }, [values.employerAddress1, values.employerAddress2,values.employerCity,values.employerPostal,setFieldValue])
                                            
                                            */
                                        }
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
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date From</th>
                                                    <th>Date To</th>
                                                    <th>Hours Worked</th>
                                                    <th>Hourly Wage</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom1")}`} id="dateFrom1" name="dateFrom1"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateTo1")}`} id="dateTo1" name="dateTo1"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked1")}`} id="dateFrom1" name="hoursWorked1"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total1', parseFloat(values.hoursWorked1 * values.hourlyWage1).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage1")}`} id="dateFrom1" name="hourlyWage1"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total1', parseFloat(values.hoursWorked1 * values.hourlyWage1).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total1")}`} id="dateFrom1" name="total1" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom2")}`} id="dateFrom2" name="dateFrom2"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateTo2")}`} id="dateTo2" name="dateTo2"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked2")}`} id="dateFrom2" name="hoursWorked2"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total2', parseFloat(values.hoursWorked2 * values.hourlyWage2).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage2")}`} id="dateFrom2" name="hourlyWage2"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total2', parseFloat(values.hoursWorked2 * values.hourlyWage2).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total2")}`} id="dateFrom2" name="total2" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom3")}`} id="dateFrom3" name="dateFrom3"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateTo3")}`} id="dateTo3" name="dateTo3"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked3")}`} id="dateFrom3" name="hoursWorked3"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total3', parseFloat(values.hoursWorked3 * values.hourlyWage3).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage3")}`} id="dateFrom3" name="hourlyWage3"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total3', parseFloat(values.hoursWorked3 * values.hourlyWage3).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total3")}`} id="dateFrom3" name="total3" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom4")}`} id="dateFrom4" name="dateFrom4"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateTo4")}`} id="dateTo4" name="dateTo4"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked4")}`} id="hoursWorked4" name="hoursWorked4"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total4', parseFloat(values.hoursWorked4 * values.hourlyWage4).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage4")}`} id="hourlyWage4" name="hourlyWage4"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total4', parseFloat(values.hoursWorked4 * values.hourlyWage4).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total4")}`} id="total4" name="total4" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateFrom5")}`} id="dateFrom5" name="dateFrom5"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><DatePickerField className={`form-control ${feedBackClassName(errors, touched, "dateTo5")}`} id="dateTo5" name="dateTo5"
                                                        minDate={values.periodStart1} maxDate={values.periodStart2} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hoursWorked5")}`} id="hoursWorked5" name="hoursWorked5"
                                                        onBlur={() => { this.setHoursTotal(setFieldValue, values, 'total5', parseFloat(values.hoursWorked5 * values.hourlyWage5).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "hourlyWage5")}`} id="hourlyWage5" name="hourlyWage5"
                                                        onBlur={() => { this.setWageTotal(setFieldValue, values, 'total5', parseFloat(values.hoursWorked5 * values.hourlyWage5).toFixed(2)) }} /></td>
                                                    <td><Field className={`form-control ${feedBackClassName(errors, touched, "total5")}`} id="total5" name="total5" disabled /></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="4" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        <b>Total employer portion of Mandatory Employment Related Costs (EI, CPP, WorkSafeBC, Vacation Pay).</b>
                                                        <span
                                                            style={{ color: "red" }}>*</span>
                                                    </td>
                                                    <td>
                                                        <Field className={`form-control ${feedBackClassName(errors, touched, "totalMERCs")}`} id="totalMERCs" name="totalMERCs" />
                                                    </td>
                                                </tr>


                                                {/* <tr>
                                                    <td style={{ verticalAlign: "middle" }}><b>Total</b></td>
                                                    <td><Field className="form-control" id="hoursWorkedTotal1" name="hoursWorkedTotal1"
                                                        disabled /></td>
                                                    <td><Field className="form-control" id="hourlyWageTotal1" name="hourlyWageTotal1"
                                                        disabled /></td>
                                                    <td><Field className="form-control" id="totalTotal1" name="totalTotal1"
                                                        disabled /></td>
                                                </tr> */}

                                            </tbody>
                                        </table>
                                        <div className="form-group">
                                            <label className="col-form-label control-label" htmlFor="clientIssues1">Provide a summary of the job activities that have taken place since last claim form; include employee’s progress and any issues if applicable.
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
                                        <hr></hr>
                                        <div className="form-group">
                                            <label className="col-form-label control-label" htmlFor="workbcCentre">Please select the WorkBC Centre to submit your claim to: <span
                                                style={{ color: "red" }}>*</span></label>
                                            <Field
                                                as="select"
                                                className={`form-control ${feedBackClassName(errors, touched, "workbcCentre")}`}
                                                id="workbcCentre"
                                                name="workbcCentre"
                                            >
                                                <option value="00">Please select</option>
                                                {
                                                    pins.features.map((item, index) =>
                                                        
                                                        <option 
                                                            value={`${item.properties.catchmentId}-${index}`}
                                                            key={index}
                                                        >
                                                            {item.properties.name}
                                                        </option>
                                                    )
                                                }
                                            </Field>
                                            {feedBackInvalid(errors, touched, "workbcCentre")}
                                        </div>
                                        <hr></hr>
                                        <div className="form-inline">
                                                
                                        <p className="control-label">I <Field className={`form-control ${feedBackClassName(errors, touched, "signatory1")}`} id="signatory1" name="signatory1" placeholder="Full Name" /> certify that the information is true and correct to the best of my knowledge and claimed in accordance with the Wage Subsidy Work Experience Agreement.<span style={{ color: "red" }}>*</span></p>
                                            {feedBackInvalid(errors, touched, "signatory1")}
                                        </div>
                                        <div className="form-group">
                                            {this.showErrors(errors,submitCount)}
                                            <div className="alert alert-primary" role="alert">
                                                As per your Wage Subsidy agreement, after submitting a claim form send supporting documents, including time sheets and payroll information to your WorkBC Centre.  For more information, contact your <a href="https://www.workbc.ca/Employment-Services/WorkBC-Centres/Find-Your-WorkBC-Centre.aspx" target="_blank" rel="noopener noreferrer">WorkBC Centre</a>.
                                            </div>
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