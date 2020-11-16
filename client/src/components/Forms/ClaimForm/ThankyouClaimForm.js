import React, { Component } from 'react';

class ThankyouClaimForm extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>The following information was received:</h1>
                        <br />
                        <hr />
                        <p><b>Period Claim Start: </b> {this.props.location.state !== undefined && (<span>{this.props.location.state.periodStart1.getDate()}/{this.props.location.state.periodStart1.getMonth() + 1}/{this.props.location.state.periodStart1.getFullYear()}</span>)}</p>
                        <p><b>Period Claim End: </b> {this.props.location.state !== undefined && (<span>{this.props.location.state.periodStart2.getDate()}/{this.props.location.state.periodStart2.getMonth() + 1}/{this.props.location.state.periodStart2.getFullYear()}</span>)}</p>
                        <p><b>Final Claim: </b>{this.props.location.state && this.props.location.state.isFinalClaim}</p>
                        <p><b>Employer Business Name: </b>{this.props.location.state && this.props.location.state.employerName}</p>
                        <p><b>Employer Contact: </b>{this.props.location.state && this.props.location.state.employerContact}</p>
                        <p><b>Employer Phone Number: </b>{this.props.location.state && this.props.location.state.employerPhone}</p>
                        <p><b>Address 1: </b>{this.props.location.state && this.props.location.state.employerAddress1}</p>
                        <p><b>Address 2: </b>{this.props.location.state && this.props.location.state.employerAddress2}</p>
                        <p><b>City: </b>{this.props.location.state && this.props.location.state.employerCity}</p>
                        <p><b>Postal Code: </b>{this.props.location.state && this.props.location.state.employerPostal}</p>
                        <p><b>Employee First Name: </b>{this.props.location.state && this.props.location.state.employeeFirstName}</p>
                        <p><b>Employee Last Name: </b>{this.props.location.state && this.props.location.state.employeeLastName}</p>
                        <h2>Work Period Information</h2>
                        <h3>1st Date</h3>
                        <p><b>Date From: </b>{this.props.location.state !== undefined && this.props.location.state.dateFrom1 && (<span>{this.props.location.state.dateFrom1.getDate()}/{this.props.location.state.dateFrom1.getMonth() + 1}/{this.props.location.state.dateFrom1.getFullYear()}</span>)}</p>
                        <p><b>Hours Worked: </b>{this.props.location.state && this.props.location.state.hoursWorked1}</p>
                        <p><b>Hourly Wage: </b>{this.props.location.state && this.props.location.state.hourlyWage1}</p>
                        <p><b>Total: </b>{this.props.location.state && this.props.location.state.total1}</p>
                        <div style={this.props.location.state && this.props.location.state.dateFrom2 ? {display: "block"} : {display: "none"}}>
                            <h3>2nd Date</h3>
                            <p><b>Date From: </b>{this.props.location.state !== undefined && this.props.location.state.dateFrom2 && (<span>{this.props.location.state.dateFrom2.getDate()}/{this.props.location.state.dateFrom2.getMonth() + 2}/{this.props.location.state.dateFrom2.getFullYear()}</span>)}</p>
                            <p><b>Hours Worked: </b>{this.props.location.state && this.props.location.state.hoursWorked2}</p>
                            <p><b>Hourly Wage: </b>{this.props.location.state && this.props.location.state.hourlyWage2}</p>
                            <p><b>Total: </b>{this.props.location.state && this.props.location.state.total2}</p>
                        </div>
                        <div style={this.props.location.state && this.props.location.state.dateFrom3 ? {display: "block"} : {display: "none"}}>
                            <h3>3rd Date</h3>
                            <p><b>Date From: </b>{this.props.location.state !== undefined && this.props.location.state.dateFrom3 && (<span>{this.props.location.state.dateFrom3.getDate()}/{this.props.location.state.dateFrom3.getMonth() + 3}/{this.props.location.state.dateFrom3.getFullYear()}</span>)}</p>
                            <p><b>Hours Worked: </b>{this.props.location.state && this.props.location.state.hoursWorked3}</p>
                            <p><b>Hourly Wage: </b>{this.props.location.state && this.props.location.state.hourlyWage3}</p>
                            <p><b>Total: </b>{this.props.location.state && this.props.location.state.total3}</p>
                        </div>
                        <div style={this.props.location.state && this.props.location.state.dateFrom4 ? {display: "block"} : {display: "none"}}>
                            <h3>4th Date</h3>
                            <p><b>Date From: </b>{this.props.location.state !== undefined && this.props.location.state.dateFrom4 && (<span>{this.props.location.state.dateFrom4.getDate()}/{this.props.location.state.dateFrom4.getMonth() + 4}/{this.props.location.state.dateFrom4.getFullYear()}</span>)}</p>
                            <p><b>Hours Worked: </b>{this.props.location.state && this.props.location.state.hoursWorked4}</p>
                            <p><b>Hourly Wage: </b>{this.props.location.state && this.props.location.state.hourlyWage4}</p>
                            <p><b>Total: </b>{this.props.location.state && this.props.location.state.total4}</p>
                        </div>
                        <div style={this.props.location.state && this.props.location.state.dateFrom5 ? {display: "block"} : {display: "none"}}>
                            <h3>5th Date</h3>
                            <p><b>Date From: </b>{this.props.location.state !== undefined && this.props.location.state.dateFrom5 && (<span>{this.props.location.state.dateFrom5.getDate()}/{this.props.location.state.dateFrom5.getMonth() + 5}/{this.props.location.state.dateFrom5.getFullYear()}</span>)}</p>
                            <p><b>Hours Worked: </b>{this.props.location.state && this.props.location.state.hoursWorked5}</p>
                            <p><b>Hourly Wage: </b>{this.props.location.state && this.props.location.state.hourlyWage5}</p>
                            <p><b>Total: </b>{this.props.location.state && this.props.location.state.total5}</p>
                        </div>
                        <p><b>Total MERCs for Claim Period:</b>{this.props.location.state && this.props.location.state.totalMERCs}</p>
                        <p><b>Client Issues (if any)</b>:</p>
                        <p>{this.props.location.state && this.props.location.state.clientIssues1}</p>
                        {
                        /*
                        <h3>Total MERCS</h3>
                        <p><b>Hours Worked Total:</b> {this.props.location.state && this.props.location.state.hoursWorkedTotal1}</p>
                        <p><b>Hourly Wage Total: </b>{this.props.location.state && this.props.location.state.hourlyWageTotal1}</p>
                        <p><b>Total Total:</b>{this.props.location.state && this.props.location.state.totalTotal1}</p>
                        */
                        }
                        <hr />
                    </div>
                </div>
            </div>
        )
    }
}

export default ThankyouClaimForm