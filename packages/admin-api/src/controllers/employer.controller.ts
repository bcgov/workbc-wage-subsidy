/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as formService from "../services/form.service"
import * as claimService from "../services/claims.service"

export const getOneEmployer = async (req: any, res: express.Response) => {
    try {
        const { auth } = req
        const bceid_guid = auth.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)

        const formId = process.env.SP_CLAIM_FORM_ID
        const formPass = process.env.SP_CLAIM_FORM_PASS
        const submissionId = claim?.service_provider_form_submission_id

        if (!formId || !formPass || !submissionId) {
            console.log("Missing required fields for claim PDF.")
            return res.status(500).send("Internal Server Error")
        }
        const submissionResponse = await formService.getSubmission(formId, formPass, submissionId)
        const submission = submissionResponse?.submission?.submission

        const employerInfo = {
            employerCity: submission?.data.container.employerCity,
            employerName: submission?.data.container.employerName,
            periodStart: submission?.data.container.periodStart1,
            periodEnd: submission?.data.container.periodStart2
        }
        return res.status(200).send({ employerInfo })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}
