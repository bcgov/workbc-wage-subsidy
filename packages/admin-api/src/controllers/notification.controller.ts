import express from "express"
/* eslint-disable @typescript-eslint/no-explicit-any */
import notificationService from "../services/notification.service"
import { getCatchments } from "../lib/catchment"

export const getNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.query
        console.log(req.kauth.grant.access_token)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (catchments.length === 0 || !catchments.includes(Number(catchmentNo))) {
            return res.status(403).send("Forbidden")
        }

        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const username = `${req.kauth.grant.access_token.content.username}@${req.kauth.grant.access_token.content.identity_provider}`
        console.log(username)
        const notifications = await notificationService.getNotification(email, Number(catchmentNo), type, username)
        return res.status(200).send(notifications)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const addNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.body
        const catchments = await getCatchments(req.kauth.grant.access_token)

        if (catchments.length === 0 || !catchments.includes(Number(catchmentNo))) {
            return res.status(403).send("Forbidden")
        }

        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const username = `${req.kauth.grant.access_token.content.username}@${req.kauth.grant.access_token.content.identity_provider}`
        console.log(username)
        const result = await notificationService.addNotification(email, Number(catchmentNo), type, username)
        return res.status(200).send(result)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteNotification = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.body
        const catchments = await getCatchments(req.kauth.grant.access_token)

        if (catchments.length === 0 || !catchments.includes(Number(catchmentNo))) {
            return res.status(403).send("Forbidden")
        }

        const { email } = req.kauth.grant.access_token.content
        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Invalid type")
        }
        const username = `${req.kauth.grant.access_token.content.username}@${req.kauth.grant.access_token.content.identity_provider}`
        console.log(username)
        const result = await notificationService.deleteNotification(email, Number(catchmentNo), type, username)
        return res.status(200).send(result)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
