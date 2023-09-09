/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as formService from "../services/form.service"

export const submission = async (req: any, res: express.Response) => {
    try {
        const { formType } = req.params
        const passedKey = req.headers["x-api-key"]
        if (!formType) {
            return res.status(400).send("Form type parameter required")
        }
        let formPass
        if (formType === "HaveEmployee") {
            formPass = process.env.HAVE_EMPLOYEE_PASS
        } else if (formType === "NeedEmployee") {
            formPass = process.env.NEED_EMPLOYEE_PASS
        } else if (formType === "ClaimForm") {
            formPass = process.env.CLAIM_FORM_PASS
        }

        if (!formPass) {
            return res.status(400).send("Invalid form type parameter provided")
        }
        if (!passedKey || passedKey !== formPass) {
            return res.status(401).send("Invalid api key")
        }

        const submission = await formService.getSubmission(req.body.formId, formPass, req.body.submissionId)

        // Claim form submission events //
        if (formType === "ClaimForm") {
            await formService.createTeamProtectedDraft(
                process.env.SP_CLAIM_FORM_ID as string,
                process.env.SP_CLAIM_FORM_PASS as string,
                process.env.SP_CLAIM_FORM_VERSION_ID as string,
                `${submission.submission.submission.data.internalId}x`, // create a new unique id
                submission.submission.submission.data
            )
        }
        return res.status(200).send()
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
