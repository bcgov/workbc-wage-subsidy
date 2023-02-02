import axios, { AxiosInstance } from "axios"

const chesBaseUrl = process.env.CHES_HOST || ""
const authBaseUrl = process.env.AUTH_KEYCLOAK_SERVER_URL || ""

export const chesApi: AxiosInstance = axios.create({
    baseURL: chesBaseUrl
})

export const authApi: AxiosInstance = axios.create({
    baseURL: authBaseUrl
})
