import axios, { AxiosResponse } from "axios"

export const getCDOGSToken = async () => {
    try {
        const authURL = `${process.env.CDOGS_KEYCLOAK_AUTH}/realms/${process.env.COMMON_SERVICES_AUTH_REALM}/protocol/openid-connect/token`
        const params = new URLSearchParams()
        params.append("grant_type", "client_credentials")
        const config = {
            auth: {
                username: process.env.CDOGS_CLIENT || "",
                password: process.env.CDOGS_CLIENT_SECRET || ""
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const authResponse: AxiosResponse = await axios.post(authURL, params, config)
        const token: string = authResponse.data.access_token
        return token
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status)
    }
}

export const getCHEFSToken = async () => {
    try {
        const authURL = `${process.env.COMMON_SERVICES_KEYCLOAK_AUTH}/realms/${process.env.CUSTOM_AUTH_REALM}/protocol/openid-connect/token`
        const params = new URLSearchParams()
        params.append("grant_type", "client_credentials")
        const config = {
            auth: {
                username: process.env.CHEFS_CLIENT || "",
                password: process.env.CHEFS_CLIENT_SECRET || ""
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const authResponse: AxiosResponse = await axios.post(authURL, params, config)
        const token: string = authResponse.data.access_token
        return token
    } catch (error: any) {
        console.log(error)
        throw new Error(error.response?.status)
    }
}
