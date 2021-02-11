import React, { Component } from 'react'
import {Field} from 'formik'
import { feedBackClassName, feedBackInvalid } from '../shared/ValidationMessages'
import {getCatchment} from '../shared/AddressToCatchment'
import { pins } from '../../../constants/pins'

class FormStep1 extends Component {

    constructor(){
        super()
        this.state = {
            validatedClick: false,
            addressValidated: false,
            validAddress: ''
        }
    }
    /*
    componentDidUpdate(prevProps){
        let address1, city, postal,prevAddress1,prevCity,prevPostal,province,prevProvince
        if (this.props.values.otherWorkAddress) {
            address1 = this.props.values.addressAlt
            city = this.props.values.cityAlt
            postal = this.props.values.postalAlt
            province = this.props.values.provinceAlt
            prevAddress1 = prevProps.values.addressAlt
            prevCity = prevProps.values.cityAlt
            prevPostal = prevProps.values.postalAlt
            prevProvince = prevProps.values.provinceAlt
        } else {
            address1 = this.props.values.businessAddress
            city = this.props.values.businessCity
            postal = this.props.values.businessPostal
            province = this.props.values.businessProvince
            prevAddress1 = prevProps.values.businessAddress
            prevCity = prevProps.values.businessCity
            prevPostal = prevProps.values.businessPostal
            prevProvince = prevProps.values.businessProvince
        }
        if (province !== "BC"){
            return
        }
        if (address1 !== "" || city !== "" || postal !== ""){
            if (city.length > 3 && address1.length > 4 && postal.length >= 6){
                if (address1 !== prevAddress1 || city !== prevCity || postal !== prevPostal || province !== prevProvince){
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
    */

