/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any, user: string) => {
    const claims = await knex("claims")
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
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
            if (user) {
                queryBuilder.whereLike("created_by", user) // TODO .orWhereLike("shared_with", `%${user}%`)
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

export const getClaimsByCatchment = async (ca: number[]) => {
    const claims = await knex("claims").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const insertClaim = async (id: string, user: string, formType: string, applicationID: string) => {
    const application = await knex("applications").where("form_confirmation_id", applicationID)
    if (application && application.length > 0) {
        const data = {
            id,
            form_type: formType,
            position_title: application[0].position_title,
            associated_application_id: applicationID,
            created_date: new Date(),
            created_by: user,
            shared_with: [],
            status: "Draft",
            catchmentno: application[0].catchmentno
        }
        const result = await knex("claims").insert(data)
        return result
    }
    return false
}

export const getClaimByID = async (id: number) => {
    const claims = await knex("claims").where((builder: any) => builder.where("id", id))
    return claims[0]
}

export const updateClaim = async (id: number, status: string | null, form: any) => {
    const claims = await knex("claims").where("id", id)
    if (claims.length === 0) {
        return 0
    }
    let result
    if (form && form.userInfo) {
        result = await knex("claims")
            .where("id", id)
            .update({
                form_confirmation_id: form.formSubmissionStatusCode === "SUBMITTED" ? form.confirmationId : null, // only store the confirmation ID when the form has been submitted
                form_submission_id: form.submissionId,
                form_submitted_date: form.formSubmissionStatusCode === "SUBMITTED" ? form.createdAt : null,
                employee_first_name: form.container.employeeFirstName,
                employee_last_name: form.container.employeeLastName,
                status,
                updated_by: form.userInfo.username, // TODO: should match 'user' on insertion (uses a hash version of the users bceid instead of the actual username)
                updated_date: new Date()
            })
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
