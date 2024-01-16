import axios, { AxiosInstance } from "axios"

const chefsBaseUrl = process.env.CHEFS_URL || ""

// eslint-disable-next-line import/prefer-default-export
export const chefsApi: AxiosInstance = axios.create({
    baseURL: chefsBaseUrl
})
