import { wageSubFormApi } from "../config/config"

// eslint-disable-next-line import/prefer-default-export
export const sendNotifications = async (data: any) => {
    try {
        const url = `email`
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            mode: "cors"
        }
        const response = await wageSubFormApi.post(url, data, config)
        return response.data
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}
