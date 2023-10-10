// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const applicationNotification = (catchmentNo: string) => {
    const email = generateHTMLEmail(
        "A Wage Subsidy Claim Application has been submitted",
        [
            ` Hello `,
            ` You are receiving this email because you enabled notifications on Wage Subsidy Applications in catchment ${
                catchmentNo.split("-")[0]
            }.`
        ],
        [`Please log into the <a href="${process.env.SP_URL}">Wage Subsidy Platform </a> to view the application.`],
        [`Sincerely,<br><b>Your WorkBC team<br></b>`]
    )
    return email
}

export default {
    applicationNotification
}
