import { chefsApi } from "../config/config"

// eslint-disable-next-line import/prefer-default-export
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
        throw new Error(e.response?.status)
    }
}
