/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import { insertApplication } from "../lib/transactions"
import * as applicationService from "../services/application.service"
import * as employerService from "../services/employer.service"
import * as formService from "../services/form.service"

export const getAllApplications = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : []
        const sortFields = sort?.length > 0 ? sort[0].split(",") : []
        const sortOrder = sort?.length > 1 ? sort[1] : ""
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1

        const applications = await applicationService.getAllApplications(
            Number(perPage),
            Number(page),
            filter,
            sortFields,
            sortOrder,
            bceid_guid
        )

        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
        return res.status(200).send(applications.data)
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}

export const getApplicationCounts = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const applicationCounts = await applicationService.getApplicationCounts(bceid_guid)
        return res.status(200).send(applicationCounts)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const createApplication = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        if (!req.body?.guid || req.body.guid !== bceid_guid) {
            return res.status(403).send("Forbidden")
        }

        // Prepare pre-fill data.
        const employer = await employerService.getEmployerByID(bceid_guid)
        if (!employer || employer?.id !== bceid_guid) {
            return res.status(403).send("Forbidden")
        }
        const prefillFields = computeApplicationPrefillFields(employer)

        // Create a new form draft //
        const formID = applicationService.getFormId(req.body.formType)
        const formVersionID = applicationService.getFormVersionId(req.body.formType)
        const createDraftResult = await formService.createLoginProtectedDraft(
            req.kauth.grant.access_token,
            formID,
            formVersionID,
            req.body.formKey,
            prefillFields
        )
        if (createDraftResult?.id) {
            const insertResult = await insertApplication(
                req.body.formKey,
                req.body.guid,
                req.body.formType,
                createDraftResult.id
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
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneApplication = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const employerApplicationRecord = await applicationService.getEmployerApplicationRecord(bceid_guid, id)
        if (!employerApplicationRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        const application = await applicationService.getApplicationByID(id)
        return res.status(200).send(application)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

// Update stale applications with latest data from CHEFS forms.
export const syncApplications = async (req: any, res: express.Response) => {
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
        const drafts = await applicationService.getStaleDrafts(bceid_guid)
        await Promise.all(drafts.map(updateApplicationFromForm))
        return res.status(200).send({})
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

// updates the status of applications that have been submitted or in draft
const updateApplicationFromForm = async (application: any) => {
    if (application.status === "Draft") {
        const formID = applicationService.getFormId(application.form_type)
        const formPass = applicationService.getFormPass(application.form_type)
        if (formID && formPass && application.form_submission_id) {
            const submissionResponse = await formService.getSubmission(formID, formPass, application.form_submission_id)
            if (submissionResponse.submission.draft === false) {
                console.log("form submitted event")
                // submitted
                await applicationService.updateApplication(application.id, "New", submissionResponse.submission, true)
            } else if (submissionResponse.submission.draft === true) {
                // draft
                await applicationService.updateApplication(application.id, "Draft", submissionResponse.submission, true)
            }
        }
    }
}

export const shareApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, bceid_business_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const { users } = req.body
        const targetUsers = await employerService.getEmployersByIDs(users)
        const employerApplicationRecord = await applicationService.getEmployerApplicationRecord(bceid_user_guid, id)
        const applicationRecord = await applicationService.getApplicationByID(employerApplicationRecord?.application_id)
        if (
            !employerApplicationRecord ||
            !applicationRecord ||
            bceid_business_guid === undefined ||
            !targetUsers.every((user: any) => user.bceid_business_guid === bceid_business_guid)
        ) {
            return res.status(403).send("Forbidden or Not Found")
        }
        const application = await applicationService.getApplicationByID(id)
        const shareResult = await formService.shareForm(
            applicationRecord.status === "Draft" ? req.kauth.grant.access_token.token : null, // use users token for draft states
            application.form_submission_id,
            users
        )
        if (shareResult) {
            await applicationService.shareApplication(id, users)
        } else {
            console.log(`error sharing form for application ${id}`)
            return res.status(500).send("Internal Server Error")
        }
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteApplication = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const wage = await applicationService.getApplicationByID(id)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (wage.createdby !== bceid_guid || wage.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await applicationService.deleteApplication(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

export const updateApplication = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const employerApplicationRecord = await applicationService.getEmployerApplicationRecord(bceid_guid, id)
        if (!employerApplicationRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        await applicationService.updateApplication(id, null, req.body)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

// Mark an application as stale.
export const markApplication = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const employerApplicationRecord = await applicationService.getEmployerApplicationRecord(bceid_guid, id)
        if (!employerApplicationRecord) {
            return res.status(403).send("Forbidden or Not Found")
        }
        await applicationService.markApplication(id)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

const computeApplicationPrefillFields = (employer: any) => ({
    ...(employer?.bceid_business_name && { operatingName: employer.bceid_business_name }),
    ...(employer?.cra_business_number && { businessNumber: employer.cra_business_number }),
    ...(employer?.street_address && { businessAddress: employer.street_address }),
    ...(employer?.city && { businessCity: employer.city }),
    ...(employer?.province && { businessProvince: employer.province }),
    ...(employer?.postal_code && { businessPostal: employer.postal_code }),
    ...(employer?.phone_number && { businessPhone: employer.phone_number }),
    ...(employer?.fax_number && { businessFax: employer.fax_number }),
    ...(employer?.contact_email && { employerEmail: employer.contact_email }),
    ...((employer?.workplace_street_address || employer?.workplace_city || employer?.workplace_postal_code) && {
        otherWorkAddress: true
    }),
    ...(!employer?.workplace_street_address &&
        !employer?.workplace_city &&
        !employer?.workplace_postal_code && {
            otherWorkAddress: false
        }),
    container: {
        ...((employer?.workplace_street_address || employer?.workplace_city || employer?.workplace_postal_code) && {
            addressValidationAlt: "Validation required to continue."
        }),
        ...(employer?.workplace_street_address && { addressAlt: employer.workplace_street_address }),
        ...(employer?.workplace_city && { cityAlt: employer.workplace_city }),
        provinceAlt: "BC",
        ...(employer?.workplace_postal_code && { postalAlt: employer.workplace_postal_code })
    },
    ...(employer?.contact_name && { signatory1: employer.contact_name })
})
