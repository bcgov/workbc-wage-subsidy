import axios, { AxiosInstance } from "axios"

const chefsBaseUrl = process.env.CHEFS_URL || ""
const formsBaseUrl = process.env.FORMS_API_URL || ""
const cdogsBaseUrl = process.env.CDOGS_HOST || ""
const authBaseUrl = process.env.AUTH_KEYCLOAK_SERVER_URL || ""
const oesBaseUrl = process.env.OES_URL || ""
const fromAPI = process.env.FORMS_API_URL || ""

export const chefsApi: AxiosInstance = axios.create({
    baseURL: chefsBaseUrl
})

export const cdogsApi: AxiosInstance = axios.create({
    baseURL: cdogsBaseUrl
})

export const formsApi: AxiosInstance = axios.create({
    baseURL: formsBaseUrl
})

export const authApi: AxiosInstance = axios.create({
    baseURL: authBaseUrl
})

export const oesApi: AxiosInstance = axios.create({
    baseURL: oesBaseUrl
})

export const wageSubFormApi: AxiosInstance = axios.create({
    baseURL: fromAPI
})
