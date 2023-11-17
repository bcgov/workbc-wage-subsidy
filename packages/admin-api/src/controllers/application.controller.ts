/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import { getCatchments } from "../lib/catchment"
import * as applicationService from "../services/application.service"
import * as formService from "../services/form.service"
import { generatePdf } from "../services/cdogs.service"
import { updateApplicationWithSideEffects } from "../lib/transactions"
import { formatDateMmmDDYYYY } from "../utils/string-functions"
import WorkBcCentres from "../data/workbc-centres"

const workBcCentreCodes = Object.keys(WorkBcCentres)

export const getAllApplications = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            !filter.catchmentno ||
            (filter.catchmentno !== -1 && !catchments.includes(filter.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
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
            sortOrder
        )

        // TODO: synchronize DB with CHEFS forms as necessary.

        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
        return res.status(200).send(applications.data)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getApplicationCounts = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            !filter.catchmentno ||
            (filter.catchmentno !== -1 && !catchments.includes(filter.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
        const applicationCounts = await applicationService.getApplicationCounts(filter.catchmentno)
        return res.status(200).send(applicationCounts)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const application = await applicationService.getApplicationByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (catchments.length === 0 || (application && !catchments.includes(application.catchmentno))) {
            return res.status(403).send("Forbidden")
        }
        if (!application) {
            return res.status(404).send("Not Found")
        }
        return res.status(200).send(application)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const updateApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const application = await applicationService.getApplicationByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            (application && !catchments.includes(application.catchmentno)) ||
            (req.body.workBcCentre && !req.body.catchmentNo) ||
            (req.body.catchmentNo &&
                (!catchments.includes(req.body.catchmentNo) ||
                    !req.body.workBcCentre ||
                    Number(req.body.workBcCentre.split("-")[0]) !== req.body.catchmentNo ||
                    !workBcCentreCodes.includes(req.body.workBcCentre))) ||
            (application &&
                req.body.catchmentNo &&
                application.catchmentno !== req.body.catchmentNo &&
                idir_user_guid === undefined)
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!application) {
            return res.status(404).send("Not Found")
        }
        await updateApplicationWithSideEffects(application, bceid_user_guid || idir_user_guid, req.body)
        return res.status(200).send({ id })
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteApplication = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const application = await applicationService.getApplicationByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            idir_user_guid === undefined ||
            catchments.length === 0 ||
            (application && !catchments.includes(application.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!application) {
            return res.status(404).send("Not Found")
        }
        const numDeleted = await applicationService.deleteApplication(id)
        if (numDeleted === 1) {
            // TODO: delete CHEFS form.
            // TODO: delete associated claims.
        } else {
            throw new Error("Delete failed")
        }
        return res.status(200).send({ id })
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id, formType } = req.params
        const application = await applicationService.getApplicationByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            (formType !== "HaveEmployee" && formType !== "NeedEmployee") ||
            catchments.length === 0 ||
            (application && !catchments.includes(application.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!application) {
            return res.status(404).send("Not Found")
        }
        const formId = formType === "HaveEmployee" ? process.env.HAVE_EMPLOYEE_ID : process.env.NEED_EMPLOYEE_ID
        const formPass = formType === "HaveEmployee" ? process.env.HAVE_EMPLOYEE_PASS : process.env.NEED_EMPLOYEE_PASS
        const templateHash =
            formType === "HaveEmployee" ? process.env.HAVE_EMPLOYEE_HASH : process.env.NEED_EMPLOYEE_HASH
        const submissionId = application?.form_submission_id
        const submittedDate = application?.form_submitted_date
        if (!formId || !formPass || !templateHash || !submissionId || !submittedDate) {
            return res.status(500).send("Internal Server Error")
        }
        const submissionResponse = await formService.getSubmission(formId, formPass, submissionId)
        const submission = submissionResponse?.submission?.submission
        if (!submission) {
            return res.status(500).send("Internal Server Error")
        }
        const data = {
            operatingName: submission.data?.operatingName,
            businessNumber: submission.data?.businessNumber,
            businessAddress: submission.data?.businessAddress,
            businessCity: submission.data?.businessCity,
            businessProvince: submission.data?.businessProvince,
            businessPostal: submission.data?.businessPostal,
            businessPhone: submission.data?.businessPhone,
            businessFax: submission.data?.businessFax,
            businessEmail: submission.data?.businessEmail,
            CEWSAndOrCRHP: submission.data?.CEWSAndOrCRHP,
            sectorType: submission.data?.sectorType,
            organizationSize: submission.data?.organizationSize,
            typeOfIndustry: submission.data?.typeOfIndustry,
            employeeDisplacement: submission.data?.employeeDisplacement,
            labourDispute: submission.data?.labourDispute,
            unionConcurrence: submission.data?.unionConcurrence,
            liabilityCoverage: submission.data?.liabilityCoverage,
            wageSubsidy: submission.data?.wageSubsidy,
            WSBCCoverage: submission.data?.WSBCCoverage,
            addressAlt: submission.data.container?.addressAlt,
            cityAlt: submission.data.container?.cityAlt,
            provinceAlt: submission.data.container?.provinceAlt,
            postalAlt: submission.data.container?.postalAlt,
            positionTitle0: submission.data?.positionTitle0,
            numberOfPositions0: submission.data?.numberOfPositions0,
            startDate0: formatDateMmmDDYYYY(submission.data?.startDate0),
            hours0: submission.data?.hours0,
            wage0: submission.data?.wage0,
            duties0: submission.data?.duties0,
            skills0: submission.data?.skills0,
            workExperience0: submission.data?.workExperience0,
            employeeEmail0: submission.data?.employeeEmail0,
            employeeEmail1: submission.data?.employeeEmail1,
            employeeEmail2: submission.data?.employeeEmail2,
            employeeEmail3: submission.data?.employeeEmail3,
            employeeEmail4: submission.data?.employeeEmail4,
            positionTitle1: submission.data.position2?.positionTitle1,
            numberOfPositions1: submission.data.position2?.numberOfPositions1,
            startDate1: formatDateMmmDDYYYY(submission.data.position2?.startDate1),
            hours1: submission.data.position2?.hours1,
            wage1: submission.data.position2?.wage1,
            duties1: submission.data.position2?.duties1,
            skills1: submission.data.position2?.skills1,
            workExperience1: submission.data.position2?.workExperience1,
            employeeEmail5: submission.data.position2?.employeeEmail0,
            employeeEmail6: submission.data.position2?.employeeEmail1,
            employeeEmail7: submission.data.position2?.employeeEmail2,
            employeeEmail8: submission.data.position2?.employeeEmail3,
            employeeEmail9: submission.data.position2?.employeeEmail4,
            signatory1: submission.data?.signatory1,
            signatoryTitle: submission.data?.signatoryTitle,
            submittedDate: formatDateMmmDDYYYY(submittedDate),
            workBcCentre: submission.data?.workBcCentre
        }
        const templateConfig = {
            // eslint-disable-next-line object-shorthand
            data: data,
            // eslint-disable-next-line max-len
            formatters:
                '{"myFormatter":"_function_myFormatter|function(data) { return data.slice(1); }","myOtherFormatter":"_function_myOtherFormatter|function(data) {return data.slice(2);}"}',
            options: {
                cacheReport: false,
                convertTo: "pdf",
                overwrite: true,
                reportName: `pdf.pdf`
            }
        }
        const pdf = await generatePdf(templateHash, templateConfig)
        return res.status(200).send({ result: pdf })
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
