import { AppEnv } from "../types"
const APP_ENV = process.env.REACT_APP_ENVIRONMENT || "Local Dev"

export const setAbsoluteWageSubUrl = (): string => {
    switch (APP_ENV) {
        case "Local Dev":
            return "https://wage-sub-dev.es.workbc.ca"
        case "Test":
            return "https://wage-sub-test.es.workbc.ca/"
        default:
            return "http://localhost:3000"
    }
}

export const setEnvVariables = (): { appEnv: AppEnv; absolutePath: string } => {
    const appEnv = APP_ENV === "Local Dev" ? "Local Dev" : "Test"
    const absolutePath = setAbsoluteWageSubUrl()
    return { appEnv, absolutePath }
}
