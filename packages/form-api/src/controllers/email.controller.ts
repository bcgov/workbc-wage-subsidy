/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as emailService from "../services/email.service"
import received from "../templates/received.template"

const createEmail = (data: any) => {
    let emailHTML = ""
    // in case of employee email, it is have employee application
    if (data.employeeEmail0) {
        emailHTML = received.receivedHaveEmployee()
        // in case of no employee email, it is need employee application
    } else if (data.positionTitle0 && data.employeeEmail0 === undefined) {
        emailHTML = received.receivedNeedEmployee()
    }
    return emailHTML
}

export const sendEmail = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        let recipients: string[] = []
        if (data.employeeEmail0 && data.employeeEmail0 !== null) {
            recipients = Object.keys(data)
                .map((key: string) => {
                    if (key.includes("employeeEmail")) {
                        return data[key]
                    }
                    return null
                })
                .filter((email: string) => email !== null)
                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        } else if (data.positionTitle0 && data.employeeEmail0 === undefined) {
            recipients = Object.keys(data)
                .map((key: string) => {
                    if (key.includes("businessEmail")) {
                        return data[key]
                    }
                    return null
                })
                .filter((email: string) => email !== null)
                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        }

        const emailHTML = createEmail(data)
        if (recipients.length !== 0) {
            await emailService.sendEmail(emailHTML, `Wage Subsidy Application Submitted`, recipients)
        }
        // console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e)
        return res.status(500).send("Server Error")
    }
}
