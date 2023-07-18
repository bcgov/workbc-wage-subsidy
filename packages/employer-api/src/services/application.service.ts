/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (
    perPage: number,
    currPage: number,
    filters: any,
    sort: string[],
    user: string
) => {
    const applications = await knex("applications")
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", filters.id)
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (filters.form_confirmation_id) {
                queryBuilder.where("form_confirmation_id", filters.form_confirmation_id)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (user) {
                queryBuilder.whereLike("created_by", user) // TODO .orWhereLike("shared_with", `%${user}%`)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applications
}

export const getApplicationByCatchment = async (ca: number[]) => {
    const claims = await knex("applications").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const getApplicationByID = async (id: string) => {
    const wages = await knex("applications").where((builder: any) => builder.where("id", id))
    return wages[0]
}

export const insertApplication = async (id: string, user: string, formType: string, userGuid: string) => {
    const data = {
        id,
        form_type: formType,
        created_date: new Date(),
        created_by: user,
        created_by_guid: userGuid,
        shared_with: [],
        status: "Draft"
    }
    const result = await knex("applications").insert(data)
    return result
}

export const updateApplication = async (id: number, status: string | null, form: any) => {
    const wages = await knex("applications").where("id", id)
    if (wages.length === 0) {
        return 0
    }
    let result
    if (form && form.userInfo) {
        result = await knex("applications")
            .where("id", id)
            .update({
                form_confirmation_id: form.formSubmissionStatusCode === "SUBMITTED" ? form.confirmationId : null, // only store the confirmation ID when the form has been submitted
                form_submission_id: form.submissionId,
                form_submitted_date: form.formSubmissionStatusCode === "SUBMITTED" ? form.createdAt : null,
                position_title: form.positionTitle0, // TODO: what to do in the case of multiple positions?
                num_positions: Number(form.numberOfPositions0), // TODO: what to do in the case of multiple positions?
                catchmentno: Number(form.catchmentNo),
                status,
                updated_by: form.userInfo.username, // TODO: should match 'user' on insertion (uses a hash version of the users bceid instead of the actual username)
                updated_date: new Date()
            })
    }
    return result
}

export const deleteApplication = async (id: number) => {
    const result = await knex("applications").where("id", id).del()
    return result
}
