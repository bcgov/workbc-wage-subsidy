import { knex } from "../config/db-config"

const getNotification = async (catchmentNo: number, type: string) => {
    const notifications = await knex("notifications").where("catchmentno", catchmentNo).andWhere("type", type)
    return notifications
}

export default {
    getNotification
}
