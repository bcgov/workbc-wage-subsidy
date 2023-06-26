import { chefsApi } from "../config/config"

export const getFormSubmissions = async (formID: string, formPass: string, params: any) => {
    try {
        const url = `forms/${formID}/submissions`
        const p = new URLSearchParams(params)
        const config = {
            auth: {
                username: formID,
                password: formPass
            },
            headers: {
                "Content-Type": "application/json"
            },
            params: p
        }
        const formSubmissionResponse = await chefsApi.get(url, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}

export const getSubmission = async (formID: string, formPass: string, submissionID: string) => {
    try {
        const url = `submissions/${submissionID}`
        const config = {
            auth: {
                username: formID,
                password: formPass
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
        const formSubmissionResponse = await chefsApi.get(url, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}

export const createDraft = async (
    token: string,
    formID: string,
    formPass: string,
    formVersionID: string,
    prefillFields: any
) => {
    try {
        const url = `forms/${formID}/versions/${formVersionID}/submissions`
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        const formSubmissionResponse = await chefsApi.post(url, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}
