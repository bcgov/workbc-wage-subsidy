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
        console.log(e)
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
                data: { ...prefillFields, lateEntry: false, internalId: internalID, submit: false, customEvent: false },
                state: "draft"
            }
        }
        const formSubmissionResponse = await chefsApi.post(url, data, config)
        return formSubmissionResponse.data
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}

export const shareForm = async (token: any, submissionID: string, userGUIDs: string[]) => {
    try {
        const url = `rbac/submissions`
        const data = {
            permissions: ["submission_update", "submission_read"]
        }
        for (const userGUID of userGUIDs) {
            console.log(`sharing form submission ${submissionID} with guid ${userGUID}`)
            const chefsUserID = await userLookup(token, userGUID)
            if (!chefsUserID) {
                console.log(`user guid ${userGUID} not found in CHEFS - skipping`)
                /* eslint-disable no-continue */
                continue
            }
            const config = {
                params: {
                    formSubmissionId: submissionID,
                    userId: chefsUserID
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            /* eslint-disable no-await-in-loop */
            await chefsApi
                .put(url, data, config)
                .then(() => console.log(`successfully shared form submission ${submissionID} with guid ${userGUID}`))
        }
        return true
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}

export const userLookup = async (token: string, userGUID: string) => {
    try {
        const url = `users`
        const config = {
            params: {
                idpUserId: userGUID
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const userResponse = await chefsApi.get(url, config)
        if (userResponse?.data?.length === 1) {
            return userResponse.data[0].id
        }
        if (userResponse?.data?.length === 0) {
            console.log(`user guid ${userGUID} not found in CHEFS`)
        } else {
            console.log(`user guid ${userGUID} returned multiple results in CHEFS - should not happen`)
        }
        return null
    } catch (e: any) {
        console.log(e)
        throw new Error()
    }
}
