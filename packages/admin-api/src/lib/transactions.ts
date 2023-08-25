/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"
import * as applicationService from "../services/application.service"
import * as claimService from "../services/claims.service"

const MAX_RESULTS = 100
const PAGE = 1

const getAssociatedApplication = async (claim: any, trx: any) => {
    const filter = { form_confirmation_id: claim.associated_application_id }
    const sort = ["id", "ASC"]
    return applicationService.getAllApplications(MAX_RESULTS, PAGE, filter, sort, trx)
}

const getAssociatedClaims = async (application: any, trx: any) => {
    const filter = { associated_application_id: application.form_confirmation_id }
    const sort = ["id", "ASC"]
    const getDrafts = false
    return claimService.getAllClaims(MAX_RESULTS, PAGE, filter, sort, getDrafts, trx)
}

const updateAssociatedClaims = async (application: any, data: any, username: string, trx: any) => {
    let numUpdated = 0
    const assocClaims = await getAssociatedClaims(application, trx)
    if (assocClaims.data.length === 0) {
        return numUpdated
    }
    const results = await Promise.all(
        assocClaims.data.map((claim: any) =>
            (claim.catchmentno && data.catchmentNo && claim.catchmentno !== data.catchmentNo) ||
            (claim.status && data.status && data.status === "Cancelled" && claim.status !== "Cancelled")
                ? claimService.updateClaim(claim.id, username, data, trx)
                : null
        )
    )
    results.forEach((result) => {
        if (result === 0) throw new Error("Update failed")
        if (result === 1) numUpdated += 1
    })
    return numUpdated
}

const updateAssociatedApplicationAndClaims = async (claim: any, data: any, username: string, trx: any) => {
    const assocApplications = await getAssociatedApplication(claim, trx)
    if (assocApplications.data.length !== 1) {
        throw new Error("Updated failed")
    }
    const assocApplication = assocApplications.data[0]
    let numUpdated = await applicationService.updateApplication(assocApplication.id, username, data, trx)
    if (numUpdated !== 1) {
        throw new Error("Update failed")
    }
    numUpdated += await updateAssociatedClaims(assocApplication, data, username, trx)
    return numUpdated
}

// Update application. If catchment changed or application cancelled, update associated claims.
export const updateApplicationWithSideEffects = async (application: any, username: string, data: any) =>
    knex.transaction(async (trx: any) => {
        let numUpdated = await applicationService.updateApplication(application.id, username, data, trx)
        if (numUpdated !== 1) {
            throw new Error("Update failed")
        }
        const applicationCancelled = data.status && data.status === "Cancelled"
        const catchmentUpdated =
            (data.catchmentNo && !application.catchmentno) ||
            (data.catchmentNo && application.catchmentno && data.catchmentNo !== application.catchmentno)
        if (!catchmentUpdated && !applicationCancelled) {
            return numUpdated
        }
        const claimsData: { [key: string]: any } = {}
        if (catchmentUpdated) claimsData.catchmentNo = data.catchmentNo
        if (applicationCancelled) claimsData.status = data.status
        numUpdated += await updateAssociatedClaims(application, claimsData, username, trx)
        return numUpdated
    })

// Update claim. If catchment changed, update associated application and claims.
export const updateClaimWithSideEffects = async (claim: any, username: string, data: any) =>
    knex.transaction(async (trx: any) => {
        let numUpdated = await claimService.updateClaim(claim.id, username, data, trx)
        if (numUpdated !== 1) {
            throw new Error("Update failed")
        }
        const catchmentUpdated = data.catchmentNo && claim.catchmentno && data.catchmentNo !== claim.catchmentno
        if (!catchmentUpdated) {
            return numUpdated
        }
        const claimsData = { catchmentNo: data.catchmentNo }
        numUpdated += await updateAssociatedApplicationAndClaims(claim, claimsData, username, trx)
        return numUpdated
    })
