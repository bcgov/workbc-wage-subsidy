/* eslint-disable import/prefer-default-export */
import * as express from "express"

import memoryStreams from "memory-streams"
// import muhammara from "muhammara"
import * as claimService from "../services/claims.service"
import { getCatchment } from "../lib/catchment"
import { generateDocumentTemplate } from "../services/cdogs.service"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const muhammara = require("muhammara")

const needEmployeeHash = process.env.NEED_EMPLOYEE_HASH || ""
const haveEmployeeHash = process.env.HAVE_EMPLOYEE_HASH || ""

export const getAllClaims = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            return res.status(403).send("Not Authorized")
        }
        const { filter, sort, page, perPage } = req.query
        const filters = filter ? JSON.parse(filter) : {}
        if (req.kauth.grant.access_token.content.bceid_user_guid && filters.catchmentno) {
            // console.log("bceid", typeof filters.catchmentno, filters.catchmentno)
            if (
                catchment.length === 0 ||
                !catchment.map((e: string) => Number(e)).includes(Number(filters.catchmentno))
            ) {
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
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const getClaim = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
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
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const updateClaim = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
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
    } catch (e: unknown) {
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
        } catch (e: unknown) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        // console.log(req.body, id)
        const deleted = await claimService.deleteClaim(id, catchment)

        if (deleted !== 0) {
            // eslint-disable-next-line object-shorthand
            return res.status(200).send({ id: id })
        }
        return res.status(404).send("Not Found or Not Authorized")
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const getFile = async (req: any, res: express.Response) => {
    try {
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        const { id, fileid } = req.params
        const claim = await claimService.getClaimByID(id, catchment)
        // console.log(claim)
        if (claim.length === 0) {
            return res.status(404).send("Not found")
        }
        const file = claim[0].files.files.find((f: any) => f.data.id === fileid)
        // console.log(file)
        const fileres = await claimService.getFile(file.url)
        res.setHeader("Content-Disposition", `attachment; filename=pdf.pdf`)
        return res.status(200).send(fileres)
    } catch (e: unknown) {
        // console.log(e)
        return res.status(500).send("Server Error")
    }
}

export const generatePDF = async (req: any, res: express.Response) => {
    try {
        let mergedPDF: Buffer | undefined
        let catchment
        try {
            catchment = await getCatchment(req.kauth.grant.access_token)
        } catch (e: unknown) {
            // console.log(e)
            return res.status(403).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id, catchment)
        // console.log(claim[0])
        const data = claim[0].data ? claim[0].data : claim[0]
        // console.log(data)
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
        const templateHash = claim[0].participantEmail0 === null ? needEmployeeHash : haveEmployeeHash
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
        // console.log(e)
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
