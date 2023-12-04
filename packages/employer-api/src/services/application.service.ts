/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (
    perPage: number,
    currPage: number,
    filters: any,
    sortFields: string[],
    sortOrder: string,
    user: string
) => {
    const applicationIds = knex("employers_applications").select("application_id").where("employer_id", user)
    const applicationsAndSharedUsers = await knex("applications as a")
        .join("employers_applications as ea", "a.id", "=", "ea.application_id")
        .join("employers as e", "ea.employer_id", "=", "e.id")
        .whereIn("a.id", applicationIds)
        .select("a.*")
        .groupBy("a.id")
        // Compute 'Shared With' column. Do not include the name of the requestor, and do not include NULL in its place.
        .select(knex.raw("COALESCE( ARRAY_AGG(e.contact_name) FILTER (WHERE e.id!=?), '{}') as shared_with", user))
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", filters.id)
            }
            if (filters.status) {
                queryBuilder.whereIn("status", filters.status)
            }
            if (filters.form_confirmation_id) {
                queryBuilder.where("form_confirmation_id", filters.form_confirmation_id)
            }
            if (sortFields?.length > 0 && sortOrder) {
                sortFields.forEach((field, i) => {
                    sortOrder === "DESC"
                        ? queryBuilder.orderByRaw(`${field} ${sortOrder} NULLS LAST`)
                        : queryBuilder.orderByRaw(`${field} ${sortOrder} NULLS FIRST`)
                })
            } else {
                // default sort
                queryBuilder.orderBy("id", "ASC")
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applicationsAndSharedUsers
}

export const getApplicationCounts = async (userGuid: string) => {
    const applicationCounts = knex
        .select("status")
        .count("*")
        .from(knex.select("application_id").from("employers_applications").where("employer_id", userGuid).as("ea"))
        .join("applications as a", "ea.application_id", "=", "a.id")
        .groupBy("status")
    return applicationCounts
}

export const getApplicationByID = async (id: string) => {
    const application = await knex("applications").where("id", id)
    return application.length > 0 ? application[0] : null
}

export const getApplicationByConfirmationID = async (confirmationId: string) => {
    const application = await knex("applications").where("form_confirmation_id", confirmationId)
    return application.length > 0 ? application[0] : null
}

export const getApplicationBySubmissionID = async (submissionId: string) => {
    const application = await knex("applications").where("form_submission_id", submissionId)
    return application.length > 0 ? application[0] : null
}

export const insertApplication = async (
    id: string,
    userGuid: string,
    formType: string,
    submissionID: string,
    trx?: any
) => {
    const data = {
        id,
        form_type: formType,
        form_submission_id: submissionID,
        created_date: new Date(),
        created_by: userGuid,
        status: "Draft",
        catchmentno: 5 // Temporary, for testing: set arbitrary catchment.
    }
    const result = await knex("applications").modify((queryBuilder: any) => {
        queryBuilder.insert(data)
        if (trx) {
            queryBuilder.transacting(trx)
        }
    })
    return result
}

export const updateApplication = async (id: number, status: string | null, body: any, requireStale?: boolean) => {
    const wages = await knex("applications").where("id", id)
    if (wages.length === 0) {
        console.log("application not found with id ", id)
        return 0
    }
    let result
    if (body) {
        const submitted = body.draft === false
        result = await knex("applications")
            .where("id", id)
            .modify((queryBuilder: any) => {
                if (requireStale) {
                    queryBuilder.where("stale", true)
                }
            })
            .update({
                form_confirmation_id: submitted ? body.confirmationId : null, // only store the confirmation ID when the form has been submitted
                form_submitted_date: submitted ? body.createdAt : null,
                position_title: body.submission.data.positionTitle0,
                num_positions: body.submission.data.numberOfPositions0
                    ? Number(body.submission.data.numberOfPositions0)
                    : null,
                catchmentno: body.submission.data.catchmentNo ? Number(body.submission.data.catchmentNo) : null,
                workbc_centre: body.submission.data.catchmentNoStoreFront
                    ? body.submission.data.catchmentNoStoreFront
                    : null,
                status,
                updated_by: "system",
                updated_date: new Date(),
                organization: body.submission.data.operatingName,
                stale: false
            })
    }
    return result
}

export const markApplication = async (id: string) => {
    const result = await knex("applications").update("stale", true).where("id", id).where("status", "Draft")
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

export const deleteApplication = async (id: number) => {
    const result = await knex("applications").where("id", id).del()
    return result
}

export const getEmployerApplicationRecord = async (employerId: string, applicationId: string) => {
    const result = await knex("employers_applications")
        .where("employer_id", employerId)
        .where("application_id", applicationId)
    return result.length > 0 ? result[0] : null
}

export const insertEmployerApplicationRecord = async (employerId: string, applicationId: string, trx?: any) => {
    const result = await knex("employers_applications").modify((queryBuilder: any) => {
        queryBuilder.insert({ employer_id: employerId, application_id: applicationId })
        if (trx) {
            queryBuilder.transacting(trx)
        }
    })
    return result
}

export const getStaleDrafts = async (user: string) => {
    const drafts = await knex
        .select("id", "form_type", "form_submission_id", "status", "created_by")
        .from(
            knex
                .select("*")
                .from("employers_applications as ea")
                .where("employer_id", user)
                .join("applications as a1", "a1.id", "=", "ea.application_id")
                .as("a2")
        )
        .where("status", "Draft")
        .where("stale", true)
    return drafts
}

export const oneApplicationSubmitted = async (user: string) => {
    const submittedApplications = await knex
        .select("status")
        .from(
            knex
                .select("*")
                .from("employers_applications as ea")
                .where("employer_id", user)
                .join("applications as a1", "a1.id", "=", "ea.application_id")
                .as("a2")
        )
        .whereNot("status", "Draft")
    return submittedApplications.length === 1
}

export const getFormId = (formType: string) => {
    if (formType === "Have Employee") {
        return process.env.HAVE_EMPLOYEE_ID as string
    }
    if (formType === "Need Employee") {
        return process.env.NEED_EMPLOYEE_ID as string
    }
    return ""
}

export const getFormPass = (formType: string) => {
    if (formType === "Have Employee") {
        return process.env.HAVE_EMPLOYEE_PASS as string
    }
    if (formType === "Need Employee") {
        return process.env.NEED_EMPLOYEE_PASS as string
    }
    return ""
}

export const getFormVersionId = (formType: string) => {
    if (formType === "Have Employee") {
        return process.env.HAVE_EMPLOYEE_VERSION_ID as string
    }
    if (formType === "Need Employee") {
        return process.env.NEED_EMPLOYEE_VERSION_ID as string
    }
    return ""
}
