/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"
import * as wageService from "../services/application.service"

export const getAllApplications = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = JSON.parse(req.query.sort) ?? ["application_id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1

        // get applications in the database //
        const applications = await wageService.getAllApplications(
            Number(perPage),
            Number(page),
            filter,
            sort,
            bceid_username
        )

        // const hasNeedEmployee = applications.data.some((a: any) => a.formtype === "needEmployee")
        // const hasHaveEmployee = applications.data.some((a: any) => a.formtype === "haveEmployee")
        // const hasNonComplete = applications.data.some((a: any) => a.status !== "complete")
        // // get applications in chefs created by user
        // const params = {
        //     fields: `userInfo,internalId,applicationId,storefrontId,catchmentNo,formHandler,areYouCurrentlyWorkingWithAWorkBcCentre,catchmentNoStoreFront,operatingName,businessNumber,businessAddress,businessCity,businessProvince,businessPostal,validateAddress,businessPhone,businessFax,employerEmail,businessEmail,otherWorkAddress,container,sectorType,typeOfIndustry,organizationSize,CEWSAndOrCRHP,employeeDisplacement,labourDispute,unionConcurrence,liabilityCoverage,wageSubsidy,WSBCCoverage,orgEligibilityConsent,lawComplianceConsent,next2,addAnotherPosition,positionTitle0,numberOfPositions0,employeeEmail0,employeeEmail1,employeeEmail2,employeeEmail3,employeeEmail4,startDate0,wage0,hours0,applicationMERCs0,duties0,skills0,workExperience0,position2,previous,next4,signatoryTitle,signatory1,organizationConsent,previous1`,
        //     // eslint-disable-next-line camelcase
        //     // createdBy: bceid_username,
        //     deleted: false
        // }
        // if (hasNeedEmployee && hasNonComplete) {
        //     const hasNeedEmployeeApplications = await formService.getFormSubmissions(
        //         process.env.NEED_EMPLOYEE_ID || "",
        //         process.env.NEED_EMPLOYEE_PASS || "",
        //         params
        //     )
        //     hasNeedEmployeeApplications.forEach(async (h: any) => {
        //         const app = applications.data.find((a: any) => a.internalid === h.internalId) || null
        //         if (app) {
        //             // if form is complete
        //             if (h.formSubmissionStatusCode === "SUBMITTED" && app.status !== "submitted") {
        //                 // update ALL fields of content
        //                 wageService.updateWageData(h, app.id)
        //                 // else form is in draft
        //             } else if (app.status === null) {
        //                 // set status to draft
        //                 await wageService.updateWage(app.id, h.confirmationId, h.submissionId, "draft", null)
        //             }
        //         }
        //     })
        // }
        // if (hasHaveEmployee && hasNonComplete) {
        //     const haveEmployeeApplications = await formService.getFormSubmissions(
        //         process.env.HAVE_EMPLOYEE_ID || "",
        //         process.env.HAVE_EMPLOYEE_PASS || "",
        //         params
        //     )
        //     haveEmployeeApplications.forEach(async (h: any) => {
        //         const app = applications.data.find((a: any) => a.internalid === h.internalId) || null
        //         if (app) {
        //             // if form is complete
        //             if (h.formSubmissionStatusCode === "SUBMITTED" && app.status !== "submitted") {
        //                 // update ALL fields of content
        //                 wageService.updateWageData(h, app.id)
        //                 // else form is in draft
        //             } else if (app.status === null) {
        //                 // set status to draft
        //                 await wageService.updateWage(app.id, h.confirmationId, h.submissionId, "draft", null)
        //             }
        //         }
        //     })
        // }
        // get applications in CHEFS
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
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const created = await wageService.insertWage(
            req.body.formKey,
            req.body.userName,
            req.body.formtype,
            req.body.guid
        )
        if (created) {
            return res.status(200).send({ data: created })
        }
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
        const applications = await wageService.getApplicationByID(id)
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
        const updated = await wageService.updateApplication(id, "", "", "", req.body)
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
        const wage = await wageService.getApplicationByID(id)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (wage.createdby !== bceid_username || wage.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await wageService.deleteApplication(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
