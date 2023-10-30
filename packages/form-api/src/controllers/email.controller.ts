/* eslint-disable import/prefer-default-export */
import * as express from "express"

// eslint-disable-next-line import/no-relative-packages
import { NeedEmployeeData, Notification } from "../../../typings/emailData"
import pins from "../constants/centres.json"

import notificationService from "../services/notification.service"
import * as emailService from "../services/email.service"
import received from "../templates/received.template"
import notificationTemplate from "../templates/notification.template"

const createEmailHTMLBasedOnType = (data: NeedEmployeeData) => {
    let emailHTML = ""
    if (data.applicationType === "HaveEmployee") {
        emailHTML = received.receivedHaveEmployee()
    } else if (data.applicationType === "NeedEmployee") {
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

        const emailHTML = createEmailHTMLBasedOnType(data)
        if (recipients.length !== 0) {
            console.log("Sending email to: ", recipients)
            await emailService.sendEmail(emailHTML, `Wage Subsidy Application Submitted`, recipients)
        }

        // Get catchment number and then proceed to send notifications to all users who have enabled notifications on that catchment's applications
        if (
            data.applicationType === "HaveEmployee" ||
            data.applicationType === "NeedEmployee" ||
            data.applicationType === "Claims"
        ) {
            const catchmentName = pins.find((pin) => Number(pin.CatchmentNo) === Number(data.catchmentNo))?.Title
            const notificationHTML = notificationTemplate.applicationNotification(
                `${data.catchmentNo}`,
                catchmentName || "",
                data.applicationType === "Claims" ? "claim" : "application"
            )
            const notificationList = await notificationService.getNotification(
                Number(data.catchmentNo),
                data.applicationType === "Claims" ? "claim" : "application"
            )
            // Send notifications emails to clients with notifications enabled (entry in notifications table)
            await Promise.all(
                notificationList.map(async (notification: Notification) => {
                    await emailService.sendEmail(
                        notificationHTML,
                        `New Wage Subsidy ${data.applicationType === "Claims" && "Claims"} Application Submitted`,
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
