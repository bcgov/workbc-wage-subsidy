/* eslint-disable @typescript-eslint/no-explicit-any */
import { knex } from "../config/db-config"

const getNotification = async (email: string, catchmentNo: number, type: string) => {
    const notifications = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
    console.log(notifications)
    return notifications
}

const addNotification = async (email: string, catchmentNo: number, type: string) => {
    const data = {
        email,
        catchmentno: catchmentNo,
        type
    }
    const result = await knex("notifications").insert(data).returning(["id", "email", "catchmentno", "type"])
    console.log(result)
    return result
}

const deleteNotification = async (email: string, catchmentNo: number, type: string) => {
    const result = await knex("notifications")
        .where("email", email)
        .andWhere("catchmentno", catchmentNo)
        .andWhere("type", type)
        .del()
        .returning(["id", "email", "catchmentno", "type"])
    console.log(result)
    return result
}

export default {
    getNotification,
    addNotification,
    deleteNotification
}
