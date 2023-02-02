/* eslint-disable import/prefer-default-export */
import * as express from "express"

// import * as emailService from "../services/email.service"
import { getToken } from "../services/common.service"

export const sendEmail = async (req: any, res: express.Response) => {
    try {
        const { data } = req.body
        const token = await getToken()
        console.log(token)
        console.log(data)
        // console.log(email)
        return res.status(403).send("Email sent")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
