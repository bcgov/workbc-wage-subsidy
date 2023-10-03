/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */
import * as express from "express"

import memoryStreams from "memory-streams"
import * as claimService from "../services/claims.service"
import * as formService from "../services/form.service"
import { getCatchments } from "../lib/catchment"
import { generatePdf } from "../services/cdogs.service"
import { updateClaimWithSideEffects } from "../lib/transactions"
import { formatCurrency, formatDateMmmDDYYYY, formatDateTime, formatPercentage } from "../utils/string-functions"

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const muhammara = require("muhammara")

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

export const getClaimCounts = async (req: any, res: express.Response) => {
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
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
        const claimCounts = await claimService.getClaimCounts(filter.catchmentno)
        return res.status(200).send(claimCounts)
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
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
            return res.status(401).send("Not Authorized")
        }
        const { id } = req.params
        const claim = await claimService.getClaimByID(id)
        const catchments = await getCatchments(req.kauth.grant.access_token)
        if (
            catchments.length === 0 ||
            (claim && !catchments.includes(claim.catchmentno)) ||
            (req.body.catchmentNo && !catchments.includes(req.body.catchmentNo)) ||
            (claim &&
                req.body.catchmentNo &&
                claim.catchmentno !== req.body.catchmentNo &&
                idir_user_guid === undefined)
        ) {
            return res.status(403).send("Forbidden")
        }
        if (!claim) {
            return res.status(404).send("Not Found")
        }
        await updateClaimWithSideEffects(claim, bceid_user_guid || idir_user_guid, req.body)
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
    try {
        const { bceid_user_guid, idir_user_guid } = req.kauth.grant.access_token.content
        if (bceid_user_guid === undefined && idir_user_guid === undefined) {
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
        const formId = process.env.SP_CLAIM_FORM_ID
        const formPass = process.env.SP_CLAIM_FORM_PASS
        const templateHash = process.env.CLAIM_HASH
        const submissionId = claim?.service_provider_form_submission_id
        const submittedDate = claim?.form_submitted_date
        if (!formId || !formPass || !templateHash || !submissionId || !submittedDate) {
            return res.status(500).send("Internal Server Error")
        }
        const submissionResponse = await formService.getSubmission(formId, formPass, submissionId)
        const submission = submissionResponse?.submission?.submission
        if (!submission) {
            return res.status(500).send("Internal Server Error")
        }
        const data = {
            periodStart1: formatDateMmmDDYYYY(submission.data.container?.periodStart1),
            periodStart2: formatDateMmmDDYYYY(submission.data.container?.periodStart2),
            isFinalClaim: submission.data.container?.isFinalClaim,
            employerName: submission.data.container?.employerName,
            employerContact: submission.data.container?.employerContact,
            employerPhone: submission.data.container?.employerPhone,
            businessAddress1: submission.data.container?.businessAddress1,
            employerCity: submission.data.container?.employerCity,
            employerPostal: submission.data.container?.employerPostal,
            employeeFirstName: submission.data.container?.employeeFirstName,
            employeeLastName: submission.data.container?.employeeLastName,
            dateTo1: formatDateMmmDDYYYY(submission.data.container?.dateTo1),
            dateTo2: formatDateMmmDDYYYY(submission.data.container?.dateTo2),
            dateTo3: formatDateMmmDDYYYY(submission.data.container?.dateTo3),
            dateTo4: formatDateMmmDDYYYY(submission.data.container?.dateTo4),
            dateTo5: formatDateMmmDDYYYY(submission.data.container?.dateTo5),
            dateFrom1: formatDateMmmDDYYYY(submission.data.container?.dateFrom1),
            dateFrom2: formatDateMmmDDYYYY(submission.data.container?.dateFrom2),
            dateFrom3: formatDateMmmDDYYYY(submission.data.container.dateFrom3),
            dateFrom4: formatDateMmmDDYYYY(submission.data.container.dateFrom4),
            dateFrom5: formatDateMmmDDYYYY(submission.data.container.dateFrom5),
            hoursWorked1: submission.data.container?.hoursWorked1,
            hoursWorked2: submission.data.container?.hoursWorked2,
            hoursWorked3: submission.data.container?.hoursWorked3,
            hoursWorked4: submission.data.container?.hoursWorked4,
            hoursWorked5: submission.data.container?.hoursWorked5,
            eligibleHoursWorked1: submission.data.container?.eligibleHoursWorked1,
            eligibleHoursWorked2: submission.data.container?.eligibleHoursWorked2,
            eligibleHoursWorked3: submission.data.container?.eligibleHoursWorked3,
            eligibleHoursWorked4: submission.data.container?.eligibleHoursWorked4,
            eligibleHoursWorked5: submission.data.container?.eligibleHoursWorked5,
            hourlyWage1: formatCurrency(submission.data.container.hourlyWage1),
            hourlyWage2: formatCurrency(submission.data.container.hourlyWage2),
            hourlyWage3: formatCurrency(submission.data.container.hourlyWage3),
            hourlyWage4: formatCurrency(submission.data.container.hourlyWage4),
            hourlyWage5: formatCurrency(submission.data.container.hourlyWage5),
            eligibleHourlyWage1: formatCurrency(submission.data.container.eligibleHourlyWage1),
            eligibleHourlyWage2: formatCurrency(submission.data.container.eligibleHourlyWage2),
            eligibleHourlyWage3: formatCurrency(submission.data.container.eligibleHourlyWage3),
            eligibleHourlyWage4: formatCurrency(submission.data.container.eligibleHourlyWage4),
            eligibleHourlyWage5: formatCurrency(submission.data.container.eligibleHourlyWage5),
            totalWages1: formatCurrency(submission.data.container.totalWages1),
            totalWages2: formatCurrency(submission.data.container.totalWages2),
            totalWages3: formatCurrency(submission.data.container.totalWages3),
            totalWages4: formatCurrency(submission.data.container.totalWages4),
            totalWages5: formatCurrency(submission.data.container.totalWages5),
            eligibleWages1: formatCurrency(submission.data.container.eligibleWages1),
            eligibleWages2: formatCurrency(submission.data.container.eligibleWages2),
            eligibleWages3: formatCurrency(submission.data.container.eligibleWages3),
            eligibleWages4: formatCurrency(submission.data.container.eligibleWages4),
            eligibleWages5: formatCurrency(submission.data.container.eligibleWages5),
            totalMercs1: formatCurrency(submission.data.container.totalMercs1),
            totalMercs2: formatCurrency(submission.data.container.totalMercs2),
            totalMercs3: formatCurrency(submission.data.container.totalMercs3),
            totalMercs4: formatCurrency(submission.data.container.totalMercs4),
            totalMercs5: formatCurrency(submission.data.container.totalMercs5),
            eligibleMercs1: formatCurrency(submission.data.container.eligibleMercs1),
            eligibleMercs2: formatCurrency(submission.data.container.eligibleMercs2),
            eligibleMercs3: formatCurrency(submission.data.container.eligibleMercs3),
            eligibleMercs4: formatCurrency(submission.data.container.eligibleMercs4),
            eligibleMercs5: formatCurrency(submission.data.container.eligibleMercs5),
            totalWages: formatCurrency(submission.data.container.totalWages),
            totalEligibleWages: formatCurrency(submission.data.container.totalEligibleWages),
            totalMercs: formatCurrency(submission.data.container.totalMercs),
            totalEligibleMercs: formatCurrency(submission.data.container.totalEligibleMercs),
            clientIssues1: submission.data.container?.clientIssues1,
            workbcCentre: submission.data.container?.workbcCentre,
            signatory1: submission.data.container?.signatory1,
            subsidyRateDateFrom1: formatDateMmmDDYYYY(submission.data.subsidyRateDateFrom1),
            subsidyRateDateTo1: formatDateMmmDDYYYY(submission.data.subsidyRateDateTo1),
            totalWeeks1: submission.data?.totalWeeks1,
            subsidyRatePercentage1: formatPercentage(submission.data.subsidyRatePercentage1),
            totalEligibleWagesPaid1: formatCurrency(submission.data.totalEligibleWagesPaid1),
            wagesEligibleForSubsidy1: formatCurrency(submission.data.wagesEligibleForSubsidy1),
            wagesToBeReimbursed1: formatCurrency(submission.data.wagesToBeReimbursed1),
            totalEligibleMercsPaid1: formatCurrency(submission.data.totalEligibleMercsPaid1),
            mercsToBeReimbursed1: formatCurrency(submission.data.mercsToBeReimbursed1),
            totalAmountToBeReimbursed1: formatCurrency(submission.data.totalAmountToBeReimbursed1),
            subsidyRateDateFrom2: formatDateMmmDDYYYY(submission.data.subsidyRateDateFrom2),
            subsidyRateDateTo2: formatDateMmmDDYYYY(submission.data.subsidyRateDateTo2),
            totalWeeks2: submission.data?.totalWeeks2,
            subsidyRatePercentage2: formatPercentage(submission.data.subsidyRatePercentage2),
            totalEligibleWagesPaid2: formatCurrency(submission.data.totalEligibleWagesPaid2),
            wagesEligibleForSubsidy2: formatCurrency(submission.data.wagesEligibleForSubsidy2),
            wagesToBeReimbursed2: formatCurrency(submission.data.wagesToBeReimbursed2),
            totalEligibleMercsPaid2: formatCurrency(submission.data.totalEligibleMercsPaid2),
            mercsToBeReimbursed2: formatCurrency(submission.data.mercsToBeReimbursed2),
            totalAmountToBeReimbursed2: formatCurrency(submission.data.totalAmountToBeReimbursed2),
            totalSubsidyClaimed: formatCurrency(submission.data.totalSubsidyClaimed),
            approvedBy: submission.data?.approvedBy,
            approvedDate: formatDateTime(submission.data.approvedDate),
            submittedDate: formatDateMmmDDYYYY(submittedDate)
        }
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
        const pdf = await generatePdf(templateHash, templateConfig)
        return res.status(200).send({ result: pdf })
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
