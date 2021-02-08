import React, { Component } from 'react'


class thankyouNeedEmployee extends Component {
    
    render() {

        const alternativeAddress = this.props.location.state !== undefined && this.props.location.state.otherWorkAddress;
        const WorkSafeBCNumber = (this.props.location.state !== undefined && (this.props.location.state.WSBCCoverage === "yes"));
        const employeePositions = (this.props.location.state !== undefined && (this.props.location.state.numberOfPositions1 > 0));
        const businessFaxProvided = (this.props.location.state !== undefined && (this.props.location.state.businessFax !== ""));
        const wageSubsidizedAlready = (this.props.location.state !== undefined && (this.props.location.state.wageSubsidy === "yes"));

        return (
            
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1>Thank you, your application has been received</h1>
                        <h3>Application ID: {this.props.location.state !== undefined && this.props.location.state._id}</h3>
                        <button className="btn btn-success d-print-none" onClick={() => window.print()}>Print Confirmation</button><br /><br />
                        <p>Thank you for your interest in WorkBC Wage Subsidy services. Your application has been received and a WorkBC staff member will be in touch with you soon to confirm your business qualifies for WorkBC Wage Subsidy and to complete the application process. </p>
                        <br />
                        <hr />
                                <p>Application ID:  {this.props.location.state !== undefined && this.props.location.state._id}</p>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName}</p>
                                
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
                                {wageSubsidizedAlready ?(<div><p>How Many Employees is WorkBC currently Subsidizing? {this.props.location.state !== undefined && this.props.location.state.employeesClaimed.toString()}</p></div>):(<div></div>)}
                                
                                <p>{this.props.location.state !== undefined && this.props.location.state.operatingName} meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various 
                                   listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement :   
                                   {this.props.location.state !== undefined && this.props.location.state.eligibility.toString()}</p>
                                 <p>{this.props.location.state !== undefined && this.props.location.state.operatingName} certifies that it is in full compliance with all applicable laws, including the Employment Standards Act, the Workers Compensation Act and the Human Rights Code : 
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
                                <p>Anticipated Start Date:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours of Work Per Week: {this.props.location.state !== undefined && this.props.location.state.hours0.toString()}</p>
                                <p>Hourly Wage: {this.props.location.state !== undefined && this.props.location.state.wage0.toString()}</p>
                                <p>Description of Duties: {this.props.location.state !== undefined && this.props.location.state.duties0}</p>
                                <p>Skills and experience normally required for this position: {this.props.location.state !== undefined && this.props.location.state.skills0}</p>
                                <p>What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement? {this.props.location.state !== undefined && this.props.location.state.workExperience0}</p>

                                {employeePositions ? (
                                    <div>
                                        <h5>Position 2 (only if different from above) </h5>
                                        <p>Position Title:  {this.props.location.state !== undefined && this.props.location.state.operatingName1}</p>
                                        <p>Number of Available Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions1.toString()}</p>
                                        <p>Anticipated Start Date:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                        <p>Hours of Work Per Week: {this.props.location.state !== undefined && this.props.location.state.hours1.toString()}</p>
                                        <p>Hourly Wage: {this.props.location.state !== undefined && this.props.location.state.wage1.toString()}</p>
                                        <p>Description of Duties: {this.props.location.state !== undefined && this.props.location.state.duties1}</p>
                                        <p>Skills and experience normally required for this position: {this.props.location.state !== undefined && this.props.location.state.skills1}</p>
                                        <p>What work experience, training, supervision, etc., will the employee receive during the Wage Subsidy Placement? {this.props.location.state !== undefined && this.props.location.state.workExperience1}</p>
                                    </div>) : (<div></div>)
                                }
                                
                                {/* 
                                <h5>Employee Position 3 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName2}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions2.toString()}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours2.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage2.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties2}</p>
                                 <p>Skills: {this.props.location.state !== undefined && this.props.location.state.skills2}</p>
                                <p>Work Experience: {this.props.location.state !== undefined && this.props.location.state.workExperience2}</p>
                                
                                <h5>Employee Position 4 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName3}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions3.toString()}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate0.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours3.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage3.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties3}</p>
                                 <p>Skills: {this.props.location.state !== undefined && this.props.location.state.skills3}</p>
                                <p>Work Experience: {this.props.location.state !== undefined && this.props.location.state.workExperience3}</p>
                                
                                <h5>Employee Position 5 (only if different from above) </h5>
                                <p>Operating Name:  {this.props.location.state !== undefined && this.props.location.state.operatingName4}</p>
                                <p>Number of Positions:  {this.props.location.state !== undefined && this.props.location.state.numberOfPositions4.toString()}</p>
                                <p>StartDate:  {this.props.location.state !== undefined && this.props.location.state.startDate4.toString()}</p>
                                <p>Hours: {this.props.location.state !== undefined && this.props.location.state.hours4.toString()}</p>
                                <p>Wage: {this.props.location.state !== undefined && this.props.location.state.wage4.toString()}</p>
                                <p>Duties: {this.props.location.state !== undefined && this.props.location.state.duties4}</p>
                                <p>Skills: {this.props.location.state !== undefined && this.props.location.state.skills4}</p>
                                <p>Work Experience: {this.props.location.state !== undefined && this.props.location.state.workExperience4}</p>
                                */} 
                                                          
                                <h5>Declaration and Signature</h5>
                                <p>Signing Authority Full Name:  {this.props.location.state !== undefined && this.props.location.state.signatory1}</p>
                                <p>Signatory Authority Title:  {this.props.location.state !== undefined && this.props.location.state.signatoryTitle}</p>
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

export default thankyouNeedEmployee