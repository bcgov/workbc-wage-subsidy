import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Formik, Form} from 'formik'
import '../../../utils/polyfills'
import {nanoid} from 'nanoid'


import FormStep1 from '../shared/FormStep1'
import FormStep2 from '../shared/FormStep2'
import FormStep3 from '../shared/FormStep3'
import HaveEmployeeStep2 from './HaveEmployeeStep2'
import ProgressTracker from '../shared/ProgressTracker'
import {HaveEmployeeValidationSchema} from './HaveEmployeeValidationSchema'

class HaveEmployeeForm extends Component {
    constructor(){
        super()
        this.state={
            currentStep: 1,
            _id: nanoid(10)
        }
        this._next = this._next.bind(this)
        this._prev = this._prev.bind(this)
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
                        <Formik
                            initialValues= {{
                                    _id: this.state._id,
                                    //step 1
                                    operatingName:"",
                                    businessNumber:"",
                                    address:"",
                                    city:"",
                                    province:"",
                                    postal:"",
                                    phone:"",
                                    fax:"",
                                    email:"",
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
                                    eligibility: false,

                                    //step 1:pop-up fields
                                    employeesClaimed:"",
                                    WSBCNumber:"",
                                    address_alt:"",
                                    city_alt:"",
                                    province_alt:"",
                                    postal_alt:"",
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
                                    //step 3
                                    signatoryTitle:"",
                                    signatory1:"",
                                    organizationConsent: false,
    


                            }}
                            validationSchema={HaveEmployeeValidationSchema}
                            onSubmit={(values, actions) => {
                                actions.setSubmitting(false);
                                this.props.history.push('/thankyou')
                            }}
                        
                        >
                            { props => (
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
                                    <HaveEmployeeStep2
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
export default withRouter(HaveEmployeeForm);