/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claims.service"
import * as permissionService from "../services/permission.service"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        let guid
        if (req.kauth.grant.access_token.content.bceid_user_guid) {
            guid = req.kauth.grant.access_token.content.bceid_user_guid
        }
        if (req.kauth.grant.access_token.content.idir_user_guid) {
            guid = req.kauth.grant.access_token.content.idir_user_guid
        }
        if (!guid) {
            return res.status(403).send("Access denied")
        }
        const permission = await permissionService.getPermission(guid)
        // fo through the permission array and extract the catchment field to another array for returning
        const catchment = permission
            .map((item: any) => (item.Catchment !== "N/A" ? item.Catchment.slice(1) : null))
            .filter((item: any) => item !== null)
        console.log(catchment)
        const { sort, filter, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        console.log(sorted)
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted, catchment)
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
        if (!req.kauth.grant.access_token.content.client_roles) {
            return res.status(403).send("Access denied")
        }
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

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        if (!req.kauth.grant.access_token.content.client_roles) {
            return res.status(403).send("Access denied")
        }
        const { id } = req.params
        console.log(req.body, id)
        const updated = await claimService.updateClaim(id, req.body)

        if (updated) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.sendStatus(500).send("Server Error")
    } catch (e: any) {
        console.log(e)
        return res.sendStatus(500).send("Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        if (
            !req.kauth.grant.access_token.content.client_roles ||
            req.kauth.grant.access_token.content.identity_provider !== "idir"
        ) {
            return res.status(403).send("Access denied")
        }
        const { id } = req.params
        console.log(req.body, id)
        const deleted = await claimService.deleteClaim(id)

        if (deleted) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.sendStatus(500).send("Server Error")
    } catch (e: any) {
        console.log(e)
        return res.sendStatus(500).send("Server Error")
    }
}
