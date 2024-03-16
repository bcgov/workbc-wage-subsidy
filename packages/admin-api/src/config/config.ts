import axios, { AxiosInstance } from "axios"

const chefsBaseUrl = process.env.CHEFS_URL || ""
const authBaseUrl = process.env.AUTH_KEYCLOAK_SERVER_URL || ""

// eslint-disable-next-line import/prefer-default-export
export const chefsApi: AxiosInstance = axios.create({
    baseURL: chefsBaseUrl
})

export const authApi: AxiosInstance = axios.create({
    baseURL: authBaseUrl
})
