/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as formService from "../services/submissions.service"
import * as wageService from "../services/wage.service"

export const getAllWage = async (req: any, res: express.Response) => {
    try {
        // eslint-disable-next-line camelcase
        const { bceid_username, bceid_user_guid } = req.kauth.grant.access_token.content
        const { sort, filter, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        console.log(sorted)
        // get applications in the Database
        const applications = await wageService.getAllWage(
            Number(perPage),
            Number(page),
            filters,
            sorted,
            bceid_user_guid
        )
        console.log(applications)
        const hasNeedEmployee = applications.data.some((a: any) => a.formtype === "needEmployee")
        const hasHaveEmployee = applications.data.some((a: any) => a.formtype === "haveEmployee")
        const hasNonComplete = applications.data.some((a: any) => a.status !== "complete")
        console.log(hasNeedEmployee)
        console.log(hasHaveEmployee)
        console.log(hasNonComplete)
        // get applications in chefs created by user
        const params = {
            fields: `userInfo,internalId,applicationId,storefrontId,catchmentNo,formHandler,areYouCurrentlyWorkingWithAWorkBcCentre,catchmentNoStoreFront,operatingName,businessNumber,businessAddress,businessCity,businessProvince,businessPostal,validateAddress,businessPhone,businessFax,employerEmail,businessEmail,otherWorkAddress,container,sectorType,typeOfIndustry,organizationSize,CEWSAndOrCRHP,employeeDisplacement,labourDispute,unionConcurrence,liabilityCoverage,wageSubsidy,WSBCCoverage,orgEligibilityConsent,lawComplianceConsent,next2,addAnotherPosition,positionTitle0,numberOfPositions0,employeeEmail0,employeeEmail1,employeeEmail2,employeeEmail3,employeeEmail4,startDate0,wage0,hours0,applicationMERCs0,duties0,skills0,workExperience0,position2,previous,next4,signatoryTitle,signatory1,organizationConsent,previous1`,
            // eslint-disable-next-line camelcase
            createdBy: bceid_username,
            deleted: false
        }
        console.log(params)
        if (hasNeedEmployee && hasNonComplete) {
            // TODO
            /*
            const hasNeedEmployee = await formService.getFormSubmissions(
                "",
                "",
                params
            )
            */
        }
        if (hasHaveEmployee && hasNonComplete) {
            const haveEmployeeApplications = await formService.getFormSubmissions(
                process.env.HAVE_EMPLOYEE_ID || "",
                process.env.HAVE_EMPLOYEE_PASS || "",
                params
            )
            console.log(haveEmployeeApplications)
            haveEmployeeApplications.forEach(async (h: any) => {
                const app = applications.data.find((a: any) => a.internalid === h.internalId) || null
                if (app) {
                    // if form is complete
                    if (h.formSubmissionStatusCode === "SUBMITTED" && app.status !== "submitted") {
                        // update ALL fields of content
                        wageService.updateWageData(h, app.id)
                        // else form is in draft
                    } else if (app.status === null) {
                        // set status to draft
                        await wageService.updateWage(app.id, h.confirmationId, h.submissionId, "draft")
                    }
                    console.log("found app")
                    // update the DB
                }
            })
        }
        // get status for each application

        // const formsCreated
        // get applications in CHEFS
        // console.log(claims)
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
        return res.status(200).send(applications.data)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const createWage = async (req: any, res: express.Response) => {
    try {
        const created = await wageService.insertWage(
            req.body.formKey,
            req.body.userName,
            req.body.formtype,
            req.body.guid
        )
        console.log("created is")
        console.log(created)
        if (created) {
            return res.status(200).send({ id: created })
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
