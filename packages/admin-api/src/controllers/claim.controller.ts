/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claims.service"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const { sort, filter, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        console.log(sorted)
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted)
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

export const getClaim = async (req: any, res: express.Response) => {
    try {
        // console.log(req.params.id)
        // console.log(req.params)
        const { id } = req.params
        const claims = await claimService.getClaimByID(id)
        // const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted)
        // console.log(claims[0].id)
        // console.log({ data: { claims[0], id: claims[0].id } })
        return res.status(200).send(claims[0])
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
