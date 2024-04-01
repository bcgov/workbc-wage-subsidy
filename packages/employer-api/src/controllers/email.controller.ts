/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-relative-packages
import { Notification } from "../typings/emailData"
import pins from "../constants/centres.json"

import notificationService from "../services/notification.service"
import * as emailService from "../services/email.service"
import received from "../templates/received.template"
import notificationTemplate from "../templates/notification.template"

const createEmailHTMLBasedOnType = (applicationType: string, applicantType: string) => {
    let emailHTML = ""
    if (String(applicationType) === "HaveEmployee") {
        if (applicantType === "employee") {
            emailHTML = received.employeeReceivedHaveEmployee()
        } else if (applicantType === "employer") {
            emailHTML = received.employerReceivedHaveEmployee()
        }
    } else if (String(applicationType) === "NeedEmployee") {
        emailHTML = received.employerReceivedNeedEmployee()
    }
    return emailHTML
}

export const sendEmail = async (formData: any) => {
    try {
        const { data } = formData
        const applicationType = String(data.applicationType)
        let employerRecipients: string[] = []
        const employeeRecipients: string[] = []
        if (String(applicationType) === "HaveEmployee") {
            Object.keys(data).forEach((key: string) => {
                employerRecipients = [data.employerEmail]
                if (key.includes("employeeEmail")) {
                    if (!employeeRecipients.includes(data[key])) {
                        employeeRecipients.push(data[key])
                    }
                }
                if (key.includes("position2")) {
                    Object.keys(data[key]).forEach((k: string) => {
                        if (k.includes("employeeEmail")) {
                            // check if email in employee recipients array already
                            if (!employeeRecipients.includes(data[key][k])) {
                                employeeRecipients.push(data[key][k])
                            }
                        }
                    })
                }
            })
            // if it is a Need Employee email, only send the employer a confirmation email
        } else if (String(applicationType) === "NeedEmployee") {
            employerRecipients = [data.employerEmail]
        }

        const employerEmailHTML = createEmailHTMLBasedOnType(applicationType, "employer")
        const employeeEmailHTML = createEmailHTMLBasedOnType(applicationType, "employee")

        // Send the emails //
        if (employerRecipients.length !== 0) {
            await emailService
                .sendEmail(employerEmailHTML, `Wage Subsidy Application Submitted`, employerRecipients)
                .catch((e) => {
                    console.log(`[email.controller] error sending employer email`)
                })
        }
        if (employeeRecipients.length !== 0) {
            await emailService
                .sendEmail(employeeEmailHTML, `Wage Subsidy Application Submitted`, employeeRecipients)
                .catch((e) => {
                    console.log(`[email.controller] error sending employee email(s)`)
                })
        }

        // Get catchment number and then proceed to send notifications to all users who have enabled notifications on that catchment's applications
        if (
            String(applicationType) === "HaveEmployee" ||
            String(applicationType) === "NeedEmployee" ||
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
                console.log(`[email.controller] No notifications found for catchment ${data.catchmentNo}`)
            }
            // Send notifications emails to clients with notifications enabled (entry in notifications table)
            await Promise.all(
                notificationList.map(async (notification: Notification) => {
                    await emailService.sendEmail(
                        notificationHTML,
                        `New Wage Subsidy${String(applicationType) === "Claims" ? " Claim" : ""} Application Submitted`,
                        [notification.email]
                    )
                })
            )
        }

        return "Email sent"
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e)
        throw new Error("Email failed to send")
    }
}
