var strings = require("./strings")
var formatDate = require("../utils/formatDate")

module.exports = {
    getHaveEmployeeSubmitted(values){
        const businessFaxProvided = (typeof(values.businessFax) !== "undefined" && values.businessFax !== null && values.businessFax !== "");
        var data = [
            `The following information was received:`,
            `<hr />`,
            `<hr />`,
            `<p>Application ID:  ${strings.orEmpty(values._id)}</p>`,
            `<p>Operating Name:  ${strings.orEmpty(values.operatingName)}</p>`,
            `<hr />`,
            `<h5> Business Information</h5>`,
            `<p>CRA Business Number:  ${strings.orEmpty(values.businessNumber)}</p>`,
            `<p>Address:  ${strings.orEmpty(values.businessAddress)}</p>`,
            `<p>City/Town:  ${strings.orEmpty(values.businessCity)}</p>`,
            `<p>Province:  ${strings.orEmpty(values.businessProvince)}</p>`,
            `<p>Postal Code:  ${strings.orEmpty(values.businessPostal)}</p>`,
            `<p>Employer Email Address:  ${strings.orEmpty(values.businessEmail)}</p>`,
            `<p>Phone Number:  ${strings.orEmpty(values.businessPhone)}</p>`,

           ((businessFaxProvided) ?
            [`<p>Fax:  ${strings.orEmpty(values.businessFax)}</p>`] :[]),
            
            `<hr />`,
            ((values.otherWorkAddress) ?       
            [`<h5>Work Address (only if different from contact)</h5>
            <p>Work Address:  ${strings.orEmpty(values.addressAlt)}</p>
            <p>City/Town:  ${strings.orEmpty(values.cityAlt)}</p>
            <p>Province:  ${strings.orEmpty(values.provinceAlt)}</p>
            <p>Postal Code:  ${strings.orEmpty(values.postalAlt)}</p>
            <hr />`] :[]),
           
            `<h5>Business Questions</h5>`,
            `<p>Type Of Sector:  ${strings.orEmpty(values.sectorType)}</p>`,
            `<p>Type of Industry:  ${strings.orEmpty(values.typeOfIndustry)}</p>`,
            `<p>Size of Organization(number of employees):  ${strings.orEmpty(values.organizationSize)}</p>`,
            `<p>Are you actively participating in canada emergency wage subsidy program?   ${strings.orEmpty(values.cewsParticipation)}</p>`,
            `<p>Will the subsidy result in the displacement of existing employees or volunteers?  ${strings.orEmpty(values.employeeDisplacement)}</p>`,
            `<p>Is there a labour stoppage or labour - management dispute in progress?  ${strings.orEmpty(values.labourDispute)}</p>`,
            `<p>Is there Union concurrence?  ${strings.orEmpty(values.unionConcurrence)}</p>`,
            `<p>Does your organization have 3rd Party liability coverage?  ${strings.orEmpty(values.liabilityCoverage)}</p>`,
            `<p>Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement?  ${strings.orEmpty(values.wageSubsidy)}</p>`,
            ((values.wageSubsidy === "yes") ?
            [`<p>How many employees is WorkBC currently subsidizing? ${strings.orEmpty(values.employeesClaimed)}</p>`]:[]),

            `<p>${strings.orEmpty(values.operatingName)} meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement:  ${strings.orEmpty(values.eligibility)}</p>`,
            `<p>${strings.orEmpty(values.operatingName)} certifies that it is in full compliance with all applicable laws, including the Employment Standards Act, the Workers Compensation Act and the Human Rights Code:   ${strings.orEmpty(values.lawCompliance)}</p>`,
            `<hr />`,
            
            ((values.WSBCCoverage === "yes" )?   
            [`<h5>WorkBC Insurance Coverage (only if has coverage)</h5>
            <p>WorkSafeBC Number:  ${strings.orEmpty(values.WSBCNumber)}</p>
            <hr />`] : []),
            
            `<h5>Position 1 </h5>`,
            `<p>Position Title:  ${strings.orEmpty(values.operatingName0)}</p>`,
            `<p>Number of Available Positions:  ${strings.orEmpty(values.numberOfPositions0)}</p>`,
            `<p>Employee Email 1:  ${strings.orEmpty(values.position0Email0)}</p>`,
            `<p>Employee Email 2:  ${strings.orEmpty(values.position0Email1)}</p>`,
            `<p>Employee Email 3:  ${strings.orEmpty(values.position0Email2)}</p>`,
            `<p>Employee Email 4:  ${strings.orEmpty(values.position0Email3)}</p>`,
            `<p>Employee Email 5:  ${strings.orEmpty(values.position0Email4)}</p>`,
            `<p>Anticipated Start Date (DD/MM/YYYY):  ${formatDate(values.startDate0)}</p>`,
            `<p>Hours of Work Per Week: ${strings.orEmpty(values.hours0)}</p>`,
            `<p>Hourly Wage: ${strings.orEmpty(values.wage0)}</p>`,
            `<p>Description of Duties: ${strings.orEmpty(values.duties0)}</p>`,
            `<p>Skills: ${strings.orEmpty(values.skills0)}</p>`,
            `<p>Work Experience: ${strings.orEmpty(values.workExperience0)}</p>`,
           
            ((values.numberOfPositions1 > 0 ) ? 
            [`<h5>Position 2 (only if different from above) </h5>
            <p>Position Title:  ${strings.orEmpty(values.operatingName1)}</p>
            <p>Number of Available Positions:  ${strings.orEmpty(values.numberOfPositions1)}</p>
            <p>Employee Email 1:  ${strings.orEmpty(values.position1Email0)}</p>
            <p>Employee Email 2:  ${strings.orEmpty(values.position1Email1)}</p>
            <p>Employee Email 3:  ${strings.orEmpty(values.position1Email2)}</p>
            <p>Employee Email 4:  ${strings.orEmpty(values.position1Email3)}</p>
            <p>Anticipated Start Date (DD/MM/YYYY):  ${formatDate(values.startDate1)}</p>
            <p>Hours of Work Per Week: ${strings.orEmpty(values.hours1)}</p>
            <p>Hourly Wage: ${strings.orEmpty(values.wage1)}</p>
            <p>Description pf Duties: ${strings.orEmpty(values.duties1)}</p>
            <p>Skills: ${strings.orEmpty(values.skills1)}</p>
            <p>Work Experience: ${strings.orEmpty(values.workExperience1)}</p>`]:[]),
            
            `<hr />                       `,
            `<h5>Declaration and Signature</h5>`,
            `<p>Signatory Authority Full Name:  ${strings.orEmpty(values.signatory1)}</p>`,
            `<p>Signing Authority Title:  ${strings.orEmpty(values.signatoryTitle)}</p>`,
            `<p>I acknowledge and understand that by clicking the "submit" I am attaching my electronic signature to this form and that by doing so I acquire the same rights, incur the same obligations and confer the same consent as I would by manually signing a physical copy of this form :  ${strings.orEmpty(values.organizationConsent)}</p>`,
        ]
        return data

    },
    getClaimSubmitted(values){
        const Date2Total = (typeof(values.total2) !== "undefined" && values.total2 !== null && values.total2 !== "" && values.total2 !== 0);
        const Date3Total = (typeof(values.total3) !== "undefined" && values.total3 !== null && values.total3 !== "" && values.total3 !== 0);
        const Date4Total = (typeof(values.total4) !== "undefined" && values.total4 !== null && values.total4 !== "" && values.total4 !== 0);
        const Date5Total = (typeof(values.total5) !== "undefined" && values.total5 !== null && values.total5 !== "" && values.total5 !== 0);
        var data=[
            `The following information was received:`,
            `<hr />`,
            `<hr />`,
            `<p><b>Period Claim Start (DD/MM/YYYY): </b> ${formatDate(values.periodStart1)}</p>`,
            `<p><b>Period Claim End (DD/MM/YYYY): </b> ${formatDate(values.periodStart2)}</p>`,
            `<p><b>Final Claim: </b>${strings.orEmpty(values.isFinalClaim)}</p>`,
            `<p><b>Employer Business Name: </b>${strings.orEmpty(values.employerName)}</p>`,
            `<p><b>Employer Contact: </b>${strings.orEmpty(values.employerContact)}</p>`,
            `<p><b>Employer Phone Number: </b>${strings.orEmpty(values.employerPhone)}</p>`,
            `<p><b>Address 1: </b>${strings.orEmpty(values.employerAddress1)}</p>`,
            `<p><b>Address 2: </b>${strings.orEmpty(values.employerAddress2)}</p>`,
            `<p><b>City: </b>${strings.orEmpty(values.employerCity)}</p>`,
            `<p><b>Postal Code: </b>${strings.orEmpty(values.employerPostal)}</p>`,
            `<p><b>Employee First Name: </b>${strings.orEmpty(values.employeeFirstName)}</p>`,
            `<p><b>Employee Last Name: </b>${strings.orEmpty(values.employeeLastName)}</p>`,
            `<h2>Work Period Information</h2>`,

            `<h3>1st Date</h3>`,
            `<p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom1)}</p>`,
            `<p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo1)}</p>`,
            `<p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked1)}</p>`,
            `<p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage1)}</p>`,
            `<p><b>Total: </b>${strings.orEmpty(values.total1)}</p>`,
            ((Date2Total) ? 
           [`<h3>2nd Date</h3>`,
            `<p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom2)}</p>`
            `<p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo2)}</p>`
            `<p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked2)}</p>`
            `<p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage2)}</p>`
            `<p><b>Total: </b>${strings.orEmpty(values.total2)}</p>`] :[]),
            ((Date3Total) ? 
            [`<h3>3rd Date</h3>`,
            `<p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom3)}</p>`
            `<p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo3)}</p>`
            `<p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked3)}</p>`
            `<p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage3)}</p>`
            `<p><b>Total: </b>${strings.orEmpty(values.total3)}</p>`]:[]),
            ((Date4Total) ?
            [`<h3>4th Date</h3>`,
            `<p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom4)}</p>`
            `<p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo4)}</p>`
            `<p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked4)}</p>`
            `<p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage4)}</p>`
            `<p><b>Total: </b>${strings.orEmpty(values.total4)}</p>`] :[] ),
            ((Date5Total) ?
            [`<h3>5th Date</h3>`,
            `<p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom5)}</p>`
            `<p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo5)}</p>`
            `<p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked5)}</p>`
            `<p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage5)}</p>`
            `<p><b>Total: </b>${strings.orEmpty(values.total5)}</p>`]:[]),
            `<p><b>Total MERCs for Claim Period:</b>${strings.orEmpty(values.totalMERCs)}</p>`,
            `<p><b>Summary of job activities and client issues (if any)</b>:</p>`,
            `<p>${strings.orEmpty(values.clientIssues1)}</p>`,
            `<p><b>Signatory: </b> ${strings.orEmpty(signatory1)}</p>`
            /*
            `<p><b>Hours Worked Total:</b> ${strings.orEmpty(values.hoursWorkedTotal1)}</p>`,
            `<p><b>Hourly Wage Total: </b>${strings.orEmpty(values.hourlyWageTotal1)}</p>`,
            `<p><b>Total Total:</b>${strings.orEmpty(values.totalTotal1)}</p>`,
            */
        ]
        return data
    },
    getNeedEmployeeSubmitted(values) {
        const businessFaxProvided = (typeof(values.businessFax) !== "undefined" && values.businessFax !== null && values.businessFax !== "");
        let data = [
            `The following information was received:`,
            `<hr />`,
            `<hr />`,
            `<p>Application ID:  ${strings.orEmpty(values._id)}</p>`,
            `<p>Operating Name:  ${strings.orEmpty(values.operatingName)}</p>`,
            `<hr />`,
            `<h5> Business Information</h5>`,
            `<p>CRA Business Number:  ${strings.orEmpty(values.businessNumber)}</p>`,
            `<p>Address:  ${strings.orEmpty(values.businessAddress)}</p>`,
            `<p>City/Town:  ${strings.orEmpty(values.businessCity)}</p>`,
            `<p>Province:  ${strings.orEmpty(values.businessProvince)}</p>`,
            `<p>Postal Code:  ${strings.orEmpty(values.businessPostal)}</p>`,
            `<p>Employer Email Address:  ${strings.orEmpty(values.businessEmail)}</p>`,
            `<p>Phone Number:  ${strings.orEmpty(values.businessPhone)}</p>`,
           ((businessFaxProvided) ?
            [`<p>Fax:  ${strings.orEmpty(values.businessFax)}</p>`] :[]),
            
            `<hr />`,
            ((values.otherWorkAddress) ?       
            [`<h5>Work Address (only if different from contact)</h5>
            <p>Work Address:  ${strings.orEmpty(values.addressAlt)}</p>
            <p>City/Town:  ${strings.orEmpty(values.cityAlt)}</p>
            <p>Province:  ${strings.orEmpty(values.provinceAlt)}</p>
            <p>Postal Code:  ${strings.orEmpty(values.postalAlt)}</p>
            <hr />`] :[]),
           
            `<h5>Business Questions</h5>`,
            `<p>Type Of Sector:  ${strings.orEmpty(values.sectorType)}</p>`,
            `<p>Type of Industry:  ${strings.orEmpty(values.typeOfIndustry)}</p>`,
            `<p>Size of Organization(number of employees):  ${strings.orEmpty(values.organizationSize)}</p>`,
            `<p>Are you actively participating in canada emergency wage subsidy program?   ${strings.orEmpty(values.cewsParticipation)}</p>`,
            `<p>Will the subsidy result in the displacement of existing employees or volunteers?  ${strings.orEmpty(values.employeeDisplacement)}</p>`,
            `<p>Is there a labour stoppage or labour - management dispute in progress?  ${strings.orEmpty(values.labourDispute)}</p>`,
            `<p>Is there Union concurrence?  ${strings.orEmpty(values.unionConcurrence)}</p>`,
            `<p>Does your organization have 3rd Party liability coverage?  ${strings.orEmpty(values.liabilityCoverage)}</p>`,
            `<p>Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement?  ${strings.orEmpty(values.wageSubsidy)}</p>`,
            ((values.wageSubsidy === "yes") ?
            [`<p>How many employees is WorkBC currently subsidizing? ${strings.orEmpty(values.employeesClaimed)}</p>`]:[]),
            `<p>${strings.orEmpty(values.operatingName)} meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with respect to its other employees under the various listed statutes and all other applicable laws apply equally to an individual employed in a wage subsidy placement:  ${strings.orEmpty(values.eligibility)}</p>`,
            `<p>${strings.orEmpty(values.operatingName)} certifies that it is in full compliance with all applicable laws, including the Employment Standards Act, the Workers Compensation Act and the Human Rights Code:   ${strings.orEmpty(values.lawCompliance)}</p>`,
            `<hr />`,
            
            ((values.WSBCCoverage === "yes" )?   
            [`<h5>WorkBC Insurance Coverage (only if has coverage)</h5>
            <p>WorkSafeBC Number:  ${strings.orEmpty(values.WSBCNumber)}</p>
            <hr />`] : []),
            
            `<h5>Position 1 </h5>`,
            `<p>Operating Name:  ${strings.orEmpty(values.operatingName0)}</p>`,
            `<p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions0)}</p>`,
            `<p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate0)}</p>`,
            `<p>Hours: ${strings.orEmpty(values.hours0)}</p>`,
            `<p>Wage: ${strings.orEmpty(values.wage0)}</p>`,
            `<p>Duties: ${strings.orEmpty(values.duties0)}</p>`,
            `<p>Skills: ${strings.orEmpty(values.skills0)}</p>`,
            `<p>Work Experience: ${strings.orEmpty(values.workExperience0)}</p>`,
            `<hr />`,
            ((values.numberOfPositions1 > 0 ) ? 
            [`<h5>Position 2 (only if different from above) </h5>
            <p>Operating Name:  ${strings.orEmpty(values.operatingName1)}</p>
            <p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions1)}</p>
            <p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate1)}</p>
            <p>Hours: ${strings.orEmpty(values.hours1)}</p>
            <p>Wage: ${strings.orEmpty(values.wage1)}</p>
            <p>Duties: ${strings.orEmpty(values.duties1)}</p>
            <p>Skills: ${strings.orEmpty(values.skills1)}</p>
            <p>Work Experience: ${strings.orEmpty(values.workExperience1)}</p>`]:[]),
            
            `<hr />                       `,
            `<h5>Declaration and Signature</h5>`,
            `<p>Signatory Authority Full Name:  ${strings.orEmpty(values.signatory1)}</p>`,
            `<p>Signing Authority Title:  ${strings.orEmpty(values.signatoryTitle)}</p>`,
            `<p>I acknowledge and understand that by clicking the "submit" I am attaching my electronic signature to this form and that by doing so I acquire the same rights, incur the same obligations and confer the same consent as I would by manually signing a physical copy of this form :  ${strings.orEmpty(values.organizationConsent)}</p>`,
        ]
        return data;
    },
    getParticipantSubmitted(values) {
        let data = [
            ``,
        ];
        return data;
    }
}