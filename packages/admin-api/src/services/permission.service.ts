/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from "axios"

export const getPermission = async (guid: string, isIDIR: boolean) => {
    const url = process.env.SAM_API_URL as string
    console.log("SAM API USERNAME: ", `${process.env.SAM_API_USERNAME}`)
    const response = await axios({
        method: "GET",
        url,
        params: {
            userGUID: guid,
            // eslint-disable-next-line object-shorthand
            isIDIR: isIDIR
        },
        auth: {
            username: process.env.SAM_API_USERNAME as string,
            password: process.env.SAM_API_PASSWORD as string
        }
    })
    return response.data
}
