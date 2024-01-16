/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex } from "../config/db-config"

export const getAllNotificationsFromUser = async (username: string) => {
    const notifications = await knex("notifications").where("username", username)
    return notifications
}

export const getNotifications = async (email: string, catchmentNo: number, type: string, username: string) => {
    const notifications = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
        .andWhere("username", username)
    return notifications
}

export const addNotification = async (email: string, catchmentNo: number, type: string, username: string) => {
    const data = {
        email,
        catchmentno: catchmentNo,
        type,
        username
    }
    const result = await knex("notifications")
        .insert(data)
        .returning(["id", "email", "catchmentno", "type", "username"])
    return result
}

export const updateNotification = async (
    id: number,
    email: string,
    catchmentNo: number,
    type: string,
    username: string
) => {
    const data = {
        email,
        catchmentno: catchmentNo,
        type,
        username
    }
    const result = await knex("notifications")
        .where("id", id)
        .update(data)
        .returning(["id", "email", "catchmentno", "type", "username"])
    return result
}

export const deleteNotification = async (email: string, catchmentNo: number, type: string, username: string) => {
    const result = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
        .andWhere("username", username)
        .del()
        .returning(["id", "email", "catchmentno", "type", "username"])
    return result
}
