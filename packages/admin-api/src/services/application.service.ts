/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (perPage: number, currPage: number, filters: any, sort: string[]) => {
    const applications = await knex("applications")
        .whereNot("status", "Draft")
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", Number(filters.id))
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applications
}

export const getApplicationByID = async (id: string) => {
    const application = await knex("applications").where((builder: any) => builder.where("id", id))
    return application.length > 0 ? application[0] : null
}

export const updateApplication = async (id: number, status: string | null, form: any) => {
    let numUpdated = 0
    if (form && form.userInfo) {
        numUpdated = await knex("applications")
            .where("id", id)
            .update({
                status,
                catchmentno: Number(form.catchmentNo),
                updated_by: form.userInfo.username,
                updated_date: new Date()
            })
    }
    return numUpdated
}

export const deleteApplication = async (id: string) => {
    const numDeleted = await knex("applications").where("id", id).del()
    return numDeleted
}

export const getApplicationByIdPDF = async (id: number) => {
    // TODO: rework when we implement PDF generation.
    const application = await knex("applications").where("id", id)
    return application
}
