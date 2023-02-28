/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as emailService from "../services/email.service"
import { getToken } from "../services/common.service"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const createEmail = (data: any) => {
    let emailHTML = ""
    if (!data.organizationConsent) {
        emailHTML = generateHTMLEmail(
            `Wage Subsidy Claim Application Submitted`,
            [
                `
                <h2>Wage Subsidy Claim application</h2>
            <p>CA:  ${data.container.workbcCentre || ""}</p>
            <p><b>Period Claim Start (DD/MM/YYYY): </b> ${
                (data.container.periodStart1 && data.container.periodStart1.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Period Claim End (DD/MM/YYYY): </b> ${
                (data.container.periodStart2 && data.container.periodStart2.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Final Claim: </b>${data.container.isFinalClaim || ""}</p>
            <p><b>Employer Business Name: </b>${data.container.employerName || ""}</p>
            <p><b>Employer Contact: </b>${data.container.employerContact || ""}</p>
            <p><b>Employer Phone Number: </b>${data.container.employerPhone || ""}</p>
            <p><b>Address 1: </b>${data.container.employerAddress1 || ""}</p>
            <p><b>Address 2: </b>${data.container.employerAddress2 || ""}</p>
            <p><b>City: </b>${data.container.employerCity || ""}</p>
            <p><b>Postal Code: </b>${data.container.employerPostal || ""}</p>
            <p><b>Employee First Name: </b>${data.container.employeeFirstName || ""}</p>
            <p><b>Employee Last Name: </b>${data.container.employeeLastName || ""}</p>
            <h2>Work Period Information</h2>
            <h3>1st Date</h3>
            <p><b>Date From (DD/MM/YYYY): </b>${
                (data.container.dateFrom1 && data.container.dateFrom1.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Date To (DD/MM/YYYY):</b>${
                (data.container.dateTo1 && data.container.dateTo1.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Hours Worked: </b>${data.container.hoursWorked1 || ""}</p>
            <p><b>Hourly Wage: </b>${data.container.hourlyWage1 || ""}</p>
            <p><b>Total: </b>${data.container.total1 || ""}</p>

            ${
                data.container.dateTo2 &&
                `<h3>2nd Date</h3>
            <p><b>Date From (DD/MM/YYYY): </b>${
                (data.container.dateFrom2 && data.container.dateFrom2.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Date To (DD/MM/YYYY):</b>${
                (data.container.dateTo2 && data.container.dateTo2.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Hours Worked: </b>${data.container.hoursWorked2 || ""}</p>
            <p><b>Hourly Wage: </b>${data.container.hourlyWage2 || ""}</p>
            <p><b>Total: </b>${data.container.total2 || ""}</p>`
            }
            
            ${
                data.container.dateTo3 &&
                `<h3>3rd Date</h3>
            <p><b>Date From (DD/MM/YYYY): </b>${
                (data.container.dateFrom3 && data.container.dateFrom3.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Date To (DD/MM/YYYY):</b>${
                (data.container.dateTo3 && data.container.dateTo3.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Hours Worked: </b>${data.container.hoursWorked3 || ""}</p>
            <p><b>Hourly Wage: </b>${data.container.hourlyWage3 || ""}</p>
            <p><b>Total: </b>${data.container.total3 || ""}</p>`
            }
            
            ${
                data.container.dateTo4 &&
                `<h3>4th Date</h3>
            <p><b>Date To (DD/MM/YYYY):</b>${
                (data.container.dateTo4 && data.container.dateTo4.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Date From (DD/MM/YYYY): </b>${
                (data.container.dateFrom4 && data.container.dateFrom4.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Hours Worked: </b>${data.container.hoursWorked4 || ""}</p>
            <p><b>Hourly Wage: </b>${data.container.hourlyWage4 || ""}</p>
            <p><b>Total: </b>${data.container.total4 || ""}</p>`
            }
            ${
                data.container.dateTo5 &&
                `<h3>5th Date</h3>
            <p><b>Date To (DD/MM/YYYY):</b>${
                (data.container.dateTo5 && data.container.dateTo5.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Date From (DD/MM/YYYY): </b>${
                (data.container.dateFrom5 && data.container.dateFrom5.toString().substring(0, 10)) || ""
            }</p>
            <p><b>Hours Worked: </b>${data.container.hoursWorked5 || ""}</p>
            <p><b>Hourly Wage: </b>${data.container.hourlyWage5 || ""}</p>
            <p><b>Total: </b>${data.container.total5 || ""}</p>`
            }
            <p><b>Total MERCs for Claim Period:</b>${data.container.totalMERCs || ""}</p>
            <p><b>Summary of job activities and client issues (if any)</b>:</p>
            <p>${data.container.clientIssues1 || ""}</p>
            <p><b>Signatory: </b> ${data.container.signatory1 || ""}</p>
            `
            ],
            ["https://www.workbc.ca"],
            ["WorkBC Wage Subsidy"]
        )
    } else {
        emailHTML = generateHTMLEmail(
            `Wage Subsidy Application Submitted`,
            [
                `
                <h2>Wage Subsidy application</h2>
                <p>Application ID:  ${data.applicationId || ""}</p>
                <p>Organization Name:  ${data.operatingName || ""}</p>
                <p>CA:  ${data.catchmentNo || ""}</p>
                <hr />
                <h5>Business Information</h5>
                <p>CRA Business Number:  ${data.businessNumber || ""}</p>
                <p>Address:  ${data.businessAddress || ""}</p>
                <p>City/Town:  ${data.businessCity || ""}</p>
                <p>Province:  ${data.businessProvince || ""}</p>
                <p>Postal Code:  ${data.businessPostal || ""}</p>
                <p>Employer E-mail Address:  ${data.businessEmail || ""}</p>
                <p>Phone Number:  ${data.businessPhone || ""}</p>
                <p>Fax:  ${data.businessFax || ""}</p>
                    <hr />
                <h5>Business Questions</h5>
                <p>Type of Sector:  ${data.sectorType || ""}</p>
                <p>Type of Industry:  ${data.typeOfIndustry || ""}</p>
                <p>Size of Organization(number of employees):  ${data.organizationSize || ""}</p>
                <p>Are you actively participating in the Canada Emergency Wage Subsidy program?  ${
                    data.CEWSAndOrCRHP || ""
                }</p>
                <p>Will the subsidy result in the displacement of existing employees or volunteers?  ${
                    data.employeeDisplacement || ""
                }</p>
                <p>Is there a labour stoppage or labour - management dispute in progress?  ${
                    data.labourDispute || ""
                }</p>
                <p>Is there Union concurrence?  ${data.unionConcurrence || ""}</p>
                <p>Does your organization have 3rd Party liability coverage?  ${data.liabilityCoverage || ""}</p>
                <p>Is your organization currently receiving funding under a WorkBC Wage Subsidy agreement?  ${
                    data.wageSubsidy || ""
                }</p>
                <p>${
                    data.operatingName || ""
                } meets the eligibility criteria and acknowledges that all the obligations the employer owes to or has with
                respect to its other employees under the various listed statutes and all other applicable laws apply equally
                to an individual employed in a wage subsidy placement:      ${
                    data.orgEligibilityConsent ? "Yes" : "No"
                }</p>
                <p>${
                    data.operatingName || ""
                } certifies that it is in full compliance with all applicable laws, including the Employment Standards Act,
                the Workers Compensation Act and the Human Rights Code:      ${
                    data.lawComplianceConsent ? "Yes" : "No"
                }.</p>
                <hr />
                <h5>WorkBC Insurance Coverage:${data.WSBCCoverage || ""}</h5>
                <p>WorkSafe BC Number:  ${data.WSBCNumber || ""}</p>
                <h5>Position 1 </h5>
                <p>Position Title:  ${data.positionTitle0 || ""}</p>
                <p>Number of Available Positions:  ${data.numberOfPositions0 || ""}</p>
                <p>Employee Email 1:  ${data.employeeEmail0 || ""}</p>
                <p>Employee Email 2:  ${data.employeeEmail1 || ""}</p>
                <p>Employee Email 3:  ${data.employeeEmail2 || ""}</p>
                <p>Employee Email 4:  ${data.employeeEmail3 || ""}</p>
                <p>Employee Email 5:  ${data.employeeEmail4 || ""}</p>
                <p>Anticipated Start Date (DD/MM/YYYY):  ${
                    data.startDate0 && data.startDate0.toString().substring(0, 10)
                }</p>
                <p>Hours of Work Per Week: ${data.hours0 || ""}</p>
                <p>Hourly Wage: ${data.wage0 || ""}</p>
                <p>Mandatory Employment Related Costs (MERCs): ${data.applicationMERCs0}</p>
                <p>Description of Duties: ${data.duties0 || ""}</p>
                <p>Skills: ${data.skills0 || ""}</p>
                <p>Work Experience: ${data.workExperience0 || ""}</p>
                <h5>Position 2 (only if different from above) </h5>
                <p>Position Title:  ${data.positionTitle1 || ""}</p>
                <p>Number of Available Positions:  ${data.numberOfPositions1 || ""}</p>
                <p>Anticipated Start Date (DD/MM/YYYY):  ${
                    (data.startDate1 && data.startDate1.toString().substring(0, 10)) || ""
                }</p>
                <p>Hours of Work Per Week: ${data.hours1 || ""}</p>
                <p>Hourly Wage: ${data.wage1 || ""}</p>
                <p>Mandatory Employment Related Costs (MERCs): ${data.applicationMERCs1 || ""}</p>
                <p>Description of Duties: ${data.duties1 || ""}</p>
                <p>Skills: ${data.skills1 || ""}</p>
                <p>Work Experience: ${data.workExperience1 || ""}</p>
                <hr />
                <h5>Signatory names and Organization consent</h5>
                <p>Signing Authority Full Name:  ${data.signatory1 || ""}</p>
                <p>Signing Authority Title:  ${data.signatoryTitle || ""}</p>
                <p>I acknowledge and understand that by clicking the "submit" I am attaching
                my electronic signature to this form and that by doing so I acquire the same
                rights, incur the same obligations and confer the same consent as I would by
                manually signing a physical copy of this form:      ${data.organizationConsent || ""}</p></p>
                        `
            ],
            ["https://www.workbc.ca"],
            ["WorkBC Wage Subsidy"]
        )
    }
    return emailHTML
}

export const sendEmail = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        // const token = await getToken()
        // console.log(data)
        const recipients = Object.keys(data)
            .map((key: string) => {
                if (key.includes("employeeEmail") || key.includes("employerEmail")) {
                    return data[key]
                }
                return null
            })
            .filter((email: string) => email !== null)
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        const emailHTML = createEmail(data)
        await emailService.sendEmail(await getToken(), emailHTML, `Wage Subsidy Application Submitted`, recipients)
        // console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
