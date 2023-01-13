/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any) => {
    const claims = await knex("wage_subsidy_claim_form")
        .modify((queryBuilder: any) => {
            if (filters.applicationstatus) {
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

export const getClaimsByCatchment = async (ca: number[]) => {
    const claims = await knex("wage_subsidy_claim_form").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const getClaimByID = async (id: number) => {
    // console.log(id)
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    return claims
}

export const updateClaim = async (id: number, data: any) => {
    console.log(data, id)
    const result = await knex("wage_subsidy_claim_form").where("id", id).update(data)
    console.log(result)
    return result
}
