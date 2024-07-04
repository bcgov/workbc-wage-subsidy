/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-relative-packages
import * as emailService from "../services/email.service"
import * as notificationService from "../services/notification.service"
import notificationTemplate from "../templates/catchment-move-notification.template"
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pins = require("../constants/centres.json")

export const sendEmail = async (resource: string, catchmentNo: number) => {
    try {
        // Get catchment number and then proceed to send notifications to all users who have enabled notifications on that catchment //
        const catchmentName = pins.find((pin: any) => Number(pin.CatchmentNo) === Number(catchmentNo))?.Title
        const notificationHTML = notificationTemplate.catchmentMoveNotification(
            `${catchmentNo}`,
            catchmentName || "",
            resource
        )

        // Calculate recipients //
        const notificationsList = await notificationService.getNotificationsForCatchment(
            catchmentNo,
            resource.toLowerCase()
        )
        const recipients = notificationsList.map((n: any) => n.email)
        if (recipients == null || recipients.length === 0) {
            console.log(`[email.controller] No recipients for catchment ${catchmentNo}`)
        } else {
            console.log(`[email.controller] Sending email(s) for catchment ${catchmentNo}`)
            await emailService
                .sendEmail(
                    notificationHTML,
                    `Wage Subsidy ${resource === "Claim" ? "Claim Form" : "Application"} Moved`,
                    recipients
                )
                .then(() => {
                    console.log(`[email.controller] Email(s) sent for catchment ${catchmentNo}`)
                })
                .catch(() => {
                    console.log(
                        `[email.controller] Error sending email(s) for catchment ${catchmentNo} and recipient(s) ${recipients}`
                    )
                    throw new Error()
                })
        }
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e)
        throw new Error("Email failed to send")
    }
}
