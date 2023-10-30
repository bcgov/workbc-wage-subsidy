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
        const sortOrders = sort?.length > 0 ? sort[1].split(",") : []
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const applications = await applicationService.getAllApplications(
            Number(perPage),
            Number(page),
            filter,
            sortFields,
            sortOrders,
            bceid_guid
        )
        // create a new list of applications with updated status
        let applicationsNew = applications
        if (filter.status == null && perPage > 1) {
            // only update applications once each call cycle
            // updates the status of applications that have been submitted or in draft
            await Promise.all(applications.data.map(updateApplicationFromForm))
            applicationsNew = await applicationService.getAllApplications(
                Number(perPage),
                Number(page),
                filter,
                sortFields,
                sortOrders,
                bceid_guid
            )
            // If the user just submitted their first application, update their profile from the application data.
            const firstApplication = firstApplicationSubmitted(applications, applicationsNew)
            if (firstApplication) {
                const employer = await employerService.getEmployerByID(bceid_guid)
                if (!employer || employer?.id !== bceid_guid) {
                    return res.status(403).send("Forbidden")
                }
                const formId = applicationService.getFormId(firstApplication.form_type)
                const formPass = applicationService.getFormPass(firstApplication.form_type)
                const submissionResponse = await formService.getSubmission(
                    formId,
                    formPass,
                    firstApplication.form_submission_id
                )
                await employerService.updateEmployerFromApplicationForm(
                    employer,
                    submissionResponse.submission.submission.data
                )
            }
        }

        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applicationsNew.pagination.to} / ${applicationsNew.pagination.total}`
        })
        return res.status(200).send(applicationsNew.data)
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
                return res.status(200).send({ submissionId: createDraftResult.id })
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

// updates the status of applications that have been submitted or in draft
const updateApplicationFromForm = async (application: any) => {
    if (application.status === "Draft") {
        const formID = applicationService.getFormId(application.form_type)
        const formPass = applicationService.getFormPass(application.form_type)
        if (formID && formPass && application.form_submission_id) {
            const submissionResponse = await formService.getSubmission(formID, formPass, application.form_submission_id)
            if (submissionResponse.submission.draft === false) {
                // submitted
                await applicationService.updateApplication(application.id, "New", submissionResponse.submission)
            } else if (submissionResponse.submission.draft === true) {
                // draft
                await applicationService.updateApplication(application.id, "Draft", submissionResponse.submission)
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
        if (
            !employerApplicationRecord ||
            bceid_business_guid === undefined ||
            !targetUsers.every((user: any) => user.bceid_business_guid === bceid_business_guid)
        ) {
            return res.status(403).send("Forbidden or Not Found")
        }
        const application = await applicationService.getApplicationByID(id)
        const shareResult = await formService.shareForm(
            req.kauth.grant.access_token.token,
            application.form_submission_id,
            users
        )
        if (shareResult) {
            await applicationService.shareApplication(id, users)
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

const computeApplicationPrefillFields = (employer: any) => ({
    ...(employer?.workbc_center && {
        areYouCurrentlyWorkingWithAWorkBcCentre: "Yes",
        catchmentNoStoreFront: employer.workbc_center
    }),
    ...(!employer?.workbc_center && { areYouCurrentlyWorkingWithAWorkBcCentre: "No" }),
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
        ...(employer?.workplace_street_address && { addressAlt: employer.workplace_street_address }),
        ...(employer?.workplace_city && { cityAlt: employer.workplace_city }),
        ...(employer?.workplace_province && { provinceAlt: employer.workplace_province }),
        ...(employer?.workplace_postal_code && { postalAlt: employer.workplace_postal_code })
    },
    ...(employer?.contact_name && { signatory1: employer.contact_name })
})

const firstApplicationSubmitted = (applicationsOld: any, applicationsNew: any) => {
    const submittedApplicationsNew = applicationsNew.data.filter((application: any) => application.status !== "Draft")
    if (submittedApplicationsNew.length !== 1) {
        return null
    }
    const submittedApplicationsOld = applicationsOld.data.filter((application: any) => application.status !== "Draft")
    if (submittedApplicationsOld.length !== 0) {
        return null
    }
    return submittedApplicationsNew[0]
}
