// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const applicationNotification = (catchmentNo: string, catchmentName: string, type: string, formID?: string) => {
    const claimsUrl = `${process.env.WAGE_SUB_URL}/#/claims`
    const applicationsUrl = `${process.env.WAGE_SUB_URL}/#/applications`
    const newApplicationUrl = `${process.env.APPLICATION_NOTIFICATION_URL}${formID}`
    const newClaimUrl = `${process.env.CLAIM_NOTIFICATION_URL}${formID}`    
    const email = generateHTMLEmail(
        `A Wage Subsidy ${type === "claim" ? "Claim Form" : "Application"} has been submitted`,
        [
            ` Hello `,
            ` You are receiving this email because you enabled notifications on Wage Subsidy ${
                type === "claim" ? "Claim Forms" : "Applications"
            } for Catchment ${catchmentNo} - ${catchmentName}.`
        ],
        [
            `Please log into the Wage Subsidy Platform to view the 
            <a href="${type === "application" ?  newApplicationUrl : newClaimUrl}"> ${type==="application" ? "Application" : "Claim Form"} </a>`
        ],
        [`Sincerely,<br><b>Your WorkBC team<br></b>`]
    )
    return email
}

export default {
    applicationNotification
}
