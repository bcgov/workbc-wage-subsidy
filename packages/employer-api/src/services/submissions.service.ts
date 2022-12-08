import { chefsApi } from "../config/config"

export const getFormSubmissions = async (formId: string, formPass: string, params: any) => {
    try {
        const url = `forms/${formId}/submissions`
        const p = new URLSearchParams(params)
        // console.log(p)
        // console.log(formId)
        // console.log(formPass)
        const config = {
            auth: {
                username: formId,
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

export const getSubmission = async (formId: string, formPass: string, submissionId: string) => {
    try {
        const url = `submissions/${submissionId}`
        // console.log(p)
        // console.log(formId)
        // console.log(formPass)
        const config = {
            auth: {
                username: formId,
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

export const anotherFunction = async () => ({ ok: "ok" })
