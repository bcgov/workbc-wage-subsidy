/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllClaims = async (
    perPage: number,
    currPage: number,
    filters: any,
    sortFields: string[],
    sortOrders: string[],
    user: string
) => {
    const claimIds = knex("employers_claims").select("claim_id").where("employer_id", user)
    const claimsAndSharedUsers = await knex("claims as c")
        .join("employers_claims as ec", "c.id", "=", "ec.claim_id")
        .join("employers as e", "ec.employer_id", "=", "e.id")
        .whereIn("c.id", claimIds)
        .select("c.*")
        .groupBy("c.id")
        .select(knex.raw("COALESCE( ARRAY_AGG(e.contact_name) FILTER (WHERE e.id!=?), '{}') as shared_with", user))
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", filters.id)
            }
            if (filters.status) {
                queryBuilder.whereIn("status", filters.status)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (sortFields?.length > 0 && sortOrders?.length > 0) {
                sortFields.forEach((field, i) => {
                    queryBuilder.orderByRaw(`${field} ${sortOrders[i]} NULLS LAST`)
                })
            } else {
                // default sort
                queryBuilder.orderBy("id", "ASC")
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claimsAndSharedUsers
}

export const getClaimCounts = async (userGuid: string) => {
    const claimCounts = knex
        .select("status")
        .count("*")
        .from(knex.select("claim_id").from("employers_claims").where("employer_id", userGuid).as("ec"))
        .join("claims as c", "ec.claim_id", "=", "c.id")
        .groupBy("status")
    return claimCounts
}

export const getClaimByID = async (id: string) => {
    const claim = await knex("claims").where("id", id)
    return claim.length > 0 ? claim[0] : null
}

export const insertClaim = async (
    id: string,
    userGuid: string,
    applicationID: string,
    submissionID: string,
    trx?: any
) => {
    const application = await knex("applications").where("form_confirmation_id", applicationID)
    if (application && application.length > 0) {
        const data = {
            id,
            form_submission_id: submissionID,
            position_title: application[0].position_title,
            associated_application_id: applicationID,
            created_date: new Date(),
            created_by: userGuid,
            status: "Draft",
            catchmentno: application[0].catchmentno
        }
        const result = await knex("claims").modify((queryBuilder: any) => {
            queryBuilder.insert(data)
            if (trx) {
                queryBuilder.transacting(trx)
            }
        })
        return result
    }
    return false
}

export const updateClaim = async (id: number, status: string | null, body: any) => {
    const claims = await knex("claims").where("id", id)
    if (claims.length === 0) {
        return 0
    }
    let result
    if (body) {
        const submitted = body.draft === false
        result = await knex("claims")
            .where("id", id)
            .update({
                form_confirmation_id: submitted ? body.confirmationId : null, // only store the confirmation ID when the form has been submitted
                form_submitted_date: submitted ? body.createdAt : null,
                employee_first_name: body.submission?.data?.container?.employeeFirstName,
                employee_last_name: body.submission?.data?.container?.employeeLastName,
                status,
                updated_by: "system",
                updated_date: new Date()
            })
    }
    return result
}

export const shareClaim = async (id: string, userGuids: string[]) => {
    const data = userGuids.map((guid) => ({ employer_id: guid, claim_id: id }))
    const result = await knex("employers_claims").insert(data).onConflict(["employer_id", "claim_id"]).ignore()
    return result
}

export const getServiceProviderClaimByInternalId = async (internalId: string) => {
    const claims = await knex("claims").where("service_provider_form_internal_id", internalId)
    return claims.length > 0 ? claims[0] : null
}

export const addServiceProviderClaim = async (
    submissionResponse: any,
    serviceProviderInternalID: string,
    serviceProviderSubmissionID: string
) => {
    let result
    try {
        const submission = submissionResponse?.submission?.submission
        console.log("add SP Claim Submission: ", submission)
        if (!submission?.data?.internalId) {
            return null
        }
        console.log("EMPLOYER CLAIM INTERNAL ID: ", submission.data.internalId)
        const claims = await knex("claims").where("id", submission.data.internalId)
        if (claims.length === 0) {
            console.log("claim record not found")
            return null
        }
        try {
            result = await knex("claims")
                .where("id", submission.data.internalId)
                .update({
                    form_confirmation_id:
                        submission.state === "submitted" ? submissionResponse.submission.confirmationId : null, // only store the confirmation ID when the form has been submitted
                    form_submission_id: submissionResponse.submission.id,
                    form_submitted_date:
                        submission.state === "submitted" ? submissionResponse.submission.createdAt : null,
                    employee_first_name: submission.data.container.employeeFirstName,
                    employee_last_name: submission.data.container.employeeLastName,
                    status: "New",
                    service_provider_form_submission_id: serviceProviderSubmissionID,
                    service_provider_form_internal_id: serviceProviderInternalID,
                    updated_by: submissionResponse.submission.updatedBy ?? submissionResponse.submission.createdBy,
                    updated_date: new Date()
                })
        } catch (e: any) {
            console.log(e.message)
            throw new Error("Database update failed")
        }
    } catch (e: any) {
        console.log(e)
        throw new Error(e.message)
    }
    return result
}

export const updateServiceProviderClaim = async (submissionResponse: any) => {
    let result = 0
    try {
        console.log("update SP Claim submissionResponse: ", submissionResponse)
        const claimID = submissionResponse?.submission?.id
        console.log("SP CLAIM ID: ", claimID)
        if (!claimID) {
            console.log("claim id not provided")
            return 0
        }
        const claims = await knex("claims").where("service_provider_form_submission_id", claimID)
        if (claims.length === 0) {
            console.log("claim record not found")
            return 0
        }
        try {
            result = await knex("claims")
                .where("service_provider_form_submission_id", claimID)
                .update({
                    status: "Completed",
                    calculator_approved: true,
                    updated_by: submissionResponse.submission.updatedBy ?? submissionResponse.submission.createdBy,
                    updated_date: new Date()
                })
        } catch (e: any) {
            console.log(e.message)
            throw new Error("Database update failed")
        }
    } catch (e: any) {
        console.log(e)
        throw new Error(e.message)
    }
    return result
}

export const deleteClaim = async (id: number) => {
    const claims = await knex("claims").where("id", id)
    if (claims.length !== 0 && (claims[0].status === null || claims[0].status === "draft")) {
        const result = await knex("claims").where("id", id).del()
        return result
    }
    return null
}

export const getEmployerClaimRecord = async (employerId: string, claimId: string) => {
    const result = await knex("employers_claims").where("employer_id", employerId).where("claim_id", claimId)
    return result.length > 0 ? result[0] : null
}

export const insertEmployerClaimRecord = async (employerId: string, claimId: string, trx?: any) => {
    const result = await knex("employers_claims").modify((queryBuilder: any) => {
        queryBuilder.insert({ employer_id: employerId, claim_id: claimId })
        if (trx) {
            queryBuilder.transacting(trx)
        }
    })
    return result
}
