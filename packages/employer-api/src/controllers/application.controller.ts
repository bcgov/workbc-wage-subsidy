/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as applicationService from "../services/application.service"
import * as formService from "../services/form.service"

export const getAllApplications = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const applications = await applicationService.getAllApplications(
            Number(perPage),
            Number(page),
            filter,
            sort,
            bceid_username
        )

        if (filter.status == null && perPage > 1) {
            // only update applications once each call cycle
            // update users applications as needed //
            const containsNeedEmployee = applications.data.some((a: any) => a.form_type === "Need Employee")
            const containsHaveEmployee = applications.data.some((a: any) => a.form_type === "Have Employee")
            const containsNonComplete = applications.data.some((a: any) => a.status !== "Complete")
            const params = {
                fields: "userInfo,internalId,catchmentNo,positionTitle0,numberOfPositions0",
                // eslint-disable-next-line camelcase
                // createdBy: `${bceid_username}@bceid`, //TODO: use guid from applications object
                deleted: false
            }

            if (containsNonComplete) {
                // only query the forms service if we might need to update something
                const updateApplications = async (formID: string | undefined, formPass: string | undefined) => {
                    const forms = await formService.getFormSubmissions(formID ?? "", formPass ?? "", params)
                    forms.forEach(async (form: any) => {
                        const app = applications.data.find((application: any) => application.id === form.internalId)
                        if (app) {
                            if (form.formSubmissionStatusCode === "SUBMITTED") {
                                // if form is complete
                                if (app.status !== "Submitted") {
                                    applicationService.updateApplication(app.id, "Submitted", form)
                                }
                            } else if (app.status === "Draft") {
                                // else form is in draft
                                await applicationService.updateApplication(app.id, "Draft", form)
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
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const createApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content // **TODO: Can't use standard realm token to create a form for the user, this needs to wait till CHEFS & Wage Sub are on the same realm
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        await applicationService.insertApplication(
            req.body.formKey,
            req.body.userName,
            req.body.formType,
            req.body.guid
        )
        // TODO: create a new draft version of the form with pre-filled fields //
        // if (insertResult?.rowCount === 1) { // successful insertion
        //     // create a new form draft //
        //     let formID: string = ""
        //     let formPass: string = ""
        //     let formVersionID: string = ""
        //     if (req.body.formType === "Have Employee"){
        //         formID = process.env.HAVE_EMPLOYEE_ID as string
        //         formPass = process.env.HAVE_EMPLOYEE_PASS as string
        //         formVersionID = process.env.HAVE_EMPLOYEE_VERSION_ID as string
        //     }
        //     else if (req.body.formType === "Need Employee"){
        //         formID = process.env.NEED_EMPLOYEE_ID as string
        //         formPass = process.env.NEED_EMPLOYEE_PASS as string
        //         formVersionID = process.env.NEED_EMPLOYEE_VERSION_ID as string
        //     }
        //     const createDraftResult = await formService.createDraft(req.kauth.grant.access_token.token, formID, formPass, formVersionID, {}) //**TODO: should probably try to create the draft before  */
        //     return res.status(200).send({ data: insertResult })
        // }
        return res.status(500).send("Internal Server Error")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const applications = await applicationService.getApplicationByID(id)
        return res.status(200).send(applications)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const updateApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const updated = await applicationService.updateApplication(id, null, req.body)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const wage = await applicationService.getApplicationByID(id)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (wage.createdby !== bceid_username || wage.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await applicationService.deleteApplication(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
