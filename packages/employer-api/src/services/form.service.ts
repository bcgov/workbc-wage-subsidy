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
        console.log(e.message)
        throw new Error(e.response?.status)
    }
}

export const createLoginProtectedDraft = async (
    accessToken: any,
    formID: string,
    formVersionID: string,
    internalID: string,
    prefillFields: any
) => {
    try {
        const url = `forms/${formID}/versions/${formVersionID}/submissions`
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken.token}`
            }
        }
        const data = {
            draft: true,
            submission: {
                data: {
                    lateEntry: false,
                    internalId: internalID, // TODO: do we need internalId as a concept?
                    employerEmail: accessToken.content.email,
                    businessEmail: accessToken.content.email,
                    operatingName: accessToken.content.bceid_business_name,
                    submit: false
                }
            }
        }
        const formSubmissionResponse = await chefsApi.post(url, data, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e.response)
        throw new Error(e.response?.status)
    }
}

export const createTeamProtectedDraft = async (
    formID: string,
    formPass: string,
    formVersionID: string,
    internalID: string,
    prefillFields: any
) => {
    try {
        const url = `forms/${formID}/versions/${formVersionID}/submissions`
        const config = {
            headers: {
                "Content-Type": "application/json"
            },
            auth: {
                username: formID,
                password: formPass
            }
        }
        const data = {
            draft: true,
            submission: {
                data: Object.assign(prefillFields, {
                    lateEntry: false,
                    internalId: internalID,
                    submit: false
                }),
                state: "draft"
            }
        }
        const formSubmissionResponse = await chefsApi.post(url, data, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e.response)
        throw new Error(e.response?.status)
    }
}
