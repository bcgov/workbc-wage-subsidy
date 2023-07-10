/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import { getCatchment } from "../lib/catchment"
import * as applicationService from "../services/application.service"
import { generateDocumentTemplate } from "../services/cdogs.service"

const needEmployeeHash = process.env.NEED_EMPLOYEE_HASH || ""
const haveEmployeeHash = process.env.HAVE_EMPLOYEE_HASH || ""

export const getAllApplications = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(401).send("Not Authorized")
        }
        const { sort, filter, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        const claims = await applicationService.getAllApplications(
            Number(perPage),
            Number(page),
            filters,
            sorted,
            catchment
        )
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const getOneApplication = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const wages = await applicationService.getApplicationByID(id, catchment)
        if (wages.length === 0) {
            return res.status(404).send("Not found or Not Authorized")
        }
        return res.status(200).send(wages[0])
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const updateApplication = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        if (
            req.body.applicationstatus === "Marked for Deletion" &&
            req.kauth.grant.access_token.content.identity_provider !== "idir"
        ) {
            return res.status(403).send("Access denied")
        }
        const user =
            req.kauth.grant.access_token.content.identity_provider === "idir"
                ? `idir:${req.kauth.grant.access_token.content.idir_username}`
                : `bceid:${req.kauth.grant.access_token.content.bceid_username}`
        const updated = await applicationService.updateApplication(id, req.body, catchment, user)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const deleteApplication = async (req: any, res: express.Response) => {
    try {
        let catchment
        if (req.kauth.grant.access_token.content.identity_provider !== "idir") {
            return res.status(401).send("Access denied")
        }
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const deleted = await applicationService.deleteApplication(id, catchment)

        if (deleted) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    try {
        const { id } = req.params
        const wage = await applicationService.getApplicationByIdPDF(id)
        const data = wage[0].data ? wage[0].data : wage[0]
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
            wage[0].participantemail0 && wage[0].participantemail0 !== (";" || null)
                ? haveEmployeeHash
                : needEmployeeHash
        const pdf = await generateDocumentTemplate(templateHash, templateConfig)
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(pdf)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}
