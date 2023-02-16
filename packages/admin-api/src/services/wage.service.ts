/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllWage = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    const claims = await knex("wage_subsidy_applications")
        .whereNotNull("applicationstatus")
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", Number(filters.id))
            }
            if (filters.applicationid) {
                queryBuilder.whereLike("applicationid", `%${filters.applicationid}%`)
            }
            if (filters.title) {
                queryBuilder.whereLike("title", `%${filters.title}%`)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            } else if (permission.length > 0 && permission[0] !== "*") {
                queryBuilder.whereIn("catchmentno", permission)
            } else if (permission.length === 0) {
                queryBuilder.whereIn("catchmentno", [0])
            }
            if (filters.applicationstatus) {
                if (filters.applicationstatus.includes("NULL")) {
                    filters.applicationstatus.push("New")
                }
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

export const getWageByID = async (id: number, permission: any[]) => {
    // console.log(id)
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    const wage = await knex("wage_subsidy_applications").where("id", id)
    if (wage[0].catchmentno in permission || permission[0] === "*") {
        // console.log("yes")
        return wage
    }
    return []
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

export const deleteWage = async (id: number, permission: string[]) => {
    const wages = await knex("wage_subsidy_applications").where("id", id)
    if (wages.length === 0) {
        return 0
    }
    if (permission[0] === "*") {
        const result = await knex("wage_subsidy_applications").where("id", id).del()
        return result
    }
    return 0
}

export const getWageByIdPDF = async (id: number) => {
    const wage = await knex("wage_subsidy_applications").where("id", id)
    return wage
}
