/* eslint-disable import/prefer-default-export */
import { AxiosResponse } from "axios"

import { getToken } from "./common.service"

import { chesApi } from "../config/config"

export const sendEmail = async (body: string, subject: string, to: string[]) => {
    try {
        const token = await getToken()
        console.log(body)
        const request = {
            // bcc: [],
            bodyType: "html",
            body,
            // cc: [],
            // delayTs: 0,
            encoding: "utf-8",
            from: "WorkBC Wage Subsidy <noreply-workbc@gov.bc.ca>",
            priority: "normal",
            subject,
            to,
            // tag: tag,
            attachments: []
        }
        // console.log(request)
        const sendEmailResult: AxiosResponse = await chesApi.post("api/v1/email", request, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        // console.log(sendEmailResult.data)
        return sendEmailResult
    } catch (error: any) {
        console.log(JSON.stringify(error.response?.data))
        throw new Error(error.response?.status)
    }
}
