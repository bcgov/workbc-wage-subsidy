/* eslint-disable import/prefer-default-export */
import * as express from "express"

// eslint-disable-next-line import/no-relative-packages
import { NeedEmployeeData, Notification } from "../../../typings/emailData"

import notificationService from "../services/notification.service"
import * as emailService from "../services/email.service"
import received from "../templates/received.template"
import notificationTemplate from "../templates/notification.template"

const createEmail = (data: NeedEmployeeData) => {
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

export const sendEmail = async (req: express.Request, res: express.Response) => {
    try {
        const { data } = req.body
        let recipients: string[] = []
        console.log(data)
        if (data.applicationType === "HaveEmployee") {
            recipients = Object.keys(data)
                .map((key: string) => {
                    if (key.includes("employeeEmail")) {
                        return data[key]
                    }
                    return null
                })
                .filter((email: string) => email !== null)
                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
        } else if (data.applicationType === "NeedEmployee") {
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

        // Get catchment number and then proceed to send notifications to all users who have enabled notifications on that catchment's applications
        if (data.applicationType === "HaveEmployee" || data.applicationType === "NeedEmployee") {
            const notificationHTML = notificationTemplate.applicationNotification(`${data.catchmentNo}`, "application")
            const notificationList = await notificationService.getNotification(Number(data.catchmentNo), "application")
            notificationList.forEach(async (notification: Notification) => {
                await emailService.sendEmail(notificationHTML, `New Wage Subsidy Application Submitted`, [
                    notification.email
                ])
            })
        }

        // console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e)
        return res.status(500).send("Server Error")
    }
}
