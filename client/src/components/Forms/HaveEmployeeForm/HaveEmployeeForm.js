import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Formik, Form} from 'formik'
import '../../../utils/polyfills'
import {customAlphabet} from 'nanoid'
import FormStep1 from '../shared/FormStep1'
import FormStep2 from '../shared/FormStep2'
import FormStep3 from '../shared/FormStep3'
import HaveEmployeeStep2 from './HaveEmployeeStep2'
import ProgressTracker from '../shared/ProgressTracker'
import {HaveEmployeeValidationSchema} from './HaveEmployeeValidationSchema'
import { FORM_URL } from '../../../constants/form'
import { generateAlert } from '../shared/Alert'

class HaveEmployeeForm extends Component {
    constructor(){
        super()
        const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz',10)
        this.state={
            _csrf: '',
            currentStep: 1,
            _id: nanoid(),
            hasError: false
        }
        this._next = this._next.bind(this)
        this._prev = this._prev.bind(this)
    }

    componentDidMount() {
        fetch(FORM_URL.haveEmployeeForm, {
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

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.history.push('/thankyou')
    }

    _next() {
        this.setState( prevState => {
            return {
                currentStep: prevState.currentStep >= 2 ? 3 : prevState.currentStep + 1
            }
        })
    }

    _prev() {
        this.setState( prevState => {
            return {
                currentStep: prevState.currentStep <= 1 ? 1 : prevState.currentStep - 1 
            } 
        })
    }


    get previousButton(){
        let currentStep = this.state.currentStep;
        if(currentStep !== 1){
          return (
            <button 
              className="btn btn-secondary" 
              type="button" onClick={this._prev}>
            Previous
            </button>
          )
        }
        return null;
    }

    nextButton(ca){
        let currentStep = this.state.currentStep;

        if(currentStep < 3){
          return (
            <button 
              className="btn btn-primary float-right" 
              type="button" 
              onClick={this._next}
              disabled={ca === "" || this.state.hasError}
            >
            Next
            </button>        
          )
        }
        return null;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h2>Identified Employee Form</h2>
                    <div className="col-md-12">
                        <ProgressTracker currentStep={this.state.currentStep}/>
                        {this.state.hasError && (
                            generateAlert("alert-danger","An error has occurred, please refresh the page. If the error persists, please try again later.")
                        )}
                        <Formik
                            initialValues= {{
                                    _csrf: this.state._csrf,
                                    _id: this.state._id,
                                    _bEmailDomain: "",
                                    _ca: "",
                                    //step 1
                                    workingWithWorkBCCentre: "",
                                    workbcCentre: "",
                                    operatingName:"",
                                    businessNumber:"",
                                    businessAddress:"",
                                    businessCity:"",
                                    businessProvince:"",
                                    businessPostal:"",
                                    businessPhone:"",
                                    businessFax:"",
                                    businessEmail:"",
                                    otherWorkAddress: false,
                                    sectorType:"",
                                    typeOfIndustry:"",
                                    organizationSize:"",
                                    cewsParticipation:"",
                                    employeeDisplacement:"",
                                    labourDispute:"",
                                    unionConcurrence:"",
                                    liabilityCoverage:"",
                                    wageSubsidy:"",
                                    WSBCCoverage:"",
                                    lawCompliance: false,
                                    eligibility: false,

                                    //step 1:pop-up fields
                                    employeesClaimed:"",
                                    WSBCNumber:"",
                                    addressAlt:"",
                                    cityAlt:"",
                                    provinceAlt:"BC",
                                    postalAlt:"",
                                    //step 2
                                    operatingName0: "",
                                    operatingName1: "",
                                    operatingName2: "",
                                    operatingName3: "",
                                    operatingName4: "",
                                    numberOfPositions0: "0",
                                    numberOfPositions1: "0",
                                    numberOfPositions2: "0",
                                    numberOfPositions3: "0",
                                    numberOfPositions4: "0",
                                    position0Email0:"",
                                    position0Email1:"",
                                    position0Email2:"",
                                    position0Email3:"",
                                    position0Email4:"",
                                    position1Email0:"",
                                    position1Email1:"",
                                    position1Email2:"",
                                    position1Email3:"",
                                    position2Email0:"",
                                    position2Email1:"",
                                    position2Email2:"",
                                    position3Email0:"",
                                    position3Email1:"",
                                    position4Email0:"",
                                    checkPositionInstances: "0",
                                    startDate0:"",
                                    startDate1:"",
                                    startDate2:"",
                                    startDate3:"",
                                    startDate4:"",
                                    hours0:"",
                                    hours1:"",
                                    hours2:"",
                                    hours3:"",
                                    hours4:"",
                                    wage0:"",
                                    wage1:"",
                                    wage2:"",
                                    wage3:"",
                                    wage4:"",
                                    duties0:"",
                                    duties1:"",
                                    duties2:"",
                                    duties3:"",
                                    duties4:"",
                                    skills0:"",
                                    skills1:"",
                                    skills2:"",
                                    skills3:"",
                                    skills4:"",
                                    workExperience0:"",
                                    workExperience1:"",
                                    workExperience2:"",
                                    workExperience3:"",
                                    workExperience4:"",
                                    //step 3
                                    signatoryTitle:"",
                                    signatory1:"",
                                    organizationConsent: false,
    


                            }}
                            enableReinitialize={true}
                            validationSchema={HaveEmployeeValidationSchema}
                            onSubmit={(values, {resetForm, setErrors, setStatus, setSubmitting }) => {
                                
                                fetch(FORM_URL.haveEmployeeForm, {
                                    method: "POST",
                                    credentials: 'include',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type':'application/json',
                                    },
                                    body: JSON.stringify(values),
                                })
                                
                                    .then(res => res.json())
                                    .then(
                                        resp => {
                                            //console.log(resp)

                                            if (resp.err){
                                                //console.log("errors", resp)
                                                alert("Please review your form, a field is incomplete.")
                                                setSubmitting(false)
                                                setErrors(resp.err)

                                            } else if(resp.emailErr){
                                                //console.log("emailError", resp)
                                                setSubmitting(false)
                                                this.setState({
                                                    hasError: true
                                                })
                                            } 
                                            else if (resp.ok){
                                                setSubmitting(false)
                                                this.props.history.push('/thankYouHaveEmployee',values)
                                            }
                                        }
                                    )
                                
                                
                            }}
                        
                        >
                            { props => ( 
                                <Form>
                                    {
                                        this.state.currentStep === 1 && (
                                            <div className="alert alert-primary alert-dismissible fade show" role="alert">
                                                    You will need to submit your identified job seeker email in step 2.
                                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            )
                                    }
                                    <FormStep1 
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    <FormStep2
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    <HaveEmployeeStep2
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                     <FormStep3
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    {this.previousButton}
                                    {this.nextButton(props.values._ca)}

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>


            )
        }
}
export default withRouter(HaveEmployeeForm);