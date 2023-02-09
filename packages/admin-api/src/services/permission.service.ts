/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from "axios"

export const getPermission = async (guid: string, isIDIR: boolean) => {
    const url = `${process.env.SAM_API_URL}`
    const response = await axios
        .get(`${url}`, {
            params: {
                userGUID: guid,
                // eslint-disable-next-line object-shorthand
                isIDIR: isIDIR
            },
            auth: {
                username: `${process.env.SAM_API_USERNAME}`,
                password: `${process.env.SAM_API_PASSWORD}`
            }
        })
        .then((response) => {
            // console.log(response.data.filter((item: any) => item.Application === "WGS"))
            return response.data.filter((item: any) => item.Application === "WGS")
        })
        .catch((error) => {
            console.log(error)
            return error
        })
    return response
}
