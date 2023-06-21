/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claim.service"
import * as formService from "../services/submissions.service"

// import type kAuthRequest from "../interfaces/kauth-request.d"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const { sort, filter, page, perPage } = req.query
        // eslint-disable-next-line camelcase
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filters = filter ? JSON.parse(filter) : {}
        // console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        // console.log(sorted)
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted, bceid_username)
        // console.log(claims)
        const hasNonComplete = claims.data.some((a: any) => a.status !== "complete")

        const params = {
            fields: `formHandler, storefrontId, catchmentNo, userInfo, applicationId, internalId, container`,
            // eslint-disable-next-line camelcase
            // createdBy: bceid_username,
            deleted: false
        }

        if (hasNonComplete) {
            const hasClaimApplications = await formService.getFormSubmissions(
                process.env.CLAIM_FORM_ID || "",
                process.env.CLAIM_FORM_PASS || "",
                params
            )
            // console.log(hasClaimApplications.reverse())
            hasClaimApplications.forEach(async (h: any) => {
                const app = claims.data.find((a: any) => a.internalid === h.internalId) || null
                if (app) {
                    // if form is complete
                    if (h.formSubmissionStatusCode === "SUBMITTED" && app.status !== "submitted") {
                        // update ALL fields of content
                        claimService.updateClaimsData(h, app.id)
                        // else form is in draft
                    } else if (app.status === null) {
                        // set status to draft
                        await claimService.updateClaims(app.id, h.confirmationId, h.submissionId, "draft", null)
                    }
                    // console.log("found app")
                    // update the DB
                }
            })
        }
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: unknown) {
        console.error(e)
        return res.status(500).send("Server Error")
    }
}

export const createClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const created = await claimService.insertClaim(
            req.body.formKey,
            req.body.userName,
            req.body.formtype,
            req.body.guid
        )
        // console.log("created is")
        // console.log(created)
        if (created) {
            return res.status(200).send({ data: created })
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claims = await claimService.getClaimByID(id)
        return res.status(200).send(claims)
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const updated = await claimService.updateClaims(id, "", "", "", req.body)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_username } = req.kauth.grant.access_token.content
        if (bceid_username === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        // console.log(claim)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (claim.createdby !== bceid_username || claim.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await claimService.deleteClaim(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
