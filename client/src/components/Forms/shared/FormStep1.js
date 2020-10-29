import React, { Component } from 'react'
import {Field} from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import {getCatchment} from '../shared/AddressToCatchment'

class FormStep1 extends Component {

    componentDidUpdate(prevProps){
        console.log(prevProps.values.businessAddress)
        let address1 = this.props.values.businessAddress
        let city = this.props.values.businessCity
        console.log(city)
        console.log(address1)
        console.log(this.props.values.businessPostal)
        let province = "BC"
        if (address1 !== "" || city !== "" || this.props.values.businessPostal !== ""){
            if (city.length > 3 && address1.length > 4 && this.props.values.businessPostal.length >= 6){
                if (address1 !== prevProps.values.businessAddress || city !== prevProps.values.businessCity || this.props.values.businessPostal !== prevProps.values.businessPostal){
                    fetch(`https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=${address1},${city},${province}`,{
                    })
                    .then(res => res.json())
                    .then(result => {
                        console.log(result)
                        let coordinates = result.features[0].geometry.coordinates
                        let ca = getCatchment(coordinates[1],coordinates[0])
                        console.log(ca)
                        this.props.setFieldValue("_ca",ca)
                    })
                }
            }
        }
    }

    get WageSubsidyEmployees() {
        let subsidy = this.props.values.wageSubsidy;
        if (subsidy === "yes") {
            return (
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="col-form-label control-label" htmlFor="employeesClaimed">How Many Employees is WorkBC currently Subsidizing?<span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "employeesClaimed")}`}
                            id="EmployeesClaimed" 
                            name="claims" 
                        >
                            <option value="">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </Field>
                        {feedBackInvalid(this.props.errors,this.props.touched,"employeesClaimed")}
                    </div>
                    <p>Note: an employer may have a maximum of 5 active wage subsidy agreements at one time and a maximum of 10 wage subsidy agreements per year</p>
                </div>

            )
        }
       return null;
    }
    get WorkSafeCoverage() {
        let Coverage = this.props.values.WSBCCoverage;
        if (Coverage === "yes") {
            return (
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="col-form-label control-label" htmlFor="WSBCNumber">WorkSafe BC Number <span
                        style={{ color: "red" }}>*</span></label>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "WSBCNumber")}`} id="WSBCNumber" name="WSBCNumber"/>
                        {feedBackInvalid(this.props.errors,this.props.touched,"WSBCNumber")}
                    </div>
                </div>

            )
        }
       return null;
    }
    get workAddressForm(){
        if(this.props.values.otherWorkAddress){
            return(<div>
                <div className="form-group">
                    <br /><h2 id="forms">Work Place Information (If different from address above)</h2>
                    <p>Please complete a separate application for each work place</p>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="addressAlt">Work Address <span
                        style={{ color: "red" }}>*  </span></label>
                    <small className="text-muted" id="address-alt">  123 Main St.</small>
                    <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "addressAlt")}`} id="addressAlt" name="addressAlt" />
                    {feedBackInvalid(this.props.errors,this.props.touched,"address-alt")}
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="cityAlt">City / Town <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "cityAlt")}`} id="cityAlt" name="cityAlt" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"cityAlt")}
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="provinceAlt">Province <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "provinceAlt")}`}
                            id="provinceAlt" 
                            name="provinceAlt" 
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
                        {feedBackInvalid(this.props.errors,this.props.touched,"provinceAlt")}
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="postalAlt">Postal Code <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="postalAlt">  V0R2V5</small>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "postalAlt")}`} id="postalAlt" name="postalAlt" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"postalAlt")}
                    </div>
                </div>
            </div>)
        }
        return null;
    }
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
                <div className="form-row">
                    <div className="form-group col-md-8">
                        <label className="col-form-label control-label" htmlFor="operatingName">Organization Name <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "operatingName")}`} id="operatingName" name="operatingName" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"operatingName")}
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessNumber">CRA Business Number <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessNumber")}`} id="businessNumber" name="businessNumber" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessNumber")}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor="businessAddress">Address <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="businessAddress">  123 Main St.</small>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessAddress")}`} id="businessAddress" name="businessAddress" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessAddress")}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessCity">City / Town <span
                            style={{ color: "red" }}>*</span></label>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessCity")}`} id="businessCity" name="businessCity" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessCity")}
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessProvince">Province <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessProvince")}`}
                            id="businessProvince" 
                            name="businessProvince" 
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
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessProvince")}
                    </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessPostal">Postal Code <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="businessPostal">  V0R2V5</small>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessPostal")}`} id="businessPostal" name="businessPostal" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessPostal")}
                    </div>
                </div>
                {this.props.values.businessProvince !== "BC" && <p>Please note that the workplace must be based in BC.</p>}
                {this.props.values._ca !== "" && <p>CA: {this.props.values._ca}</p>}
                <div className="form-row">
                    <div className="form-group col-md-4">
                            <label className="col-form-label control-label" htmlFor="businessPhone">Phone Number <span
                                style={{ color: "red" }}>*</span></label>
                            <small className="text-muted" id="businessPhone">  250-555-5555</small>
                            <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessPhone")}`} id="businessPhone" name="businessPhone" />
                            {feedBackInvalid(this.props.errors,this.props.touched,"businessPhone")}
                    </div>
                    <div className="form-group col-md-4">
                            <label className="col-form-label control-label" htmlFor="businessFax">Fax </label>
                            <small className="text-muted" id="businessFax"> 1-250-555-5555</small>
                            <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessFax")}`} id="businessFax" name="businessFax" />
                            {feedBackInvalid(this.props.errors,this.props.touched,"businessFax")}
                        </div>
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessEmail">Email Address <span
                                style={{ color: "red" }}>*</span></label>
                        <small className="text-muted" id="businessEmail">  someone@example.com</small>
                        <Field className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessEmail")}`} id="businessEmail" name="businessEmail" />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessEmail")}
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <Field type="checkbox" className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "otherWorkAddress")}`} id="otherWorkAddress" name="otherWorkAddress"/>
                        {feedBackInvalid(this.props.errors,this.props.touched,"otherWorkAddress")}
                        <label 
                            className="form-check-label" 
                            htmlFor="otherWorkAddress"
                        >
                        My organization's Workplace address is different than the organization's Business address.
                        </label>
                    </div>
                </div>
                {this.workAddressForm}
                <div className="form-row">
                    <div className="form-group col-md-6" id="SectorType">
                        <label className="col-form-label control-label" htmlFor="sectorType">Type of Sector: <span
                        style={{ color: "red" }}>*</span></label>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "sectorType")}`}
                                type="radio"
                                name="sectorType"
                                value="Private"
                            />
                            <label className="form-check-label" htmlFor="sectorTypePrivate">Private</label>
                        </div>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "sectorType")}`}
                                type="radio"
                                name="sectorType"
                                value="Non-Profit"
                            />
                            <label className="form-check-label" htmlFor="sectorTypeNon-Profit">Non-Profit</label>
                        </div>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "sectorType")}`}
                                type="radio"
                                name="sectorType"
                                value="Public"
                            />
                            
                            <label className="form-check-label" htmlFor="sectorTypePublic">Public</label>
                            {feedBackInvalid(this.props.errors,this.props.touched,"sectorType")}
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="col-form-label control-label" htmlFor="typeOfIndustry">Type of Industry <span
                            style={{ color: "red" }}>*</span></label>
                        <Field
                            as="select"
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "typeOfIndustry")}`}
                            id="typeOfIndustry" 
                            name="typeOfIndustry" 
                        >
                            <option value="">Please select</option>
                            <option value="Primary">Primary(Including Agriculture)</option>
                            <option value="Service">Service</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Other">Other</option>
                        </Field>
                        {feedBackInvalid(this.props.errors,this.props.touched,"typeOfIndustry")}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6" id="organizationSize">
                        <label className="col-form-label control-label" htmlFor="organizationSize">Size of Organization(number of employees) <span
                        style={{ color: "red" }}>*</span></label>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "organizationSize")}`}
                                type="radio"
                                name="organizationSize"
                                value="1-49"
                            />
                            <label className="form-check-label"  htmlFor="organizationSize">1-49</label>
                        </div>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "organizationSize")}`}
                                type="radio"
                                name="organizationSize"
                                value="49-499"
                            />
                            <label className="form-check-label"  htmlFor="organizationSize">49-499</label>
                        </div>
                        <div className="form-check">
                            <Field
                                className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "organizationSize")}`}
                                type="radio"
                                name="organizationSize"
                                value="500+"
                            />
                            <label className="form-check-label"  htmlFor="organizationSize">500+</label>
                            {feedBackInvalid(this.props.errors,this.props.touched,"organizationSize")}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="cewsParticipation">Are you actively participating in the Canada Emergency Wage Subsidy program? <span
                        style={{ color: "red" }}>*</span> </label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "cewsParticipation")}`}
                            type="radio"
                            name="cewsParticipation"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="cewsParticipation">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "cewsParticipation")}`}
                            type="radio"
                            name="cewsParticipation"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="cewsParticipation">no</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "cewsParticipation")}`}
                            type="radio"
                            name="cewsParticipation"
                            value="notSure"
                        />
                        <label className="form-check-label" htmlFor="cewsParticipation">not sure</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"cewsParticipation")}
                    </div>
                    {
                            this.props.cewsParticipation === "yes" &&
                            <small className="text-danger">An employee may only be subsidized by WorkBC if that employee is not subsidized under CEWS. Employees subsidized by CEWS are not eligible for WorkBC Wage Subsidy.</small>
                    }
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="employeeDisplacement">Will the subsidy result in the displacement of existing employees or volunteers? <span
                        style={{ color: "red" }}>*</span> </label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "employeeDisplacement")}`}
                            type="radio"
                            name="employeeDisplacement"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="employeeDisplacement">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "employeeDisplacement")}`}
                            type="radio"
                            name="employeeDisplacement"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="employeeDisplacement">no</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"employeeDisplacement")}
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="labourDispute">Is there a labour stoppage or labour - management dispute in progress? <span
                        style={{ color: "red" }}>*</span></label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "labourDispute")}`}
                            type="radio"
                            name="labourDispute"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="labourDispute">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "labourDispute")}`}
                            type="radio"
                            name="labourDispute"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="labourDispute">no</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"labourDispute")}
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="unionConcurrence">Is there Union concurrence? <span
                        style={{ color: "red" }}>*</span></label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "unionConcurrence")}`}
                            type="radio"
                            name="unionConcurrence"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="unionConcurrence">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "unionConcurrence")}`}
                            type="radio"
                            name="unionConcurrence"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="unionConcurrence">no</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "unionConcurrence")}`}
                            type="radio"
                            name="unionConcurrence"
                            value="N/A"
                        />
                        <label className="form-check-label" htmlFor="unionConcurrence">N/A</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"unionConcurrence")}
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="liabilityCoverage">Does your organization have 3rd Party liability coverage? <span
                        style={{ color: "red" }}>*</span></label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "liabilityCoverage")}`}
                            type="radio"
                            name="liabilityCoverage"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="liabilityCoverage">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "liabilityCoverage")}`}
                            type="radio"
                            name="liabilityCoverage"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="liabilityCoverage">no</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"liabilityCoverage")}
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="wageSubsidy">Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement? <span
                        style={{ color: "red" }}>*</span> </label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "wageSubsidy")}`}
                            type="radio"
                            name="wageSubsidy"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="wageSubsidy">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "wageSubsidy")}`}
                            type="radio"
                            name="wageSubsidy"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="wageSubsidy">no</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"wageSubsidy")}
                    </div>
                </div>
                {this.WageSubsidyEmployees}

                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="WSBCCoverage">Do you have WorkSafe BC coverage? <span
                        style={{ color: "red" }}>*</span></label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "WSBCCoverage")}`}
                            type="radio"
                            name="WSBCCoverage"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="WSBCCoverage">yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "WSBCCoverage")}`}
                            type="radio"
                            name="WSBCCoverage"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="WSBCCoverage">no</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"WSBCCoverage")}
                    </div>
                </div>
                {this.WorkSafeCoverage}
                <div className="form-group">
                    <div className="form-check">
                        <Field type="checkbox" className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "eligibility")}`} id="eligibility" name="eligibility"/>
                        <label 
                            className="form-check-label control-label" 
                            htmlFor="eligibility"
                        >
                        <span style={{ color: "red" }}>*</span> {this.props.values.operatingName} confirms that they have reviewed the employer eligibility criteria and they meets the eligibility requirements. 
                        {feedBackInvalid(this.props.errors,this.props.touched,"eligibility")}
                        </label>
                        
                    </div>
                </div>

            </div>
        )
    }


}

export default FormStep1