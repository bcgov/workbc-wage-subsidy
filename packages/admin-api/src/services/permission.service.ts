/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from "axios"

export const getPermission = async (guid: string) => {
    const url = `${process.env.SAM_API_URL}`
    const response = await axios
        .get(`${url}${guid}`, {
            auth: {
                username: `${process.env.SAM_API_USERNAME}`,
                password: `${process.env.SAM_API_PASSWORD}`
            }
        })
        .then((response) => {
            console.log(response.data.filter((item: any) => item.Application === "WGS"))
            return response.data.filter((item: any) => item.Application === "WGS")
        })
        .catch((error) => {
            console.log(error)
            return error
        })
    return response
}
