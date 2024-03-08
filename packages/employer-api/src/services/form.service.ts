import { chefsApi } from "../config/config"
import { getCHEFSToken } from "./common.service"

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
                    submit: false,
                    ...prefillFields
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

export const shareForm = async (userToken: any, submissionID: string, userGUIDs: string[]) => {
    try {
        const url = `rbac/submissions`
        const data = {
            permissions: ["submission_update", "submission_read"]
        }
        const chefsToken = await getCHEFSToken()
        for (const userGUID of userGUIDs) {
            console.log(`sharing form submission ${submissionID} with guid ${userGUID}`)
            let chefsUserID = await userLookup(chefsToken, userGUID)
            if (!chefsUserID) {
                console.log(`user guid ${userGUID} not found in CHEFS - creating user`)
                chefsUserID = await createUser(chefsToken, userGUID)
                if (chefsUserID) {
                    console.log(`successfully created CHEFS user with id ${chefsUserID}`)
                } else {
                    console.log(`unable to create CHEFS user for guid ${userGUID} - skipping`)
                    continue
                }
            }
            const config = {
                params: {
                    formSubmissionId: submissionID,
                    userId: chefsUserID
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken ?? chefsToken}`
                }
            }
            await chefsApi
                .put(url, data, config)
                .then(() => console.log(`successfully shared form submission ${submissionID} with guid ${userGUID}`))
                .catch(() => console.log(`unable to share form submission ${submissionID} with guid ${userGUID}`))
        }
        return true
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}

export const userLookup = async (token: string, userGUID: string) => {
    try {
        const url = "users"
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

export const createUser = async (token: string, userGUID: string) => {
    try {
        const url = "users"
        const data = {
            guid: userGUID
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const userCreateResponse = await chefsApi.post(url, data, config)
        const createdUserID = userCreateResponse.data
        return createdUserID
    } catch (e: any) {
        console.log(e)
        throw new Error()
    }
}

export const updateSubmissionCatchment = async (submissionID: string, submission: any, catchment: number) => {
    try {
        const url = `submissions/${submissionID}`
        const chefsToken = await getCHEFSToken()
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${chefsToken}`
            }
        }
        const data = {
            submission: { ...submission.submission, catchment }
        }
        await chefsApi
            .put(url, data, config)
            .then(() => console.log(`successfully updated form submission ${submissionID} with catchment ${catchment}`))
            .catch(() => console.log(`unable to update form submission ${submissionID} with catchment ${catchment}`))

        return true
    } catch (e: any) {
        console.log(e)
        throw new Error(e.response?.status)
    }
}
