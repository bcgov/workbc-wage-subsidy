/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claims.service"
// import * as permissionService from "../services/permission.service"
import { getCatchment } from "../lib/catchment"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            return res.status(403).send("Not Authorized")
        }
        const { filter, sort, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        // console.log(filters)
        if (req.kauth.grant.access_token.content.bceid_user_guid && filters.catchmentno) {
            // console.log("bceid", typeof filters.catchmentno, filters.catchmentno)
            if (!catchment.map((e: string) => Number(e)).includes(Number(filters.catchmentno))) {
                return res.status(403).send("Not Authorized")
            }
        }
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        // console.log(sorted)
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted, catchment)
        // console.log(claims)
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: any) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const getClaim = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        // console.log(catchment)
        // console.log(req.params.id)
        // console.log(req.params)
        const { id } = req.params
        const claims = await claimService.getClaimByID(id, catchment)
        if (claims.length === 0) {
            return res.status(404).send("Not found or Not Authorized")
        }
        return res.status(200).send(claims[0])
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        // console.log(catchment)
        const { id } = req.params
        // console.log(req.body, id)
        const updated = await claimService.updateClaim(id, req.body, catchment)

        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: any) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        let catchment
        if (req.kauth.grant.access_token.content.identity_provider !== "idir") {
            return res.status(403).send("Access denied")
        }
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: any) {
            console.log(e)
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        console.log(req.body, id)
        const deleted = await claimService.deleteClaim(id, catchment)

        if (deleted !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}
