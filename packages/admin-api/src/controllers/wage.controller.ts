/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as wageService from "../services/wage.service"

export const getAllWage = async (req: any, res: express.Response) => {
    try {
        if (!req.kauth.grant.access_token.content.client_roles) {
            return res.status(403).send("Access denied")
        }
        const { sort, filter, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        console.log(sorted)
        const claims = await wageService.getAllWage(Number(perPage), Number(page), filters, sorted)
        // console.log(claims)
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const deleteWage = async (req: any, res: express.Response) => {
    try {
        if (
            !req.kauth.grant.access_token.content.client_roles ||
            req.kauth.grant.access_token.content.identity_provider !== "idir"
        ) {
            return res.status(403).send("Access denied")
        }
        const { id } = req.params
        const deleted = await wageService.deleteWage(id)

        if (deleted) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.sendStatus(500).send("Server Error")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
