/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import { getCatchments } from "../lib/catchment"
import * as applicationService from "../services/application.service"
import { generateDocumentTemplate } from "../services/cdogs.service"
import { updateApplicationWithSideEffects } from "../lib/transactions"

const needEmployeeHash = process.env.NEED_EMPLOYEE_HASH || ""
const haveEmployeeHash = process.env.HAVE_EMPLOYEE_HASH || ""

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
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const applications = await applicationService.getAllApplications(Number(perPage), Number(page), filter, sort)

        // TODO: synchronize DB with CHEFS forms as necessary.

        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${applications.pagination.to} / ${applications.pagination.total}`
        })
        return res.status(200).send(applications.data)
    } catch (e: unknown) {
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

        // TODO: synchronize DB with CHEFS form as necessary.

        return res.status(200).send(application)
    } catch (e: unknown) {
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
            (req.body.catchmentNo && !catchments.includes(req.body.catchmentNo)) ||
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
        return res.status(500).send("Internal Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    // TODO: rework when we implement PDF generation.
    try {
        const { id } = req.params
        const application = await applicationService.getApplicationByIdPDF(id)
        const data = application[0].data ? application[0].data : application[0]
        if (
            data.participantemail0 &&
            data.participantemail0.includes(";") &&
            data.participantemail0.split(";")[0] !== ""
        ) {
            data.position1emails = `${data.participantemail0.split(";")[0]} ${data.participantemail1.split(";")[0]} ${
                data.participantemail2.split(";")[0]
            } ${data.participantemail3.split(";")[0]} ${data.participantemail4.split(";")[0]}`
            data.position2emails = `${data.participantemail0.split(";")[1]} ${data.participantemail1.split(";")[1]} ${
                data.participantemail2.split(";")[1]
            } ${data.participantemail3.split(";")[1]} ${data.participantemail4.split(";")[1]}`
        } else if (
            // This is strictly in the case of legacy applications where participantemail0 is not in the new format
            data.participantemail0 &&
            !data.participantemail0.includes(";") &&
            data.participantemail0.includes("@")
        ) {
            data.position1emails = data.participantemail0
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
        const templateHash =
            application[0].participantemail0 !== null && application[0].participantemail0 !== ";"
                ? haveEmployeeHash
                : needEmployeeHash
        const pdf = await generateDocumentTemplate(templateHash, templateConfig)
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(pdf)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}
