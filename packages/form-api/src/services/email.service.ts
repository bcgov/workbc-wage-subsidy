/* eslint-disable import/prefer-default-export */
import { AxiosResponse } from "axios"

import { chesApi } from "../config/config"

export const sendEmail = async (token: string, body: string, subject: string, contexts: any) => {
    try {
        const request = {
            // bcc: [],
            bodyType: "html",
            body,
            contexts,
            // cc: [],
            // delayTs: 0,
            encoding: "utf-8",
            from: "WorkBC Survey <noreply-workbc@gov.bc.ca>",
            priority: "normal",
            subject,
            // to: [email],
            // tag: tag,
            attachments: []
        }
        // console.log(request)
        const sendEmailResult: AxiosResponse = await chesApi.post("api/v1/emailMerge", request, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        // console.log(sendEmailResult.data)
        return sendEmailResult.data.messages[0].msgId
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status)
    }
}
