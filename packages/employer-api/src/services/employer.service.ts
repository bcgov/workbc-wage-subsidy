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
    const employer = await knex("employers").where((builder: any) => builder.where("id", userGuid))
    return employer.length === 1 ? employer[0] : null
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
                if (data?.bceid_business_guid || data.bceid_business_guid === null) {
                    queryBuilder.update("bceid_business_guid", data.bceid_business_guid)
                }
                if (data?.bceid_business_name || data.bceid_business_name === null) {
                    queryBuilder.update("bceid_business_name", data.bceid_business_name)
                }
                if (data?.contact_name || data.contact_name === null) {
                    queryBuilder.update("contact_name", data.contact_name)
                }
                if (data?.contact_email || data.contact_email === null) {
                    queryBuilder.update("contact_email", data.contact_email)
                }
                if (data?.phone_number || data.phone_number === null) {
                    queryBuilder.update("phone_number", data.phone_number)
                }
                if (data?.fax_number || data.fax_number === null) {
                    queryBuilder.update("fax_number", data.fax_number)
                }
                if (data?.cra_business_number || data.cra_business_number === null) {
                    queryBuilder.update("cra_business_number", data.cra_business_number)
                }
                if (data?.street_address || data.street_address === null) {
                    queryBuilder.update("street_address", data.street_address)
                }
                if (data?.city || data.city === null) {
                    queryBuilder.update("city", data.city)
                }
                if (data?.province || data.province === null) {
                    queryBuilder.update("province", data.province)
                }
                if (data?.postal_code || data.postal_code === null) {
                    queryBuilder.update("postal_code", data.postal_code)
                }
                if (data?.workplace_street_address || data.workplace_street_address === null) {
                    queryBuilder.update("workplace_street_address", data.workplace_street_address)
                }
                if (data?.workplace_city || data.workplace_city === null) {
                    queryBuilder.update("workplace_city", data.workplace_city)
                }
                if (data?.workplace_province || data.workplace_province === null) {
                    queryBuilder.update("workplace_province", data.workplace_province)
                }
                if (data?.workplace_postal_code || data.workplace_postal_code === null) {
                    queryBuilder.update("workplace_postal_code", data.workplace_postal_code)
                }
            })
    }
    return numUpdated
}

// Update employer profile from an application form obtained from CHEFS.
// Only update profile fields if they are not already set.
export const updateEmployerFromApplicationForm = async (employer: any, appFormData: any) => {
    const updateData = {
        ...(appFormData?.operatingName &&
            !employer?.bceid_business_name && { bceid_business_name: appFormData.operatingName }),
        ...(appFormData?.signatory1 && !employer?.contact_name && { contact_name: appFormData.signatory1 }),
        ...(appFormData?.employerEmail && !employer?.contact_email && { contact_email: appFormData.employerEmail }),
        ...(appFormData?.businessPhone && !employer?.phone_number && { phone_number: appFormData.businessPhone }),
        ...(appFormData?.businessFax && !employer?.fax_number && { fax_number: appFormData.businessFax }),
        ...(appFormData?.businessNumber &&
            !employer?.cra_business_number && { cra_business_number: appFormData.businessNumber }),
        ...(appFormData?.businessAddress &&
            !employer?.street_address && { street_address: appFormData.businessAddress }),
        ...(appFormData?.businessCity && !employer?.city && { city: appFormData.businessCity }),
        ...(appFormData?.businessProvince && !employer?.province && { province: appFormData.businessProvince }),
        ...(appFormData?.businessPostal && !employer?.postal_code && { postal_code: appFormData.businessPostal }),
        ...(appFormData.container?.addressAlt &&
            !employer.container?.workplace_street_address && {
                workplace_street_address: appFormData.container.addressAlt
            }),
        ...(appFormData.container?.cityAlt &&
            !employer.container?.workplace_city && { workplace_city: appFormData.container.cityAlt }),
        ...(appFormData.container?.provinceAlt &&
            !employer.container?.workplace_province && { workplace_province: appFormData.container.provinceAlt }),
        ...(appFormData.container?.postalAlt &&
            !employer.container?.workplace_postal_code && { workplace_postal_code: appFormData.container.postalAlt })
    }
    return updateEmployer(employer.id, updateData)
}
