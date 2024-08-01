// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const catchmentMoveNotification = (catchmentNo: string, catchmentName: string, resource: string) => {
    const claimsUrl = `${process.env.WAGE_SUB_URL}/#/claims`
    const applicationsUrl = `${process.env.WAGE_SUB_URL}/#/applications`
    const email = generateHTMLEmail(
        `A Wage Subsidy ${
            resource === "Claim" ? "Claim Form" : "Application"
        } has been moved to Catchment ${catchmentNo} - ${catchmentName}`,
        [
            ` Hello, `,
            ` You are receiving this email because you enabled notifications on Wage Subsidy ${
                resource === "Claim" ? "Claim Forms" : "Applications"
            } for Catchment ${catchmentNo} - ${catchmentName}.`
        ],
        [
            `Please log into the <a href="${
                resource === "Application" ? applicationsUrl : claimsUrl
            }">Wage Subsidy Platform </a> to view the ${resource === "Claim" ? "Claim Form" : "Application"}.`
        ],
        [`Sincerely,<br><b>Your WorkBC team<br></b>`]
    )
    return email
}

export default {
    catchmentMoveNotification
}
