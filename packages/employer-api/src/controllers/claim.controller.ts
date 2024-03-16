/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import { insertClaim, insertLegacyClaim } from "../lib/transactions"
import * as claimService from "../services/claim.service"
import * as employerService from "../services/employer.service"
import * as formService from "../services/form.service"
import { getApplicationByConfirmationID, getFormId, getFormPass } from "../services/application.service"
import { getCHEFSToken } from "../services/common.service"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : []
        const sortFields = sort?.length > 0 ? sort[0].split(",") : []
        const sortOrder = sort?.length > 1 ? sort[1] : ""
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const claims = await claimService.getAllClaims(
            Number(perPage),
            Number(page),
            filter,
            sortFields,
            sortOrder,
            bceid_guid
        )

        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}

export const getClaimCounts = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const claimCounts = await claimService.getClaimCounts(bceid_guid)
        return res.status(200).send(claimCounts)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const createClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        const { application_id: appConfirmationId } = req.body
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        if (!req.body?.guid || req.body.guid !== bceid_guid) {
            return res.status(403).send("Forbidden")
        }

        // Obtain associated application.
        const associatedApplication = appConfirmationId ? await getApplicationByConfirmationID(appConfirmationId) : null
        if (!associatedApplication) {
            return res.status(403).send("Forbidden")
        }
        const formID = getFormId(associatedApplication.form_type)
        const formPass = getFormPass(associatedApplication.form_type)
        let associatedApplicationForm
        if (formID && formPass && associatedApplication.form_submission_id) {
            associatedApplicationForm = await formService.getSubmission(
                formID,
                formPass,
                associatedApplication.form_submission_id
            )
        }
        if (!associatedApplicationForm || !associatedApplicationForm.submission.submission?.data) {
            return res.status(500).send("Internal Server Error")
        }

        // Prepare pre-fill data.
        const appFormData = associatedApplicationForm.submission.submission.data
        const prefillFields = computeClaimPrefillFields(appFormData)

        // Create a new form draft //
        const createDraftResult = await formService.createLoginProtectedDraft(
            req.kauth.grant.access_token,
            process.env.CLAIM_FORM_ID as string,
            process.env.CLAIM_FORM_VERSION_ID as string,
            req.body.formKey,
            prefillFields
        )
        if (createDraftResult?.id) {
            const insertResult = await insertClaim(
                req.body.formKey,
                req.body.guid,
                req.body.application_id,
                createDraftResult.id,
                req.kauth.grant.access_token.content.idp,
                req.kauth.grant.access_token.content.idp_username
            )
            if (insertResult?.rowCount === 1) {
                // successful insertion
                return res.status(200).send({ recordId: req.body.formKey })
            }
        } else {
            return res.status(500).send("Internal Server Error")
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const createLegacyClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        if (!req.body?.guid || req.body.guid !== bceid_guid) {
            return res.status(403).send("Forbidden")
        }

        const employer = await employerService.getEmployerByID(bceid_guid)
        if (!employer) {
            return res.status(403).send("Forbidden")
        }

        const prefillFields = {
            isLegacy: true,
            container: {
                businessAddress1: req.body.address,
                employerCity: req.body.city,
                employerName: employer.bceid_business_name,
                employerContact: employer.contact_name,
                employerPhone: employer.phone_number
            }
        }

        // Create a new form draft //
        const createDraftResult = await formService.createLoginProtectedDraft(
            req.kauth.grant.access_token,
            process.env.CLAIM_FORM_ID as string,
            process.env.CLAIM_FORM_VERSION_ID as string,
            req.body.formKey,
            prefillFields
        )
        if (createDraftResult?.id) {
            const insertResult = await insertLegacyClaim(
                req.body.formKey,
                req.body.guid,
                createDraftResult.id,
                req.body.catchment,
                req.body.storefront,
                req.kauth.grant.access_token.content.idp,
                req.kauth.grant.access_token.content.idp_username
            )
            if (insertResult?.rowCount === 1) {
                // successful insertion
                return res.status(200).send({ recordId: req.body.formKey })
            }
        } else {
            return res.status(500).send("Internal Server Error")
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const employerClaimRecord = await claimService.getEmployerClaimRecord(bceid_guid, id)
        if (!employerClaimRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        const claims = await claimService.getClaimByID(id)
        return res.status(200).send(claims)
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

// Update stale claims with latest data from CHEFS forms.
export const syncClaims = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const employer = await employerService.getEmployerByID(bceid_guid)
        if (!employer) {
            return res.status(403).send("Forbidden or Not Found")
        }
        // Update any drafts that have changed.
        const drafts = await claimService.getStaleDrafts(bceid_guid)
        await Promise.all(drafts.map(updateClaimFromForm))
        return res.status(200).send({})
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const employerClaimRecord = await claimService.getEmployerClaimRecord(bceid_guid, id)
        if (!employerClaimRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        await claimService.updateClaim(id, null, req.body)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

// Helper function to update the status of an claim, if it is in draft
// and the form is still in draft, then update the claim status to draft
const updateClaimFromForm = async (employerClaimRecord: any) => {
    if (employerClaimRecord.status === "Draft") {
        console.log(`[claim.controller] updating claim with id ${employerClaimRecord.id}`)
        const formID = process.env.CLAIM_FORM_ID
        const formPass = process.env.CLAIM_FORM_PASS
        if (formID && formPass && employerClaimRecord.form_submission_id) {
            const submissionResponse = await formService.getSubmission(
                formID,
                formPass,
                employerClaimRecord.form_submission_id
            )
            if (submissionResponse.submission.draft === true) {
                await claimService.updateClaim(employerClaimRecord.id, "Draft", submissionResponse.submission, true)
            } else if (submissionResponse.submission.draft === false) {
                // Create SP claim form if it does not already exist.
                if (
                    !employerClaimRecord?.service_provider_form_submission_id ||
                    !employerClaimRecord?.service_provider_form_internal_id
                ) {
                    const submission = submissionResponse?.submission?.submission
                    const serviceProviderInternalID = `SPx${submission.data.internalId}` // create a new internal id for the SP form
                    const token = await getCHEFSToken()
                    const createDraftResult = await formService.createLoginProtectedDraft(
                        { token },
                        process.env.SP_CLAIM_FORM_ID as string,
                        process.env.SP_CLAIM_FORM_VERSION_ID as string,
                        serviceProviderInternalID,
                        submission.data,
                        employerClaimRecord.catchmentno
                    )

                    // If SP claim form created, then update DB record.
                    if (createDraftResult?.id && createDraftResult.submission) {
                        console.log(
                            `[claim.controller] new SP claim form draft created with id ${createDraftResult.id} and catchment ${employerClaimRecord.catchmentno}`
                        )
                        await claimService
                            .addServiceProviderClaim(
                                submissionResponse,
                                serviceProviderInternalID,
                                createDraftResult.id
                            )
                            .then(() => {
                                console.log(
                                    `[claim.controller] successfully updated claim ${employerClaimRecord.id} with SP claim form data`
                                )
                            })
                        // TODO: send notification.
                    } else {
                        console.log(
                            `[claim.controller] unable to create new service provider claim form for submission id ${employerClaimRecord.form_submission_id} - this shouldn't happen!`
                        )
                    }
                }
            }
        } else {
            console.log(
                `[claim.controller] claim ${employerClaimRecord.id} failed to update - one of formID, formPass, form_submission_id is missing - this shouldn't happen!`
            )
        }
    }
}

// Mark a claim as stale.
export const markClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const employerClaimRecord = await claimService.getEmployerClaimRecord(bceid_guid, id)
        if (!employerClaimRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        await claimService.markClaim(id)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const shareClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, bceid_business_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const { users } = req.body
        const targetUsers = await employerService.getEmployersByIDs(users)
        const employerClaimRecord = await claimService.getEmployerClaimRecord(bceid_user_guid, id)
        if (
            !employerClaimRecord ||
            bceid_business_guid === undefined ||
            !targetUsers.every((user: any) => user.bceid_business_guid === bceid_business_guid)
        ) {
            return res.status(403).send("Forbidden or Not Found")
        }
        const claim = await claimService.getClaimByID(id)
        const shareResult = await formService.shareForm(
            req.kauth.grant.access_token.token,
            claim.form_submission_id,
            users
        )
        if (shareResult) {
            await claimService.shareClaim(id, users)
        }
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (claim.createdby !== bceid_guid || claim.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await claimService.deleteClaim(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

// Prepare pre-fill data.
// Use data from associated application.
// Use workplace address if it exists, otherwise use business address.
const computeClaimPrefillFields = (appFormData: any) => ({
    container: {
        ...(appFormData?.operatingName && { employerName: appFormData.operatingName }),
        ...(appFormData?.signatory1 && { employerContact: appFormData.signatory1 }),
        ...(appFormData?.businessPhone && { employerPhone: appFormData.businessPhone }),
        ...(appFormData.container?.addressAlt && {
            ...(appFormData.container?.addressAlt && { businessAddress1: appFormData.container.addressAlt }),
            ...(appFormData.container?.cityAlt && { employerCity: appFormData.container.cityAlt }),
            ...(appFormData.container?.postalAlt && { employerPostal: appFormData.container.postalAlt })
        }),
        ...(!appFormData.container?.addressAlt && {
            ...(appFormData?.businessAddress && { businessAddress1: appFormData.businessAddress }),
            ...(appFormData?.businessCity && { employerCity: appFormData.businessCity }),
            ...(appFormData?.businessPostal && { employerPostal: appFormData.businessPostal })
        })
    }
})
