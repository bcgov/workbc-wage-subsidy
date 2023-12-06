/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllApplications = async (
    perPage: number,
    currPage: number,
    filters: any,
    sortFields: string[],
    sortOrder: string,
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
            if (trx) {
                queryBuilder.transacting(trx)
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return applications
}

export const getApplicationCounts = async (catchmentno: string) => {
    const applicationCounts = knex
        .select("status")
        .count("*")
        .from("applications")
        .whereNot("status", "Draft")
        .where("catchmentno", Number(catchmentno))
        .groupBy("status")
    return applicationCounts
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
                if (data.workBcCentre) {
                    queryBuilder.update("workbc_centre", data.workBcCentre)
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
