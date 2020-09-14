import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Formik, Form} from 'formik'
import '../../../utils/polyfills'
import {nanoid} from 'nanoid'


import FormStep1 from '../shared/FormStep1'
import FormStep2 from '../shared/FormStep2'
import FormStep3 from './FormStep3'
import ProgressTracker from '../shared/ProgressTracker'

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

                                            //step 2

                                            //step 3
    


                            }}
                            onSubmit={(values, actions) => {
                                actions.setSubmitting(false);
                                this.props.history.push('/thankyou')
                            }}
                        
                        >
                            {({values}) => (
                                <Form>
                                    {console.log(values)}
                                    <FormStep1 
                                        currentStep={this.state.currentStep}
                                        {...values}
                                    />
                                    <FormStep2
                                        currentStep={this.state.currentStep}
                                        {...values}
                                    />
                                    <FormStep3
                                        currentStep={this.state.currentStep}
                                        {...values}
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