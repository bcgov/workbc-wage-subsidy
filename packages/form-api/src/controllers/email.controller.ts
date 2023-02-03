/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as emailService from "../services/email.service"
import { getToken } from "../services/common.service"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const generateHTMLEmail = require("../utils/htmlEmail")

export const sendEmail = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        // const token = await getToken()
        console.log(data)
        const recipients = Object.keys(data)
            .map((key: string) => {
                console.log(key)
                if (key.includes("employeeEmail") || key.includes("employerEmail")) {
                    return data[key]
                }
                return null
            })
            .filter((email: string) => email !== null)
            .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        // console.log(data.internalId.toString().substring(0, 8).toUpperCase())
        const emailHTML = generateHTMLEmail(
            `Wage Subsidy Application ${data.internalId.toString().substring(0, 8).toUpperCase()}`,
            [
                `<p>Thank you for submitting your Wage Subsidy Application. Your application confirmation number is ${data.internalId
                    .toString()
                    .substring(0, 8)
                    .toUpperCase()}. You will receive an email when your application has been processed.</p>`
            ],
            ["https://www.workbc.ca"],
            ["WorkBC"]
        )
        const email = await emailService.sendEmail(
            await getToken(),
            emailHTML,
            `Wage Subsidy Application ${data.internalId.toString().substring(0, 8).toUpperCase()}`,
            recipients
        )
        console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
