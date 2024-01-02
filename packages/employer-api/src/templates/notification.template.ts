// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const applicationNotification = (catchmentNo: string, catchmentName: string, type: string) => {
    const claimsUrl = `${process.env.WAGE_SUB_URL}/#/claims`
    const applicationsUrl = `${process.env.WAGE_SUB_URL}/#/applications`
    const email = generateHTMLEmail(
        `A Wage Subsidy${type === "claim" ? " Claim" : ""} Application has been submitted`,
        [
            ` Hello `,
            ` You are receiving this email because you enabled notifications on Wage Subsidy ${
                type === "claim" ? "Claim Forms" : "Applications"
            } for Catchment ${catchmentNo} - ${catchmentName}.`
        ],
        [
            `Please log into the <a href="${
                type === "application" ? applicationsUrl : claimsUrl
            }">Wage Subsidy Platform </a> to view the application.`
        ],
        [`Sincerely,<br><b>Your WorkBC team<br></b>`]
    )
    return email
}

export default {
    applicationNotification
}
