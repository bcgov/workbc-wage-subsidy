var strings = require("./strings")
var formatDate = require("../utils/formatDate")

module.exports = {

    generateNotification: function (values) {

        var html = "";
        for (var key in values) {
            html += `${key} ${strings.orEmpty(values[key])} `;
        }
        return html
    },

    generateListNotification: function(values) {
        var html = "";
        // loop through each property
        for (var key in values) {
            // add key/val to html
            html += `<p><b>${key}:</b> ${strings.orEmpty(values[key])}</p>`;
        }

        return html;
    },

    generateClaimNotification: function (values){
        var html = /*html*/`
        <h2>Wage Subsidy Claim application</h2>
        <p><b>Period Claim Start (DD/MM/YYYY): </b> ${formatDate(values.periodStart1)}</p>
        <p><b>Period Claim End (DD/MM/YYYY): </b> ${formatDate(values.periodStart2)}</p>
        <p><b>Final Claim: </b>${strings.orEmpty(values.isFinalClaim)}</p>
        <p><b>Employer Business Name: </b>${strings.orEmpty(values.employerName)}</p>
        <p><b>Employer Contact: </b>${strings.orEmpty(values.employerContact)}</p>
        <p><b>Employer Phone Number: </b>${strings.orEmpty(values.employerPhone)}</p>
        <p><b>Address 1: </b>${strings.orEmpty(values.employerAddress1)}</p>
        <p><b>Address 2: </b>${strings.orEmpty(values.employerAddress2)}</p>
        <p><b>City: </b>${strings.orEmpty(values.employerCity)}</p>
        <p><b>Postal Code: </b>${strings.orEmpty(values.employerPostal)}</p>
        <p><b>Employee First Name: </b>${strings.orEmpty(values.employeeFirstName)}</p>
        <p><b>Employee Last Name: </b>${strings.orEmpty(values.employeeLastName)}</p>
        <h2>Work Period Information</h2>
        <h3>1st Date</h3>
        <p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom1)}</p>
        <p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo1)}</p>
        <p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked1)}</p>
        <p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage1)}</p>
        <p><b>Total: </b>${strings.orEmpty(values.total1)}</p>
        <h3>2nd Date</h3>
        <p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom2)}</p>
        <p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo2)}</p>
        <p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked2)}</p>
        <p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage2)}</p>
        <p><b>Total: </b>${strings.orEmpty(values.total2)}</p>
        <h3>3rd Date</h3>
        <p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom3)}</p>
        <p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo3)}</p>
        <p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked3)}</p>
        <p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage3)}</p>
        <p><b>Total: </b>${strings.orEmpty(values.total3)}</p>
        <h3>4th Date</h3>
        <p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo4)}</p>
        <p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom4)}</p>
        <p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked4)}</p>
        <p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage4)}</p>
        <p><b>Total: </b>${strings.orEmpty(values.total4)}</p>
        <h3>5th Date</h3>
        <p><b>Date To (DD/MM/YYYY):</b>${formatDate(values.dateTo5)}</p>
        <p><b>Date From (DD/MM/YYYY): </b>${formatDate(values.dateFrom5)}</p>
        <p><b>Hours Worked: </b>${strings.orEmpty(values.hoursWorked5)}</p>
        <p><b>Hourly Wage: </b>${strings.orEmpty(values.hourlyWage5)}</p>
        <p><b>Total: </b>${strings.orEmpty(values.total5)}</p>
        <h3>Total employer portion of Mandatory Employment Related Costs.<h3>
        <p><b>Total MERCs for claim Period: </b> ${strings.orEmpty(values.totalMERCs)}</p>
        `
        return html       
    },

    generateHaveEmployeeNotification: function(values){
        var html = /*html*/`
        <h2>Wage Subsidy application</h2>
        <p>Application ID:  ${strings.orEmpty(values._id)}</p>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName)}</p>
        <hr />
        <h5> Business Address Information</h5>
        <p>Business Number:  ${strings.orEmpty(values.businessNumber)}</p>
        <p>Business Address:  ${strings.orEmpty(values.businessAddress)}</p>
        <p>Business City:  ${strings.orEmpty(values.businessCity)}</p>
        <p>Business Province:  ${strings.orEmpty(values.businessProvince)}</p>
        <p>Business Postal:  ${strings.orEmpty(values.businessPostal)}</p>
        <p>Business Email:  ${strings.orEmpty(values.businessEmail)}</p>
        <p>Business Phone:  ${strings.orEmpty(values.businessPhone)}</p>
        <p>Business Fax:  ${strings.orEmpty(values.businessFax)}</p>
        <hr />
        <h5>Alternative Address (only if different from contact)</h5>
        <p>Alternative Address:  ${strings.orEmpty(values.addressAlt)}</p>
        <p>Alternative City:  ${strings.orEmpty(values.cityAlt)}</p>
        <p>Alternative Province:  ${strings.orEmpty(values.provinceAlt)}</p>
        <p>Alternative Postal:  ${strings.orEmpty(values.postalAlt)}</p>
        <hr />
        <h5>Business Questions</h5>
        <p>Sector Type:  ${strings.orEmpty(values.sectorType)}</p>
        <p>Type of Industry:  ${strings.orEmpty(values.typeOfIndustry)}</p>
        <p>Organization Size:  ${strings.orEmpty(values.organizationSize)}</p>
        <p>Actively participating in canada emergency wage subsidy program:  ${strings.orEmpty(values.cewsParticipation)}</p>
        <p>Employee Displacement due to subsidy:  ${strings.orEmpty(values.employeeDisplacement)}</p>
        <p>labour Dispute or stoppage in progress:  ${strings.orEmpty(values.labourDispute)}</p>
        <p>Union Concurrence:  ${strings.orEmpty(values.unionConcurrence)}</p>
        <p>Has 3rd party Liability Coverage:  ${strings.orEmpty(values.liabilityCoverage)}</p>
        <p>Currently receiving WorkBC wage subsidy funding:  ${strings.orEmpty(values.wageSubsidy)}</p>
        <p>Eligibility Confirmed:  ${strings.orEmpty(values.eligibility)}</p>
        <hr />
        <h5>WorkBC Insurance Coverage (only if has coverage)</h5>
        <p>WorkSafeBC Insurance Coverage Number:  ${strings.orEmpty(values.WSBCNumber)}</p>
        <hr />
        <h5>Employee Position 1 </h5>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName0)}</p>
        <p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions0)}</p>
        <p>Employee Email 1:  ${strings.orEmpty(values.position0Email0)}</p>
        <p>Employee Email 2:  ${strings.orEmpty(values.position0Email1)}</p>
        <p>Employee Email 3:  ${strings.orEmpty(values.position0Email2)}</p>
        <p>Employee Email 4:  ${strings.orEmpty(values.position0Email3)}</p>
        <p>Employee Email 5:  ${strings.orEmpty(values.position0Email4)}</p>
        <p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate0)}</p>
        <p>Hours: ${strings.orEmpty(values.hours0)}</p>
        <p>Wage: ${strings.orEmpty(values.wage0)}</p>
        <p>Duties: ${strings.orEmpty(values.duties0)}</p>
        <h5>Employee Position 2 (only if different from above) </h5>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName1)}</p>
        <p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions1)}</p>
        <p>Employee Email 1:  ${strings.orEmpty(values.position1Email0)}</p>
        <p>Employee Email 2:  ${strings.orEmpty(values.position1Email1)}</p>
        <p>Employee Email 3:  ${strings.orEmpty(values.position1Email2)}</p>
        <p>Employee Email 4:  ${strings.orEmpty(values.position1Email3)}</p>
        <p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate1)}</p>
        <p>Hours: ${strings.orEmpty(values.hours1)}</p>
        <p>Wage: ${strings.orEmpty(values.wage1)}</p>
        <p>Duties: ${strings.orEmpty(values.duties1)}</p>
        <hr />                       
        <h5>Signatory names and Organization consent</h5>
        <p>Signatory 1:  ${strings.orEmpty(values.signatory1)}</p>
        <p>Signatory Title:  ${strings.orEmpty(values.signatoryTitle)}</p>
        <p>Organization Consent:  ${strings.orEmpty(values.organizationConsent)}</p>        
        `
        return html
    },
    generateNeedEmployeeNotification: function(values){
        var html = /*html*/ `
        <h2>Wage Subsidy application</h2>
        <p>Application ID:  ${strings.orEmpty(values._id)}</p>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName)}</p>
        <hr />
        <h5> Business Address Information</h5>
        <p>Business Number:  ${strings.orEmpty(values.businessNumber)}</p>
        <p>Business Address:  ${strings.orEmpty(values.businessAddress)}</p>
        <p>Business City:  ${strings.orEmpty(values.businessCity)}</p>
        <p>Business Province:  ${strings.orEmpty(values.businessProvince)}</p>
        <p>Business Postal:  ${strings.orEmpty(values.businessPostal)}</p>
        <p>Business Email:  ${strings.orEmpty(values.businessEmail)}</p>
        <p>Business Phone:  ${strings.orEmpty(values.businessPhone)}</p>
        <p>Business Fax:  ${strings.orEmpty(values.businessFax)}</p>
        <p></p>
        <h5>Alternative Address (only if different from contact)</h5>
        <p>Alternative Address:  ${strings.orEmpty(values.addressAlt)}</p>
        <p>Alternative City:  ${strings.orEmpty(values.cityAlt)}</p>
        <p>Alternative Province:  ${strings.orEmpty(values.provinceAlt)}</p>
        <p>Alternative Postal:  ${strings.orEmpty(values.postalAlt)}</p>
        <hr />
        <h5>Business Questions</h5>
        <p>Sector Type:  ${strings.orEmpty(values.sectorType)}</p>
        <p>Type of Industry:  ${strings.orEmpty(values.typeOfIndustry)}</p>
        <p>Organization Size:  ${strings.orEmpty(values.organizationSize)}</p>
        <p>Actively participating in canada emergency wage subsidy program:  ${strings.orEmpty(values.cewsParticipation)}</p>
        <p>Employee Displacement due to subsidy:  ${strings.orEmpty(values.employeeDisplacement)}</p>
        <p>labour Dispute or stoppage in progress:  ${strings.orEmpty(values.labourDispute)}</p>
        <p>Union Concurrence:  ${strings.orEmpty(values.unionConcurrence)}</p>
        <p>Has 3rd party Liability Coverage:  ${strings.orEmpty(values.liabilityCoverage)}</p>
        <p>Currently receiving WorkBC wage subsidy funding:  ${strings.orEmpty(values.wageSubsidy)}</p>
        <p>Eligibility Confirmed:  ${strings.orEmpty(values.eligibility)}</p>
        <p></p>
        <h5>WorkBC Insurance Coverage (only if has coverage)</h5>
        <p>WorkSafeBC Insurance Coverage Number:  ${strings.orEmpty(values.WSBCNumber)}</p>
        <hr />
        <h5>Employee Position 1 </h5>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName0)}</p>
        <p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions0)}</p>
        <p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate0)}</p>
        <p>Hours: ${strings.orEmpty(values.hours0)}</p>
        <p>Wage: ${strings.orEmpty(values.wage0)}</p>
        <p>Duties: ${strings.orEmpty(values.duties0)}</p>
        <p>Skills: ${strings.orEmpty(values.skills0)}</p>
        <p>Work Experience: ${strings.orEmpty(values.workExperience0)}</p>
        <hr />
        <h5>Employee Position 2 (only if different from above) </h5>
        <p>Operating Name:  ${strings.orEmpty(values.operatingName1)}</p>
        <p>Number of Positions:  ${strings.orEmpty(values.numberOfPositions1)}</p>
        <p>StartDate (DD/MM/YYYY):  ${formatDate(values.startDate1)}</p>
        <p>Hours: ${strings.orEmpty(values.hours1)}</p>
        <p>Wage: ${strings.orEmpty(values.wage1)}</p>
        <p>Duties: ${strings.orEmpty(values.duties1)}</p>
        <p>Skills: ${strings.orEmpty(values.skills1)}</p>
        <p>Work Experience: ${strings.orEmpty(values.workExperience1)}</p>
        <hr />                       
        <h5>Signatory names and Organization consent</h5>
        <p>Signatory 1:  ${strings.orEmpty(values.signatory1)}</p>
        <p>Signatory Title:  ${strings.orEmpty(values.signatoryTitle)}</p>
        <p>Organization Consent:  ${strings.orEmpty(values.organizationConsent)}</p>       
        `
        return html
    },
    generateClaimListNotification: function(values){
        var html = `

        `
        return html
    }

}