    validateAddress = (e) => {
        e.preventDefault()
        this.setState({
            validatedClick: true
        })
        let address1, city, postal,province
        if (this.props.values.otherWorkAddress) {
            address1 = this.props.values.addressAlt
            city = this.props.values.cityAlt
            postal = this.props.values.postalAlt
            province = this.props.values.provinceAlt
        } else {
            address1 = this.props.values.businessAddress
            city = this.props.values.businessCity
            postal = this.props.values.businessPostal
            province = this.props.values.businessProvince
        }
        if (province !== "BC"){
            return
        }
        if (address1 !== "" || city !== "" || postal !== ""){
            if (city.length > 3 && address1.length > 4 && postal.length === 6){
                fetch(`https://geocoder.api.gov.bc.ca/addresses.geojson?addressString=${address1},${city},${province}`,{
                })
                
                .then(res => res.json())
                .then(result => {
                    //console.log(result.features[0].properties.score)
                    //console.log((postal.match(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/)).length)
                    if (result.features[0].properties.score < 65 || (postal.match(/^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/)).length === 0 ){
                        this.setState({
                            addressValidated: false
                        })
                        return
                    }
                    //console.log(result)
                    let coordinates = result.features[0].geometry.coordinates
                    let ca = getCatchment(coordinates[1],coordinates[0])
                    //console.log(ca)
                    
                    this.setState({
                        addressValidated: true,
                        validAddress: result.features[0].properties.fullAddress
                    })
                    if (this.props.values.workingWithWorkBCCentre === "yes"){
                        this.props.setFieldValue("_ca",this.props.values.workbcCentre.substring(0,2))
                    } else {
                        this.props.setFieldValue("_ca",ca)
                    }
                    return
                })
                return
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
                            id="employeesClaimed" 
                            name="employeesClaimed" 
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
                        <small className="text-muted" id="WSBCNumber">  Expected format: BCXXXXXXXXX</small>
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
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "provinceAlt")}`}
                            id="provinceAlt" 
                            name="provinceAlt" 
                            disabled
                        >
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
                <div className="btn-group">
                    <button 
                        className="btn btn-success d-print-none" 
                        onClick={this.validateAddress}
                        disabled={this.props.values.addressAlt.length < 4 || this.props.values.cityAlt.length < 3 || this.props.values.postalAlt.length < 6 || this.props.values.workingWithWorkBCCentre === "" || ( this.props.values.workingWithWorkBCCentre === "yes" && (this.props.values.workbcCentre === "00" || this.props.values.workbcCentre === ""))}
                    >
                        Validate Address
                    </button>
                    <p className="pl-3 pt-3"><span style={{ color: "red" }}>*</span> Validation required to continue.</p>
                </div>
                {this.state.addressValidated && <p className="text-success">Address validated as: {this.state.validAddress}</p>}
                {(!this.state.addressValidated && this.state.validatedClick && this.props.values.otherWorkAddress) && <p className="text-danger">Address could not be validated, please verify your address.</p>}
                {(this.props.values._ca !== "" && this.props.values.otherWorkAddress) && <p>CA: {this.props.values._ca}</p>}
            </div>)
        }
        return null;
    }
    get handleWorkingWithCentre(){
        if (this.props.values.workingWithWorkBCCentre === "yes"){
            return (
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="workbcCentre">Please select the WorkBC Centre you are working with: <span
                        style={{ color: "red" }}>*</span></label>
                    <Field
                        as="select"
                        className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "workbcCentre")}`}
                        id="workbcCentre"
                        name="workbcCentre"
                        onChange={e => {
                            this.props.handleChange(e)
                            this.props.setFieldValue("_ca","")
                            if (this.state.addressValidated){
                                this.setState({
                                    addressValidated: false
                                })
                            }
                        }}
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
                    {feedBackInvalid(this.props.errors, this.props.touched, "workbcCentre")}
                </div>
            )            
        } else if (this.props.values.workingWithWorkBCCentre === "no") {
            return (
                <p>You will be matched to the closest WorkBC Centre to the workplace address.</p>
            )
        } else {
            return null;
        }
    }
    render() {
        if (this.props.currentStep !== 1) {
            return null
        }
        //Else return step 1
        return (

            <div>
                <p>
                    If you are having difficulty completing the application for Wage Subsidy, please contact your local <a href="https://www.workbc.ca/Employment-Services/WorkBC-Centres/Find-Your-WorkBC-Centre.aspx" target="_blank" rel="noopener noreferrer">WorkBC office</a>, 
                    an application guide is also available <a href="https://www.workbc.ca/getmedia/3532dbe8-f084-4022-bd3c-8f9ebe422fa4/WS-Guide.aspx" target="_blank" rel="noopener noreferrer">here</a>.
                </p>
                <div className="form-group">
                    <h2 id="forms">Business Information</h2>
                </div>
                <div className="form-group">
                    <label className="col-form-label control-label" htmlFor="workingWithWorkBCCentre">Are you currently working with a WorkBC Centre? <span
                        style={{ color: "red" }}>*</span> </label>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "workingWithWorkBCCentre")}`}
                            type="radio"
                            name="workingWithWorkBCCentre"
                            value="yes"
                        />
                        <label className="form-check-label" htmlFor="workingWithWorkBCCentre">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "workingWithWorkBCCentre")}`}
                            type="radio"
                            name="workingWithWorkBCCentre"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="workingWithWorkBCCentre">No</label>
                        {feedBackInvalid(this.props.errors,this.props.touched,"workingWithWorkBCCentre")}
                    </div>
                </div>
                {this.handleWorkingWithCentre}
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
                <p><b>Note:</b> If your workplace address is different from your business address please check the box below to provide it.</p>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label className="col-form-label control-label" htmlFor="businessAddress">Address <span
                            style={{ color: "red" }}>*  </span></label>
                        <small className="text-muted" id="businessAddress">  123 Main St.</small>
                        <Field 
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessAddress")}`} 
                            id="businessAddress" 
                            name="businessAddress"
                            onChange={e => {
                                this.props.handleChange(e)
                                this.props.setFieldValue("_ca","")
                                if (this.state.addressValidated){
                                    this.setState({
                                        addressValidated: false
                                    })
                                }
                            }} 
                        />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessAddress")}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label className="col-form-label control-label" htmlFor="businessCity">City / Town <span
                            style={{ color: "red" }}>*</span></label>
                        <Field 
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessCity")}`} 
                            id="businessCity" 
                            name="businessCity"
                            onChange={e => {
                                this.props.handleChange(e)
                                this.props.setFieldValue("_ca","")
                                if (this.state.addressValidated){
                                    this.setState({
                                        addressValidated: false
                                    })
                                }
                            }} 
                        />
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
                            onChange={e => {
                                this.props.handleChange(e)
                                this.props.setFieldValue("_ca","")
                                if (this.state.addressValidated){
                                    this.setState({
                                        addressValidated: false
                                    })
                                }
                            }} 
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
                        <Field 
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessPostal")}`} 
                            id="businessPostal" 
                            name="businessPostal"
                            onChange={e => {
                                this.props.handleChange(e)
                                this.props.setFieldValue("_ca","")
                                if (this.state.addressValidated){
                                    this.setState({
                                        addressValidated: false
                                    })
                                }
                            }}  
                        />
                        {feedBackInvalid(this.props.errors,this.props.touched,"businessPostal")}
                    </div>
                </div>
                {
                (!this.props.values.otherWorkAddress && (this.props.values.businessProvince === "BC" || this.props.values.businessProvince === "")) &&
                <div className="btn-group">
                    <button 
                        className="btn btn-success d-print-none" 
                        onClick={this.validateAddress}
                        disabled={this.props.values.businessAddress.length < 4 || this.props.values.businessCity.length < 3 || this.props.values.businessPostal.length < 6 || this.props.values.businessProvince !== "BC" || this.props.values.workingWithWorkBCCentre === "" || ( this.props.values.workingWithWorkBCCentre === "yes" && (this.props.values.workbcCentre === "00" || this.props.values.workbcCentre === ""))}
                    >
                        Validate Address
                    </button>
                    <p className="pl-3 pt-3"><span style={{ color: "red" }}>*</span> Validation required to continue.</p>
                </div>
                }
                <p className="small text-muted">Please note that the workplace must be located in BC, in order to be eligible.</p>
                {this.state.addressValidated  && !this.props.values.otherWorkAddress && <p className="text-success">Address validated as: {this.state.validAddress}</p>}
                {(!this.state.addressValidated && this.state.validatedClick  && !this.props.values.otherWorkAddress) && <p className="text-danger">Address could not be validated, please verify your address.</p>}
                {(this.props.values.businessProvince !== "BC" && this.props.values.businessProvince !== ""  && !this.props.values.otherWorkAddress) && <p className="text-danger">Please check the box below to provide the workplace address located in BC.</p>}
                {/*(this.props.values._ca !== "" && !this.props.values.otherWorkAddress) && <p>CA: {this.props.values._ca}</p>*/}
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
                        <label className="col-form-label control-label" htmlFor="businessEmail">Employer E-mail Address <span
                                style={{ color: "red" }}>*</span></label>
                        <small className="text-muted" id="businessEmail">  someone@example.com</small>
                        <Field 
                            className={`form-control ${feedBackClassName(this.props.errors, this.props.touched, "businessEmail")}`} 
                            id="businessEmail" 
                            name="businessEmail" 
                            onBlur={e => {
                                this.props.handleBlur(e)
                                if(!this.props.errors.businessEmail) {
                                    this.props.setFieldValue("_bEmailDomain", this.props.values.businessEmail.substring(this.props.values.businessEmail.lastIndexOf("@") + 1))
                                }
                            }}
                        />
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
                        {/*
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
                        */}
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
                                value="50-499"
                            />
                            <label className="form-check-label"  htmlFor="organizationSize">50-499</label>
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
                        <label className="form-check-label" htmlFor="cewsParticipation">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "cewsParticipation")}`}
                            type="radio"
                            name="cewsParticipation"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="cewsParticipation">No</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "cewsParticipation")}`}
                            type="radio"
                            name="cewsParticipation"
                            value="notSure"
                        />
                        <label className="form-check-label" htmlFor="cewsParticipation">Not sure</label>
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
                        <label className="form-check-label" htmlFor="employeeDisplacement">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "employeeDisplacement")}`}
                            type="radio"
                            name="employeeDisplacement"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="employeeDisplacement">No</label>
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
                        <label className="form-check-label" htmlFor="labourDispute">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "labourDispute")}`}
                            type="radio"
                            name="labourDispute"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="labourDispute">No</label>
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
                        <label className="form-check-label" htmlFor="unionConcurrence">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "unionConcurrence")}`}
                            type="radio"
                            name="unionConcurrence"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="unionConcurrence">No</label>
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
                        <label className="form-check-label" htmlFor="liabilityCoverage">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "liabilityCoverage")}`}
                            type="radio"
                            name="liabilityCoverage"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="liabilityCoverage">No</label>
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
                        <label className="form-check-label" htmlFor="wageSubsidy">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "wageSubsidy")}`}
                            type="radio"
                            name="wageSubsidy"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="wageSubsidy">No</label>
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
                        <label className="form-check-label" htmlFor="WSBCCoverage">Yes</label>
                    </div>
                    <div className="form-check">
                        <Field
                            className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "WSBCCoverage")}`}
                            type="radio"
                            name="WSBCCoverage"
                            value="no"
                        />
                        <label className="form-check-label" htmlFor="WSBCCoverage">No</label>
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
                        <span style={{ color: "red" }}>*</span> {this.props.values.operatingName} meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement. 
                        {feedBackInvalid(this.props.errors,this.props.touched,"eligibility")}
                        </label> 
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-check">
                        <Field type="checkbox" className={`form-check-input ${feedBackClassName(this.props.errors, this.props.touched, "lawCompliance")}`} id="lawCompliance" name="lawCompliance"/>
                        <label 
                            className="form-check-label control-label" 
                            htmlFor="lawCompliance"
                        >
                        <span style={{ color: "red" }}>*</span> {this.props.values.operatingName} certifies that it is in full compliance with all applicable laws, including the <span className="font-italic">Employment Standards Act</span>, the <span className="font-italic">Workers Compensation Act</span> and the <span className="font-italic">Human Rights Code</span>. 
                        {feedBackInvalid(this.props.errors,this.props.touched,"lawCompliance")}
                        </label> 
                    </div>
                </div>

            </div>
        )
    }


}

export default FormStep1