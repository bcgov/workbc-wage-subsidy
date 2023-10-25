/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex } from "../config/db-config"

const getNotification = async (email: string, catchmentNo: number, type: string, username: string) => {
    const notifications = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
        .andWhere("username", username)
    return notifications
}

const addNotification = async (email: string, catchmentNo: number, type: string, username: string) => {
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

const deleteNotification = async (email: string, catchmentNo: number, type: string, username: string) => {
    const result = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
        .andWhere("username", username)
        .del()
        .returning(["id", "email", "catchmentno", "type", "username"])
    return result
}

export default {
    getNotification,
    addNotification,
    deleteNotification
}
