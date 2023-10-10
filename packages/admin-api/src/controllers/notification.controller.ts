import express from "express"
/* eslint-disable @typescript-eslint/no-explicit-any */
import notificationService from "../services/notification.service"

export const getNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.body
        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" || type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const notifications = await notificationService.getNotification(email, Number(catchmentNo), type)
        return res.status(200).send(notifications)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const addNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.body
        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" || type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const result = await notificationService.addNotification(email, Number(catchmentNo), type)
        return res.status(200).send(result)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.body
        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" || type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const result = await notificationService.deleteNotification(email, Number(catchmentNo), type)
        return res.status(200).send(result)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
