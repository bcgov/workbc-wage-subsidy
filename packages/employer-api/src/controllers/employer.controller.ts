/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import * as express from "express"

import * as employerService from "../services/employer.service"

export const getAllEmployers = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid: bceid_guid, bceid_business_guid: business_guid } = req.kauth.grant.access_token.content
        if (bceid_guid === undefined || business_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const employers = await employerService.getAllEmployers(
            Number(perPage),
            Number(page),
            filter,
            sort,
            // Restrict results to user's own business.
            business_guid
        )
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${employers.pagination.to} / ${employers.pagination.total}`
        })
        return res.status(200).send(employers.data)
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}

export const createEmployer = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        if (!req.body?.id || !req.body?.contact_name || !req.body.contact_email || bceid_guid !== req.body.id) {
            return res.status(403).send("Forbidden")
        }
        const employer = await employerService.getEmployerByID(req.body.id)
        if (!employer) {
            const insertResult = await employerService.insertEmployer(req.body)
            return res.status(200).send({ data: insertResult })
        }
        return res.status(200).send({ data: {} })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}

export const getOneEmployer = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.body
        if (id == null) {
            return res.status(400).send("id is required")
        }
        if (bceid_guid !== id) {
            return res.status(403).send("Forbidden")
        }
        const employer = await employerService.getEmployerByID(id)
        if (!employer) {
            return res.status(404).send("Not Found")
        }
        return res.status(200).send(employer)
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}

export const updateEmployer = async (req: any, res: express.Response) => {
    try {
        const bceid_guid = req.kauth.grant.access_token.content?.bceid_user_guid
        if (bceid_guid === undefined) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.body
        if (id == null) {
            return res.status(400).send("id is required")
        }
        const employer = await employerService.getEmployerByID(id)
        if (id !== bceid_guid) {
            return res.status(403).send("Forbidden")
        }
        if (!employer) {
            return res.status(404).send("Not Found")
        }
        await employerService.updateEmployer(id, req.body)
        return res.status(200).send({ id })
    } catch (e: any) {
        console.log(e?.message)
        return res.status(500).send("Server Error")
    }
}
