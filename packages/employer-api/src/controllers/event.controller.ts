/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as formService from "../services/form.service"
import * as claimService from "../services/claim.service"

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

        const submissionResponse = await formService.getSubmission(req.body.formId, formPass, req.body.submissionId)
        const { submission } = submissionResponse.submission
        if (submission.data.container.submit === false)
            // draft submission
            return res.status(200).send()

        // Claim form submission events //
        if (formType === "ClaimForm") {
            const serviceProviderInternalID = `SPx${submission.data.internalId}` // create a new internal id for the SP form
            const createDraftResult = await formService.createTeamProtectedDraft(
                process.env.SP_CLAIM_FORM_ID as string,
                process.env.SP_CLAIM_FORM_PASS as string,
                process.env.SP_CLAIM_FORM_VERSION_ID as string,
                serviceProviderInternalID,
                submission.data
            )
            if (createDraftResult?.id && createDraftResult.submission) {
                const addResult = await claimService.addServiceProviderClaim(
                    submissionResponse,
                    serviceProviderInternalID,
                    createDraftResult.id
                )
                if (addResult === 1) {
                    return res.status(200).send()
                }

                return res.status(500).send("Unable to update claim database entry")
            }

            return res.status(500).send("Unable to create new service provider claim form")
        }
        return res.status(200).send()
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
