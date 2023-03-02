/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as emailService from "../services/email.service"
import { getToken } from "../services/common.service"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

const createEmail = (data: any) => {
    const emailHTML = generateHTMLEmail(
        "WorkBC Wage Subsidy Application - Next Steps",
        [
            `Hello,`,
            `You’re receiving this email because your future employer recently applied for a WorkBC Wage Subsidy.`,
            `WorkBC is a provincial government service that helps residents of B.C. improve their skills, explore career options, and find employment.`
        ],
        [
            `Only a few steps remain before you are back at work.`,
            `If you are participating in WorkBC Services, contact your Employment Counsellor right away, before taking the steps below.`,
            `If you are NOT already participating in WorkBC Services, please follow these steps:`,
            `<b>Step 1:</b> Register for Online Employment Services.`,
            `<b>Step 2:</b> Complete an online application. Click <a href="https://apply.workbc.ca/">here</a> to get started and ensure you <b>select WorkBC Self-Serve<b> to begin your application.`,
            `<img class="img-fluid" src="/images/workbc_self_serve.png" alt="WorkBC Self Serve Option" style="height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;">`,
            `When selecting your WorkBC Centre, select the community where your job is located.`,
            `<img class="img-fluid" src="/images/workbc_community_select.png" alt="WorkBC Community Selector" style="height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;">`,
            `<b>Step 3:</b> Let your employer know you have applied! A team member will be in touch soon.`
        ],
        [
            `<b>Why use WorkBC?</b></p><p>
          <ul>
            <li>
              <b>Expertise: </b>We're ready to help you start career planning now or get you ready for the next phase of BC's COVID-19 Restart Plan.</li>
            <li>
              <b>Free Services: </b>We offer skills training and personalized, one-on-one job counselling. WorkBC services are completely free.</li>
            <li>
              <b>Benefits: </b>You might also be eligible for exclusive benefits.</li>
          </ul>
          `,
            `Sincerely,<br><b>Your WorkBC team<br></b>`
        ]
    ) // html body
    return emailHTML
}

export const sendEmail = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        // const token = await getToken()
        // console.log(data)
        const recipients = Object.keys(data)
            .map((key: string) => {
                if (key.includes("employeeEmail")) {
                    return data[key]
                }
                return null
            })
            .filter((email: string) => email !== null)
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        const emailHTML = createEmail(data)
        if (recipients.length !== 0) {
            await emailService.sendEmail(await getToken(), emailHTML, `Wage Subsidy Application Submitted`, recipients)
        }
        // console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
