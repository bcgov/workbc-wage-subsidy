/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import { getCatchment } from "../lib/catchment"
import { generateDocumentTemplate } from "../services/cdogs.service"
import * as wageService from "../services/wage.service"

const needEmployeeHash = process.env.NEED_EMPLOYEE_HASH || ""
const haveEmployeeHash = process.env.HAVE_EMPLOYEE_HASH || ""

export const getAllWage = async (req: any, res: express.Response) => {
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
        const claims = await wageService.getAllWage(Number(perPage), Number(page), filters, sorted, catchment)
        // console.log(claims)
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const getWage = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        // console.log(catchment)
        // console.log(req.params.id)
        // console.log(req.params)
        const { id } = req.params
        const wages = await wageService.getWageByID(id, catchment)
        if (wages.length === 0) {
            return res.status(404).send("Not found or Not Authorized")
        }
        return res.status(200).send(wages[0])
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const updateWage = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(401).send("Not Authorized")
        }
        // console.log(catchment)
        const { id } = req.params
        // console.log(req.body, id)
        if (
            req.body.applicationstatus === "Marked for Deletion" &&
            req.kauth.grant.access_token.content.identity_provider !== "idir"
        ) {
            return res.status(403).send("Access denied")
        }
        const updated = await wageService.updateWage(id, req.body, catchment)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const deleteWage = async (req: any, res: express.Response) => {
    try {
        let catchment
        if (req.kauth.grant.access_token.content.identity_provider !== "idir") {
            return res.status(401).send("Access denied")
        }
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            // console.log(e)
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const deleted = await wageService.deleteWage(id, catchment)

        if (deleted) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    try {
        const { id } = req.params
        const wage = await wageService.getWageByIdPDF(id)
        // console.log(wage[0])
        const data = wage[0].data ? wage[0].data : wage[0]
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
        const templateHash = wage[0].participantEmail0 === null ? needEmployeeHash : haveEmployeeHash
        // console.log(templateHash)
        const pdf = await generateDocumentTemplate(templateHash, templateConfig)
        // console.log(pdf)
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(pdf)
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
