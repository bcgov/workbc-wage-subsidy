import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Formik, Form} from 'formik'
import '../../../utils/polyfills'
import {nanoid} from 'nanoid'


import FormStep1 from '../shared/FormStep1'
import FormStep2 from '../shared/FormStep2'
import FormStep3 from '../shared/FormStep3'
import NeedEmployeeStep2 from './NeedEmployeeStep2'
import ProgressTracker from '../shared/ProgressTracker'
import {NeedEmployeeValidationSchema} from './NeedEmployeeValidationSchema'
import { FORM_URL } from '../../../constants/form'
import { generateAlert } from '../shared/Alert'

class NeedEmployeeForm extends Component {
    constructor(){
        super()
        this.state={
            currentStep: 1,
            _id: nanoid(10)
        }
        this._next = this._next.bind(this)
        this._prev = this._prev.bind(this)
    }

    componentDidMount() {
        fetch(FORM_URL.needEmployeeForm, {
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

    get nextButton(){
        let currentStep = this.state.currentStep;

        if(currentStep < 3){
          return (
            <button 
              className="btn btn-primary float-right" 
              type="button" onClick={this._next}>
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
                    <div className="col-md-12">
                        <ProgressTracker currentStep={this.state.currentStep}/>
                        {this.state.hasError && (
                            generateAlert("alert-danger", "An error has occurred, please refresh the page. If the error persists, please try again later.")
                        )}
                        <Formik
                            initialValues= {{
                                            _id: this.state._id,
                                            //step 1
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
                                            organizationConsent:""
    


                            }}
                            validationSchema={NeedEmployeeValidationSchema}
                            onSubmit={(values, actions) => {
                                let jsonVals = JSON.stringify(values);
                                console.log("jsonVals look like this:", jsonVals);
                                fetch(FORM_URL.needEmployeeForm, {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body: jsonVals,
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
                                                this.props.history.push('/thankyouNeedEmployee', values);
                                            }
                                        }
                                    )).catch(err => console.log(err));

                            }}
                        
                        >
                            {props => (
                                <Form>
                                    {console.log(props)}
                                    <FormStep1 
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    <FormStep2
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    <NeedEmployeeStep2
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    <FormStep3
                                        currentStep={this.state.currentStep}
                                        {...props}
                                    />
                                    {this.previousButton}
                                    {this.nextButton}

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>


            )
        }
}
export default withRouter(NeedEmployeeForm);