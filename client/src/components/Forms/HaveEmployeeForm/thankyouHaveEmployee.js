import React, { Component } from 'react'


class thankyouHaveEmployee extends Component {
    
    render() {
        return (
            
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Thank you, your application has been received</h1>
                        {console.log(this.props)}
                        {console.log(this.props.location)}
                        <h3>Application ID: {this.props.location.state !== undefined && this.props.location.state._id}</h3>
                        <button className="btn btn-success d-print-none" onClick={() => window.print()}>Print Confirmation</button><br /><br />
                        <p>A confirmation email has been sent to the email address provided.</p>
                        <p>
                            The following information was received:
                        </p>
                        <br />
                        <hr />
                        {console.log(this.props.location.state)}  
                                <p>Application ID:  {this.props.location.state !== undefined && this.props.location.state._id}</p>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName}</p>
                                
                                <h5> Business Address Information</h5>
                                <p>Business Number:  {this.props.location.state !== undefined && this.props.location.state.businessNumber}</p>
                                <p>Business Address:  {this.props.location.state !== undefined && this.props.location.state.businessAddress}</p>
                                <p>Business City:  {this.props.location.state !== undefined && this.props.location.state.businessCity}</p>
                                <p>Business Province:  {this.props.location.state !== undefined && this.props.location.state.businessProvince}</p>
                                <p>Business Postal:  {this.props.location.state !== undefined && this.props.location.state.businessPostal}</p>
                                <p>Business Email:  {this.props.location.state !== undefined && this.props.location.state.businessEmail}</p>
                                <p>Business Phone:  {this.props.location.state !== undefined && this.props.location.state.businessPhone}</p>
                                <p>Business Fax:  {this.props.location.state !== undefined && this.props.location.state.businessFax}</p>

                                <h5>Alternative Address (only if different from contact)</h5>
                                <p>Alternative Address:  {this.props.location.state !== undefined && this.props.location.state.addressAlt}</p>
                                <p>Alternative City:  {this.props.location.state !== undefined && this.props.location.state.cityAlt}</p>
                                <p>Alternative Province:  {this.props.location.state !== undefined && this.props.location.state.provinceAlt}</p>
                                <p>Alternative Postal:  {this.props.location.state !== undefined && this.props.location.state.postalAlt}</p>
  
                                <h5>Business Questions</h5>
                                <p>Sector Type:  {this.props.location.state !== undefined && this.props.location.state.sectorType}</p>
                                <p>Type of Industry:  {this.props.location.state !== undefined && this.props.location.state.typeOfIndustry}</p>
                                <p>Organization Size:  {this.props.location.state !== undefined && this.props.location.state.organizationSize}</p>
                                <p>Actively participating in canada emergency wage subsidy program:  {this.props.location.state !== undefined && this.props.location.state.cewsParticipation}</p>
                                <p>Employee Displacement due to subsidy:  {this.props.location.state !== undefined && this.props.location.state.employeeDisplacement}</p>
                                <p>labour Dispute or stoppage in progress:  {this.props.location.state !== undefined && this.props.location.state.labourDispute}</p>
                                <p>Union Concurrence:  {this.props.location.state !== undefined && this.props.location.state.unionConcurrence}</p>
                                <p>Has 3rd party Liability Coverage:  {this.props.location.state !== undefined && this.props.location.state.liabilityCoverage}</p>
                                <p>Currently receiving WorkBC wage subsidy funding:  {this.props.location.state !== undefined && this.props.location.state.wageSubsidy}</p>
                                <p>Eligibility Confirmed:  {this.props.location.state !== undefined && this.props.location.state.eligibility}</p>
                                
                                <h5>WorkBC Insurance Coverage (only if has coverage)</h5>
                                <p>WorkSafeBC Insurance Coverage Number:  {this.props.location.state !== undefined && this.props.location.state.WSBCNumber.toString()}</p>
  
                                <h5>Employee Position 1 </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName0}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions0.toString()}</p>
                                <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position0Email0}</p>
                                <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position0Email1}</p>
                                <p>Employee Email 3:  {this.props.location.state !== undefined && this.props.location.state.position0Email2}</p>
                                <p>Employee Email 4:  {this.props.location.state !== undefined && this.props.location.state.position0Email3}</p>
                                <p>Employee Email 5:  {this.props.location.state !== undefined && this.props.location.state.position0Email4}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours0.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage0.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties0}</p>
                                <h5>Employee Position 2 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName1}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions1.toString()}</p>
                                <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position1Email0}</p>
                                <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position1Email1}</p>
                                <p>Employee Email 3:  {this.props.location.state !== undefined && this.props.location.state.position1Email2}</p>
                                <p>Employee Email 4:  {this.props.location.state !== undefined && this.props.location.state.position1Email3}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours1.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage1.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties1}</p>
                                
                                {/* 
                                <h5>Employee Position 3 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName2}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions2.toString()}</p>
                                <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position2Email0}</p>
                                <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position2Email1}</p>
                                <p>Employee Email 3:  {this.props.location.state !== undefined && this.props.location.state.position2Email2}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours2.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage2.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties2}</p>
                                
                                <h5>Employee Position 4 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName3}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions3.toString()}</p>
                                <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position3Email0}</p>
                                <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position3Email1}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours3.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage3.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties3}</p>
                                
                                <h5>Employee Position 5 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName4}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions4.toString()}</p>
                                <p>Employee Email 1 :  {this.props.location.state !== undefined && this.props.location.state.position4Email0}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate4.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours4.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage4.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties4}</p>
                                */} 
                                                          
                                <h5>Signatory names and Organization consent</h5>
                                <p>Signatory 1:  {this.props.location.state !== undefined && this.props.location.state.signatory1}</p>
                                <p>Signatory Title:  {this.props.location.state !== undefined && this.props.location.state.signatoryTitle}</p>
                                <p>Organization Consent:  {this.props.location.state !== undefined && this.props.location.state.organizationConsent.toString()}</p>
                        <hr />
                    </div>
                </div>
            </div>
        )
    }
}

export default thankyouHaveEmployee
