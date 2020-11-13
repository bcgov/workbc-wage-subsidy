import React, { Component } from 'react'


class thankyouHaveEmployee extends Component {
    
    render() {

        const alternativeAddress = this.props.location.state.otherWorkAddress;
        const WorkSafeBCNumber = (this.props.location.state.WSBCCoverage === "yes");
        const employeePositions = (this.props.location.state.numberOfPositions1 > 0);
        const businessFaxProvided = (this.props.location.state.businessFax !== "");


        return (
            
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Thank you, your application has been received</h1>
                        <h3>Application ID: {this.props.location.state !== undefined && this.props.location.state._id}</h3>
                        <button className="btn btn-success d-print-none" onClick={() => window.print()}>Print Confirmation</button><br /><br />
                        <p>Thank you for your interest in WorkBC Wage Subsidy services. Your application has been received and a WorkBC staff member will be in touch with you soon.</p>
                        <p>
                            The following information was received:
                        </p>
                        <br />
                        <hr /> 
                                <p>Application ID:  {this.props.location.state !== undefined && this.props.location.state._id}</p>
                                <p>Organization Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName}</p>
                                
                                <h5>Business Information</h5>
                                <p>CRA Business Number:  {this.props.location.state !== undefined && this.props.location.state.businessNumber}</p>
                                <p>Address:  {this.props.location.state !== undefined && this.props.location.state.businessAddress}</p>
                                <p>City / Town:  {this.props.location.state !== undefined && this.props.location.state.businessCity}</p>
                                <p>Province:  {this.props.location.state !== undefined && this.props.location.state.businessProvince}</p>
                                <p>Postal:  {this.props.location.state !== undefined && this.props.location.state.businessPostal}</p>
                                <p>Employer Email Address:  {this.props.location.state !== undefined && this.props.location.state.businessEmail}</p>
                                <p>Phone Number:  {this.props.location.state !== undefined && this.props.location.state.businessPhone}</p>
                                {businessFaxProvided ? (
                                    <div>
                                        <p>Fax:  {this.props.location.state !== undefined && this.props.location.state.businessFax}</p>
                                    </div>) : (<div></div>)
                                }

                                {alternativeAddress ? (
                                    <div>
                                        <h5>Work Place Information (only if different from contact)</h5>
                                        <p>Work Address:  {this.props.location.state !== undefined && this.props.location.state.addressAlt}</p>
                                        <p>City / Town:  {this.props.location.state !== undefined && this.props.location.state.cityAlt}</p>
                                        <p>Province:  {this.props.location.state !== undefined && this.props.location.state.provinceAlt}</p>
                                        <p>Postal:  {this.props.location.state !== undefined && this.props.location.state.postalAlt}</p>
                                    </div>
                                 ) : (<div></div>) 
                                 }
  
                                <p>Type of Sector:  {this.props.location.state !== undefined && this.props.location.state.sectorType}</p>
                                <p>Type of Industry:  {this.props.location.state !== undefined && this.props.location.state.typeOfIndustry}</p>
                                <p>Size of Organization(number of employees):  {this.props.location.state !== undefined && this.props.location.state.organizationSize}</p>
                                <p>Are you actively participating in canada emergency wage subsidy program?  {this.props.location.state !== undefined && this.props.location.state.cewsParticipation}</p>
                                <p>Will the subsidy result in the displacement of existing employees or volunteers?  {this.props.location.state !== undefined && this.props.location.state.employeeDisplacement}</p>
                                <p>Is there a labour stoppage or labour - management dispute in progress? {this.props.location.state !== undefined && this.props.location.state.labourDispute}</p>
                                <p>Is there Union concurrence? {this.props.location.state !== undefined && this.props.location.state.unionConcurrence}</p>
                                <p>Does your organization have 3rd Party liability coverage?  {this.props.location.state !== undefined && this.props.location.state.liabilityCoverage}</p>
                                <p>Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement?  {this.props.location.state !== undefined && this.props.location.state.wageSubsidy}</p>
                                <p>meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various 
                                   listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement.:  
                                   {this.props.location.state !== undefined && this.props.location.state.eligibility.toString()}</p>
                                 <p> certifies that it is in full compliance with all applicable laws, including the Employment Standards Act, the Workers Compensation Act and the Human Rights Code.
                                 {this.props.location.state !== undefined && this.props.location.state.lawCompliance.toString()}
                                 </p>
                                
                                {WorkSafeBCNumber ? (
                                    <div>
                                        <h5>WorkBC Insurance Coverage (only if has coverage)</h5>
                                        <p>WorkSafeBC Number:  {this.props.location.state !== undefined && this.props.location.state.WSBCNumber.toString()}</p>
                                    </div> ):(<div></div>)
                                }

                                <h5>Position 1 </h5>
                                <p>Position Title:  {this.props.location.state !== undefined && this.props.location.state.operatingName0}</p>
                                <p>Number of Available Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions0.toString()}</p>
                                <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position0Email0}</p>
                                <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position0Email1}</p>
                                <p>Employee Email 3:  {this.props.location.state !== undefined && this.props.location.state.position0Email2}</p>
                                <p>Employee Email 4:  {this.props.location.state !== undefined && this.props.location.state.position0Email3}</p>
                                <p>Employee Email 5:  {this.props.location.state !== undefined && this.props.location.state.position0Email4}</p>
                                <p>Anticipated Start Date:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours of Work Per Week: {this.props.location.state !== undefined && this.props.location.state.hours0.toString()}</p>
                                <p>Hourly Wage: {this.props.location.state !== undefined && this.props.location.state.wage0.toString()}</p>
                                <p>Description of Duties: {this.props.location.state !== undefined && this.props.location.state.duties0}</p>
                                
                                {employeePositions ? (
                                    <div>
                                    <h5>Position 2 (only if different from above) </h5>
                                    <p>Position Title:  {this.props.location.state !== undefined && this.props.location.state.operatingName1}</p>
                                    <p>Number of Available Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions1.toString()}</p>
                                    <p>Employee Email 1:  {this.props.location.state !== undefined && this.props.location.state.position1Email0}</p>
                                    <p>Employee Email 2:  {this.props.location.state !== undefined && this.props.location.state.position1Email1}</p>
                                    <p>Employee Email 3:  {this.props.location.state !== undefined && this.props.location.state.position1Email2}</p>
                                    <p>Employee Email 4:  {this.props.location.state !== undefined && this.props.location.state.position1Email3}</p>
                                    <p>Anticipated Start Date:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                    <p>Hours of work Per Week: {this.props.location.state !== undefined && this.props.location.state.hours1.toString()}</p>
                                    <p>Hourly Wage: {this.props.location.state !== undefined && this.props.location.state.wage1.toString()}</p>
                                    <p>Description of Duties: {this.props.location.state !== undefined && this.props.location.state.duties1}</p>
                                    </div>):(<div></div>)
                                }
                                
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
                                                          
                                <h5>SDeclaration and Signature</h5>
                                <p>Signing Authority Title:  {this.props.location.state !== undefined && this.props.location.state.signatory1}</p>
                                <p>Signatory Authority Full Name:  {this.props.location.state !== undefined && this.props.location.state.signatoryTitle}</p>
                                <p>I acknowledge and understand that by clicking the "submit" I am attaching my electronic signature to this form and that 
                                    by doing so I acquire the same rights, incur the same obligations and confer the same consent as I would by manually 
                                    signing a physical copy of this form :  {this.props.location.state !== undefined && this.props.location.state.organizationConsent.toString()}</p>
                        <hr />
                    </div>
                </div>
            </div>
        )
    }
}

export default thankyouHaveEmployee
