/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"
import * as applicationService from "../services/application.service"
import * as claimService from "../services/claim.service"

export const insertApplication = async (id: string, userGuid: string, formType: string, submissionID: string) =>
    knex.transaction(async (trx: any) => {
        const applicationResult = await applicationService.insertApplication(id, userGuid, formType, submissionID, trx)
        if (applicationResult.rowCount !== 1) {
            throw new Error("Insert failed")
        }
        const employerApplicationResult = await applicationService.insertEmployerApplicationRecord(userGuid, id, trx)
        if (employerApplicationResult.rowCount !== 1) {
            throw new Error("Insert failed")
        }
        return applicationResult
    })

export const insertClaim = async (id: string, userGuid: string, formType: string, applicationID: string) =>
    knex.transaction(async (trx: any) => {
        const claimResult = await claimService.insertClaim(id, userGuid, formType, applicationID, trx)
        if (claimResult.rowCount !== 1) {
            throw new Error("Insert failed")
        }
        const employerClaimResult = await claimService.insertEmployerClaimRecord(userGuid, id, trx)
        if (employerClaimResult.rowCount !== 1) {
            throw new Error("Insert failed")
        }
        return claimResult
    })
