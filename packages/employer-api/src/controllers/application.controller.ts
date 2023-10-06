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

        if (filter.status == null && perPage > 1) {
            // only update applications once each call cycle
            // update users applications as needed //
            const containsNeedEmployee = applications.data.some((a: any) => a.form_type === "Need Employee")
            const containsHaveEmployee = applications.data.some((a: any) => a.form_type === "Have Employee")
            const containsNonComplete = applications.data.some((a: any) => a.status !== "Complete")
            const params = {
                fields: "userInfo,internalId,catchmentNo,positionTitle0,numberOfPositions0,operatingName",
                // eslint-disable-next-line camelcase
                // createdBy: `${bceid_guid}@bceid`, //TODO: use guid from applications object
                deleted: false
            }

            if (containsNonComplete) {
                // only query the forms service if we might need to update something
                const updateApplications = async (formID: string | undefined, formPass: string | undefined) => {
                    const submissions = await formService.getFormSubmissions(formID ?? "", formPass ?? "", params)
                    submissions.forEach(async (submission: any) => {
                        const app = applications.data.find(
                            (application: any) => application.id === submission.internalId
                        )
                        if (app) {
                            if (submission.formSubmissionStatusCode === "SUBMITTED") {
                                if (
                                    app.status !== "New" &&
                                    app.status !== "In Progress" &&
                                    app.status !== "Completed" &&
                                    app.status !== "Cancelled"
                                ) {
                                    applicationService.updateApplication(app.id, "New", submission)
                                }
                            } else if (app.status === "Draft") {
                                await applicationService.updateApplication(app.id, "Draft", submission)
                            }
                        }
                    })
                }
                if (containsNeedEmployee)
                    updateApplications(process.env.NEED_EMPLOYEE_ID, process.env.NEED_EMPLOYEE_PASS)
                if (containsHaveEmployee)
                    updateApplications(process.env.HAVE_EMPLOYEE_ID, process.env.HAVE_EMPLOYEE_PASS)
            }
        }
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
        await applicationService.updateApplication(id, null, req.body)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Internal Server Error")
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
