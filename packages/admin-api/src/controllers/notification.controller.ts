/* eslint-disable camelcase */
import express from "express"
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as notificationService from "../services/notification.service"
import { getCatchments } from "../lib/catchment"

export const getNotifications = async (req: any, res: express.Response) => {
    try {
        const { catchmentNo, type } = req.query
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (catchments.length === 0 || !catchments.includes(Number(catchmentNo))) {
            return res.status(403).send("Forbidden")
        }
        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Bad Request")
        }
        const { email, idp_username, identity_provider } = req.kauth.grant.access_token.content
        if (email === undefined || idp_username === undefined || identity_provider === undefined) {
            return res.status(403).send("Forbidden")
        }
        const username = `${idp_username}@${identity_provider}`
        const notifications = await notificationService.getNotifications(email, Number(catchmentNo), type, username)
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

        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Bad Request")
        }
        const { email, idp_username, identity_provider } = req.kauth.grant.access_token.content
        if (email === undefined || idp_username === undefined || identity_provider === undefined) {
            return res.status(403).send("Forbidden")
        }
        const username = `${idp_username}@${identity_provider}`
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
        if (type !== "application" && type !== "claim") {
            return res.status(400).send("Bad Request")
        }
        const { email, idp_username, identity_provider } = req.kauth.grant.access_token.content
        if (email === undefined || idp_username === undefined || identity_provider === undefined) {
            return res.status(403).send("Forbidden")
        }
        const username = `${idp_username}@${identity_provider}`
        const result = await notificationService.deleteNotification(email, Number(catchmentNo), type, username)
        return res.status(200).send(result)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const checkNotificationEmail = async (req: any, res: express.Response) => {
    try {
        const { email, idp_username, identity_provider } = req.kauth.grant.access_token.content
        if (email === undefined || idp_username === undefined || identity_provider === undefined) {
            return res.status(403).send("Forbidden")
        }
        const username = `${req.kauth.grant.access_token.content.idp_username}@${req.kauth.grant.access_token.content.identity_provider}`
        const notifications = await notificationService.getAllNotificationsFromUser(username)
        await Promise.all(
            notifications.map(async (notification: any) => {
                if (notification.email !== req.kauth.grant.access_token.content.email) {
                    await notificationService.updateNotification(
                        notification.id,
                        req.kauth.grant.access_token.content.email,
                        notification.catchmentno,
                        notification.type,
                        username
                    )
                }
            })
        )
        const updatedNotifications = await notificationService.getAllNotificationsFromUser(username)
        return res.status(200).send(updatedNotifications)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Internal Server Error")
    }
}
