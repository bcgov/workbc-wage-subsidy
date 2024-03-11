import { chefsApi } from "../config/config"
import { getCHEFSToken } from "./common.service"

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
        console.log(e)
        throw new Error(e.response?.status)
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
