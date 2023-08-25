/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (
    perPage: number,
    currPage: number,
    filters: any,
    sort: string[],
    trx?: any
) => {
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
            if (filters.form_confirmation_id) {
                queryBuilder.where("form_confirmation_id", filters.form_confirmation_id)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
            if (trx) {
                queryBuilder.transacting(trx)
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applications
}

export const getApplicationByID = async (id: string) => {
    const application = await knex("applications").where((builder: any) => builder.where("id", id))
    return application.length > 0 ? application[0] : null
}

export const updateApplication = async (id: string, username: string, data: any, trx?: any) => {
    let numUpdated = 0
    if (Object.keys(data).length > 0) {
        numUpdated = await knex("applications")
            .where("id", id)
            .modify((queryBuilder: any) => {
                queryBuilder.update("updated_by", username)
                queryBuilder.update("updated_date", new Date())
                if (data.status) {
                    queryBuilder.update("status", data.status)
                }
                if (data.catchmentNo) {
                    queryBuilder.update("catchmentno", data.catchmentNo)
                }
                if (trx) {
                    queryBuilder.transacting(trx)
                }
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
