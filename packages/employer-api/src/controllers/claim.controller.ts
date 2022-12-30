/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as claimService from "../services/claims.service"
import * as formService from "../services/submissions.service"

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const { sort, filter, page, perPage } = req.query
        // eslint-disable-next-line camelcase
        const { bceid_user_guid, bceid_username } = req.kauth.grant.access_token.content
        const filters = filter ? JSON.parse(filter) : {}
        // console.log(filters.applicationstatus)
        const sorted = sort ? sort.replace(/[^a-zA-Z0-9,]/g, "").split(",") : ["id", "ASC"]
        // console.log(sorted)
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filters, sorted, bceid_user_guid)
        // console.log(claims)
        const hasNonComplete = claims.data.some((a: any) => a.status !== "complete")

        const params = {
            fields: `formHandler, storefrontId, catchmentNo, userInfo, applicationId, internalId, container`,
            // eslint-disable-next-line camelcase
            createdBy: bceid_username,
            deleted: false
        }

        if (hasNonComplete) {
            const hasClaimApplications = await formService.getFormSubmissions(
                process.env.CLAIM_FORM_ID || "",
                process.env.CLAIM_FORM_PASS || "",
                params
            )
            // console.log(hasNeedEmployeeApplications)
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
                        await claimService.updateClaims(app.id, h.confirmationId, h.submissionId, "draft")
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
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const createClaim = async (req: any, res: express.Response) => {
    try {
        const created = await claimService.insertClaim(
            req.body.formKey,
            req.body.userName,
            req.body.formtype,
            req.body.guid
        )
        console.log("created is")
        console.log(created)
        if (created) {
            return res.status(200).send({ id: created })
        }
        return res.status(500).send("Internal Server Error")
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneClaim = async (req: any, res: express.Response) => {
    try {
        const { id } = req.params
        const claims = await claimService.getClaimByID(id)
        return res.status(200).send(claims)
    } catch (e: any) {
        console.log(e)
        return res.status(500).send("Internal Server Error")
    }
}
