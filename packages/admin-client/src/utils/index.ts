import { AppEnv } from "../types"
const APP_ENV = process.env.REACT_APP_ENVIRONMENT || "Local Dev"

export const setAbsoluteWageSubUrl = (): string => {
    switch (APP_ENV) {
        case "Local Dev":
            return "http://localhost:3000/"
        case "TEST":
            return "https://wage-sub-test.es.workbc.ca/"
        case "DEV":
            return "https://wage-sub-dev.es.workbc.ca/"
        case "PRODUCTION":
            return "https://wage-subsidy.es.workbc.ca/"
        default:
            return "http://localhost:3000/"
    }
}

export const setAppEnv = (): AppEnv => {
    switch (APP_ENV) {
        case "Local Dev":
            return "Local Dev"
        case "DEV":
            return "DEV"
        case "TEST":
            return "TEST"
        case "PRODUCTION":
            return "PRODUCTION"
        default:
            return "Local Dev"
    }
}

export const setEnvVariables = (): { appEnv: AppEnv; absolutePath: string } => {
    const appEnv = setAppEnv()
    const absolutePath = setAbsoluteWageSubUrl()
    return { appEnv, absolutePath }
}
