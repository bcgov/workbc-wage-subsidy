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
            await Promise.all(applications.data.map(updateApplicationHelper))
            applicationsNew = await applicationService.getAllApplications(
                Number(perPage),
                Number(page),
                filter,
                sortFields,
                sortOrders,
                bceid_guid
            )
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
        // Create a new form draft //
        let formID = ""
        let formVersionID = ""
        if (req.body.formType === "Have Employee") {
            formID = process.env.HAVE_EMPLOYEE_ID as string
            formVersionID = process.env.HAVE_EMPLOYEE_VERSION_ID as string
        } else if (req.body.formType === "Need Employee") {
            formID = process.env.NEED_EMPLOYEE_ID as string
            formVersionID = process.env.NEED_EMPLOYEE_VERSION_ID as string
        }
        const createDraftResult = await formService.createLoginProtectedDraft(
            req.kauth.grant.access_token,
            formID,
            formVersionID,
            req.body.formKey,
            {}
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
        await updateApplicationHelper(employerApplicationRecord)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
    }
}

const updateApplicationHelper = async (application: any) => {
    if (application.status === "Draft") {
        let formID
        let formPass
        if (application.form_type === "Have Employee") {
            formID = process.env.HAVE_EMPLOYEE_ID
            formPass = process.env.HAVE_EMPLOYEE_PASS
        } else if (application.form_type === "Need Employee") {
            formID = process.env.NEED_EMPLOYEE_ID
            formPass = process.env.NEED_EMPLOYEE_PASS
        }
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
