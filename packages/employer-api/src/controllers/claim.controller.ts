/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claim.service"
import * as formService from "../services/form.service"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filter, sort, bceid_guid)

        if (filter.status == null && perPage > 1) {
            // only update applications once each call cycle
            // update users claims as needed //
            const containsNonComplete = claims.data.some((a: any) => a.status !== "Completed")
            const params = {
                fields: `formHandler, storefrontId, catchmentNo, userInfo, applicationId, internalId, container`,
                // eslint-disable-next-line camelcase
                // createdBy: bceid_guid,
                deleted: false
            }
            if (containsNonComplete) {
                // only query the forms service if we might need to update something
                const submissions = await formService.getFormSubmissions(
                    process.env.CLAIM_FORM_ID || "",
                    process.env.CLAIM_FORM_PASS || "",
                    params
                )
                submissions.forEach(async (submission: any) => {
                    const claim = claims.data.find((c: any) => c.id === submission.internalId)
                    if (claim && claim.status === "Draft") {
                        await claimService.updateClaim(claim.id, "Draft", submission)
                    }
                })
            }
        }
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })
        return res.status(200).send(claims.data)
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const createClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const created = await claimService.insertClaim(
            req.body.formKey,
            req.body.guid,
            req.body.formtype,
            req.body.application_id
        )
        if (created) {
            return res.status(200).send({ data: created })
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claims = await claimService.getClaimByID(id)
        return res.status(200).send(claims)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const updated = await claimService.updateClaim(id, "Draft", req.body)
        if (updated !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        /* Only applications created by the user who sent the request
        or if the status is Awaiting Submission can be deleted */
        if (claim.createdby !== bceid_guid || claim.status !== null) {
            return res.status(401).send("Not Authorized")
        }
        const deleted = await claimService.deleteClaim(id)
        if (deleted) {
            return res.status(200).send({ id })
        }
        return res.status(401).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}
