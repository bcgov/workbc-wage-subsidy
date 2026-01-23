/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from "axios"

export const getPermission = async (guid: string, isIDIR: boolean) => {
    const url = process.env.SAM_API_URL as string
    const username = process.env.SAM_API_USERNAME as string
    const password = process.env.SAM_API_PASSWORD as string
    const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64")
    const response = await axios
        .get(url, {
            params: {
                userGUID: guid,
                // eslint-disable-next-line object-shorthand
                isIDIR: isIDIR
            },
            headers: {
                Authorization: `Basic ${token}`
            }
        })
        .catch((error) => {
            console.log(error)
            return error
        })
    return response.data
}
