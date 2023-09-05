/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */
import * as express from "express"

import memoryStreams from "memory-streams"
import * as claimService from "../services/claims.service"
import { getCatchments } from "../lib/catchment"
import { generateDocumentTemplate } from "../services/cdogs.service"
import { updateClaimWithSideEffects } from "../lib/transactions"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const muhammara = require("muhammara")

const claimHash = process.env.CLAIM_HASH || ""

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_username } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_username === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {}
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            !filter.catchmentno ||
            (filter.catchmentno !== -1 && !catchments.includes(filter.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
        const sort: string[] = req.query.sort ? JSON.parse(req.query.sort) : ["id", "ASC"]
        const page = req.query.page ?? 1
        const perPage = req.query.perPage ?? 1
        const claims = await claimService.getAllClaims(Number(perPage), Number(page), filter, sort)
        res.set({
            "Access-Control-Expose-Headers": "Content-Range",
            "Content-Range": `0 - ${claims.pagination.to} / ${claims.pagination.total}`
        })

        // TODO: synchronize DB with CHEFS forms as necessary.
        // TODO: create service provider CHEFS forms as necessary.

        return res.status(200).send(claims.data)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const getOneClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_username } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_username === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (catchments.length === 0 || (claim && !catchments.includes(claim.catchmentno))) {
            return res.status(403).send("Forbidden")
        }
        if (!claim) {
            return res.status(404).send("Not Found")
        }

        // TODO: synchronize DB with CHEFS form as necessary.
        // TODO: create service provider CHEFS form as necessary.

        return res.status(200).send(claim)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_username } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_username === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            (claim && !catchments.includes(claim.catchmentno)) ||
            (req.body.catchmentNo && !catchments.includes(req.body.catchmentNo)) ||
            (claim && req.body.catchmentNo && claim.catchmentno !== req.body.catchmentNo && idir_username === undefined)
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!claim) {
            return res.status(404).send("Not Found")
        }
        await updateClaimWithSideEffects(claim, bceid_user_guid || idir_username, req.body)
        return res.status(200).send({ id })
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const deleteClaim = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_username } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_username === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            idir_username === undefined ||
            catchments.length === 0 ||
            (claim && !catchments.includes(claim.catchmentno))
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!claim) {
            return res.status(404).send("Not Found")
        }
        const numDeleted = await claimService.deleteClaim(id)
        if (numDeleted === 1) {
            // TODO: delete CHEFS form.
        } else {
            throw new Error("Delete failed")
        }
        return res.status(200).send({ id })
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

export const getFile = async (req: any, res: express.Response) => {
    // TODO: rework when we implement attachments.
    try {
        try {
            await getCatchments(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(403).send("Not Authorized")
        }
        const { id, fileid } = req.params
        const claim = await claimService.getClaimByID(id)
        if (claim.length === 0) {
            return res.status(404).send("Not found")
        }
        const file = claim[0].files.files.find((f: any) => f.data.id === fileid)
        const fileres = await claimService.getFile(file.url)
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(fileres)
    } catch (e: unknown) {
        return res.status(500).send("Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    // TODO: rework when we implement PDF generation.
    try {
        let mergedPDF: Buffer | undefined
        try {
            await getCatchments(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        const data = claim[0].data ? claim[0].data : claim[0]
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
        const templateHash = claimHash
        const pdf = await generateDocumentTemplate(templateHash, templateConfig)
        mergedPDF = combinePDFBuffers(mergedPDF, pdf)
        if (data.files && data.files.files.length > 0) {
            await Promise.all(
                data.files.files.map(async (file: { url: string }) => {
                    const fileres = await claimService.getFile(file.url)
                    mergedPDF = combinePDFBuffers(mergedPDF, fileres)
                })
            )
        }
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(mergedPDF)
    } catch (e: unknown) {
        return res.status(500).send("Internal Server Error")
    }
}

// HELPER FUNCTIONS //
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const combinePDFBuffers = (firstBuffer: Buffer | undefined, secondBuffer: Buffer) => {
    if (!firstBuffer) return secondBuffer

    const outStream = new memoryStreams.WritableStream()

    try {
        const firstPDFStream = new muhammara.PDFRStreamForBuffer(firstBuffer)
        const secondPDFStream = new muhammara.PDFRStreamForBuffer(secondBuffer)

        const pdfWriter = muhammara.createWriterToModify(firstPDFStream, new muhammara.PDFStreamForResponse(outStream))
        pdfWriter.appendPDFPagesFromPDF(secondPDFStream)
        pdfWriter.end()
        const newBuffer = outStream.toBuffer()
        outStream.end()

        return newBuffer
    } catch (e) {
        outStream.end()
        if (e instanceof Error) {
            throw new Error(`Error during PDF combination: ${e.message}`)
        }
        return undefined
    }
}
