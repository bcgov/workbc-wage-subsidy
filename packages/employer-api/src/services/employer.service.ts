/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllEmployers = async (
    perPage: number,
    currPage: number,
    filters: any,
    sort: string[],
    businessGuid: string
) => {
    const employers = await knex("employers")
        .modify((queryBuilder: any) => {
            queryBuilder.where("bceid_business_guid", businessGuid)
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return employers
}

export const insertEmployer = async (data: any) => {
    const employerData: any = {}
    employerData.id = data.id
    employerData.created_by = data.id
    employerData.created_date = new Date()
    employerData.contact_name = data.contact_name
    employerData.contact_email = data.contact_email
    if (data.bceid_business_guid) {
        employerData.bceid_business_guid = data.bceid_business_guid
    }
    if (data.bceid_business_name) {
        employerData.bceid_business_name = data.bceid_business_name
    }
    const result = await knex("employers").insert(employerData)
    return result
}

export const getEmployerByID = async (userGuid: string) => {
    const employers = await knex("employers").where((builder: any) => builder.where("id", userGuid))
    return employers[0]
}

export const getEmployersByIDs = async (userGuids: string[]) => {
    const employers = await knex("employers").where((builder: any) => builder.whereIn("id", userGuids))
    return employers
}

export const updateEmployer = async (userGuid: string, data: any) => {
    let numUpdated = 0
    if (Object.keys(data).length > 0) {
        numUpdated = await knex("employers")
            .where("id", userGuid)
            .modify((queryBuilder: any) => {
                queryBuilder.update("updated_by", userGuid)
                queryBuilder.update("updated_date", new Date())
                if (data.bceid_business_guid) {
                    queryBuilder.update("bceid_business_guid", data.bceid_business_guid)
                }
                if (data.bceid_business_name) {
                    queryBuilder.update("bceid_business_name", data.bceid_business_name)
                }
                if (data.contact_name) {
                    queryBuilder.update("contact_name", data.contact_name)
                }
                if (data.contact_email) {
                    queryBuilder.update("contact_email", data.contact_email)
                }
                if (data.phone_number) {
                    queryBuilder.update("phone_number", data.phone_number)
                }
                if (data.fax_number) {
                    queryBuilder.update("fax_number", data.fax_number)
                }
                if (data.cra_business_number) {
                    queryBuilder.update("cra_business_number", data.cra_business_number)
                }
                if (data.street_address) {
                    queryBuilder.update("street_address", data.street_address)
                }
                if (data.city) {
                    queryBuilder.update("city", data.city)
                }
                if (data.province) {
                    queryBuilder.update("province", data.province)
                }
                if (data.postal_code) {
                    queryBuilder.update("postal_code", data.postal_code)
                }
                if (data.workplace_street_address) {
                    queryBuilder.update("workplace_street_address", data.workplace_street_address)
                }
                if (data.workplace_city) {
                    queryBuilder.update("workplace_city", data.workplace_city)
                }
                if (data.workplace_province) {
                    queryBuilder.update("workplace_province", data.workplace_province)
                }
                if (data.workplace_postal_code) {
                    queryBuilder.update("workplace_postal_code", data.workplace_postal_code)
                }
                if (data.workbc_center) {
                    queryBuilder.update("workbc_center", data.workbc_center)
                }
            })
    }
    return numUpdated
}
