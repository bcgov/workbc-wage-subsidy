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
        } else if (formType === "ServiceProviderClaimForm") formPass = process.env.SP_CLAIM_FORM_PASS

        if (!formPass) {
            return res.status(400).send("Invalid form type parameter provided")
        }
        if (!passedKey || passedKey !== formPass) {
            return res.status(401).send("Invalid api key")
        }

        const submissionResponse = await formService.getSubmission(req.body.formId, formPass, req.body.submissionId)
        const submission = submissionResponse?.submission?.submission
        if (!submission) {
            console.log("formService getSubmission failed")
            return res.status(500).send("Internal Server Error")
        }
        console.log("RETRIEVED SUBMISSION: ", submissionResponse)

        // Claim Form submission events //
        if (formType === "ClaimForm") {
            if (submission?.data?.container?.submit !== true) {
                console.log("claim form draft submission event - ignoring") // TODO: claim form update on draft
                return res.status(200).send()
            }
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
                    console.log("claim record update successful")
                    return res.status(200).send()
                }

                console.log("Unable to update claim database entry")
                return res.status(500).send("Internal Server Error")
            }

            console.log("Unable to create new service provider claim form")
            return res.status(500).send("Internal Server Error")
        }

        // Service Provider Claim Form draft submission events - triggered on calculator approval //
        if (formType === "ServiceProviderClaimForm") {
            if (submission?.data?.container?.submit === true) {
                console.log("service provider claim form submission events should not occur")
                return res.status(400).send("service provider claim form submission events should not occur")
            }
            // Update the claim form entry //
            const updateResult = await claimService.updateServiceProviderClaim(submissionResponse)
            if (updateResult === 1) {
                console.log("claim record update successful")
                return res.status(200).send()
            }

            console.log("Unable to update claim database entry")
            return res.status(500).send("Internal Server Error")
        }
        return res.status(200).send()
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
