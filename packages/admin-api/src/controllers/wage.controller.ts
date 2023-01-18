/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as wageService from "../services/wage.service"
import { getCatchment } from "../lib/catchment"

export const getAllWage = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            return res.status(403).send("Not Authorized")
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
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const updateWage = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            return res.status(403).send("Not Authorized")
        }
        console.log(catchment)
        const { id } = req.params
        // console.log(req.body, id)
        const updated = await wageService.updateWage(id, req.body, catchment)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: any) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const deleteWage = async (req: any, res: express.Response) => {
    try {
        if (req.kauth.grant.access_token.content.identity_provider !== "idir") {
            return res.status(403).send("Access denied")
        }
        try {
            await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const deleted = await wageService.deleteWage(id)

        if (deleted) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(500).send("Server Error")
    } catch (e: any) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}
