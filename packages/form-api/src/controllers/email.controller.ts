/* eslint-disable import/prefer-default-export */
import * as express from "express"

// eslint-disable-next-line import/no-relative-packages
import { Notification } from "../../../typings/emailData"
import pins from "../constants/centres.json"

import notificationService from "../services/notification.service"
import * as emailService from "../services/email.service"
import received from "../templates/received.template"
import notificationTemplate from "../templates/notification.template"

const createEmailHTMLBasedOnType = (applicationType: string) => {
    let emailHTML = ""
    if (String(applicationType) === "HaveEmployee") {
        emailHTML = received.receivedHaveEmployee()
    } else if (String(applicationType) === "needEmployee") {
        emailHTML = received.receivedNeedEmployee()
    }
    return emailHTML
}

export const sendEmail = async (req: express.Request, res: express.Response) => {
    try {
        // console.log(req.body)
        const { data } = req.body
        const applicationType = String(req.body.applicationType)
        let recipients: string[] = []
        if (String(applicationType) === "HaveEmployee") {
            recipients = Object.keys(data)
                .map((key: string) => {
                    if (key.includes("employeeEmail")) {
                        return data[key]
                    }
                    return null
                })
                .filter((email: string) => email !== null)
                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
            // if it is a Need Employee email, only send the employer a confirmation email
        } else if (String(applicationType) === "needEmployee") {
            recipients = [data.employerEmail]
        }

        const emailHTML = createEmailHTMLBasedOnType(applicationType)
        console.log(recipients, emailHTML)
        if (recipients.length !== 0) {
            await emailService.sendEmail(emailHTML, `Wage Subsidy Application Submitted`, recipients)
        }

        // Get catchment number and then proceed to send notifications to all users who have enabled notifications on that catchment's applications
        if (
            String(applicationType) === "HaveEmployee" ||
            String(applicationType) === "needEmployee" ||
            String(applicationType) === "Claims"
        ) {
            const catchmentName = pins.find((pin) => Number(pin.CatchmentNo) === Number(data.catchmentNo))?.Title
            const notificationHTML = notificationTemplate.applicationNotification(
                `${data.catchmentNo}`,
                catchmentName || "",
                String(applicationType) === "Claims" ? "claim" : "application"
            )
            const notificationList = await notificationService.getNotification(
                Number(data.catchmentNo),
                String(applicationType) === "Claims" ? "claim" : "application"
            )
            if (notificationList.length === 0) {
                return res.status(200).send("No notifications to send")
            }
            // Send notifications emails to clients with notifications enabled (entry in notifications table)
            await Promise.all(
                notificationList.map(async (notification: Notification) => {
                    await emailService.sendEmail(
                        notificationHTML,
                        `New Wage Subsidy ${
                            String(applicationType) === "Claims" ? "Claims" : ""
                        } Application Submitted`,
                        [notification.email]
                    )
                })
            )
        }

        // console.log(email)
        return res.status(200).send("Email sent")
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e)
        return res.status(500).send("Server Error")
    }
}
