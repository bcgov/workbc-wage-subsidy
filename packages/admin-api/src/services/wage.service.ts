/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllWage = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    const claims = await knex("wage_subsidy_applications")
        .modify((queryBuilder: any) => {
            if (filters.applicationstatus) {
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            } else if (permission.length > 0 && permission[0] !== "*") {
                queryBuilder.whereIn("catchmentno", permission)
            } else if (permission.length === 0) {
                queryBuilder.whereIn("catchmentno", [0])
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

// export const getWageByCatchment = async (ca: number[]) => {
//     const claims = await knex("wage_subsidy_applications").where((builder: any) => builder.whereIn("catchmentno", ca))
//     return claims
// }

export const updateWage = async (id: number, data: any, permission: any[]) => {
    // console.log(data, id)
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    const wages = await knex("wage_subsidy_applications").where("id", id)
    if (wages.length === 0) {
        return 0
    }
    if (wages[0].catchmentno in permission || permission[0] === "*") {
        const result = await knex("wage_subsidy_applications").where("id", id).update(data)
        return result
    }
    // console.log(result)
    return 0
}

export const deleteWage = async (id: number) => {
    const result = await knex("wage_subsidy_applications").where("id", id).del()
    console.log(result)
    return result
}

export const getWageById = async (id: number) => {
    const wage = await knex("wage_subsidy_applications").where("id", id)
    return wage
}
