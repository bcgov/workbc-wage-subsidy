/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    const claims = await knex("wage_subsidy_claim_form")
        .modify((queryBuilder: any) => {
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            } else if (permission.length > 0 && permission[0] !== "*") {
                console.log(permission)
                queryBuilder.whereIn("catchmentno", permission)
            } else if (permission.length === 0) {
                queryBuilder.whereIn("catchmentno", [0])
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
            if (filters.applicationstatus) {
                if (filters.applicationstatus.includes("NULL")) {
                    filters.applicationstatus.push("New")
                }
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

// export const getClaimsByCatchment = async (ca: number[]) => {
//     const claims = await knex("wage_subsidy_claim_form").where((builder: any) => builder.whereIn("catchmentno", ca))
//     return claims
// }

export const getClaimByID = async (id: number, permission: any[]) => {
    // console.log(id)
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    if (claims[0].catchmentno in permission || permission[0] === "*") {
        // console.log("yes")
        return claims
    }
    return []
}

export const updateClaim = async (id: number, data: any, permission: any[]) => {
    // console.log(data, id)
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    if (claims[0].catchmentno in permission || permission[0] === "*") {
        const result = await knex("wage_subsidy_claim_form").where("id", id).update(data)
        return result
    }
    // console.log(result)
    return 0
}

export const deleteClaim = async (id: number) => {
    const result = await knex("wage_subsidy_claim_form").where("id", id).del()
    // console.log(result)
    return result
}
