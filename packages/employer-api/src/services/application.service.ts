/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (
    perPage: number,
    currPage: number,
    filters: any,
    sort: string[],
    user: string
) => {
    const applicationIds = knex("employers_applications").select("application_id").where("employer_id", user)
    const applicationsAndSharedUsers = await knex("applications as a")
        .join("employers_applications as ea", "a.id", "=", "ea.application_id")
        .join("employers as e", "ea.employer_id", "=", "e.id")
        .whereIn("a.id", applicationIds)
        .select("a.*")
        .groupBy("a.id")
        .select(knex.raw("ARRAY_AGG(e.contact_name) as shared_with_dynamic"))
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
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applicationsAndSharedUsers
}

export const getApplicationByID = async (id: string) => {
    const application = await knex("application").where("id", id)
    return application.length > 0 ? application[0] : null
}

export const insertApplication = async (id: string, userGuid: string, formType: string) => {
    const data = {
        id,
        form_type: formType,
        created_date: new Date(),
        created_by: userGuid,
        shared_with: [],
        status: "Draft"
    }
    const result = await knex("applications").insert(data)
    await knex("employers_applications").insert({ employer_id: userGuid, application_id: id })
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

export const shareApplication = async (id: string, userGuids: string[]) => {
    const data = userGuids.map((guid) => ({ employer_id: guid, application_id: id }))
    const result = await knex("employers_applications")
        .insert(data)
        .onConflict(["employer_id", "application_id"])
        .ignore()
    return result
}

export const getEmployerApplicationRecord = async (employerId: string, applicationId: string) => {
    const result = await knex("employers_applications")
        .where("employer_id", employerId)
        .where("application_id", applicationId)
    return result.length > 0 ? result[0] : null
}

export const deleteApplication = async (id: number) => {
    const result = await knex("applications").where("id", id).del()
    return result
}
