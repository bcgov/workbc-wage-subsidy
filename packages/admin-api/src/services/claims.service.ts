/* eslint-disable import/prefer-default-export */
import axios from "axios"
import { knex } from "../config/db-config"
import { getCHEFSToken } from "./common.service"

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    // console.log(filters)
    const claims = await knex("wage_subsidy_claim_form")
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
            // If there are no status filters or the status filter is not marked for deletion we do not show the ones marked for deletion
            if (
                !filters.applicationstatus ||
                (!filters.applicationstatus.includes("Marked for Deletion") &&
                    !filters.applicationstatus.includes("In ICM"))
            ) {
                queryBuilder.whereNotIn("applicationstatus", ["Marked for Deletion", "In ICM"])
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
            if (filters.applicationstatus) {
                if (filters.applicationstatus.includes("NULL")) {
                    filters.applicationstatus.push("New")
                }
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            // guard clause for legacy applications, can be changed to sharepoint later if needed
            if (!filters.status) {
                queryBuilder.whereNotNull("status")
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

export const updateClaim = async (id: number, data: any, permission: any[], user: string) => {
    // console.log(data, id)
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    if (claims.length === 0) {
        return 0
    }
    // This helper function takes the old data and the new data and returns the difference
    // Source: https://stackoverflow.com/questions/57669696/getting-difference-object-from-two-objects-using-es6
    const getDifference = (a: any, b: any) =>
        Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val))
    if (claims[0].catchmentno in permission || permission[0] === "*") {
        // console.log([{ by: user, date: new Date(), changes: data }, ...claims[0].history.history])
        const result = await knex("wage_subsidy_claim_form")
            .where("id", id)
            .update(
                claims[0].history
                    ? {
                          ...data,
                          history: {
                              history: [
                                  { by: user, date: new Date(), changes: getDifference(claims[0], data) },
                                  ...claims[0].history.history
                              ]
                          }
                      }
                    : {
                          data
                      }
            )
        return result
    }
    // console.log(result)
    return 0
}

export const deleteClaim = async (id: number, permission: string[]) => {
    if (permission[0] === "*") {
        const result = await knex("wage_subsidy_claim_form").where("id", id).del()
        return result
    }
    // console.log(result)
    return 0
}

export const getFile = async (url: string) => {
    try {
        const token = await getCHEFSToken()
        const res = await axios({
            // need to use axios like this as otherwise it won't accept the Authorization header
            method: "get",
            url: `${process.env.CHEFS_URL}${url}`,
            responseType: "arraybuffer",
            responseEncoding: "binary",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                Accept: "application/pdf",
                Connection: "keep-alive"
            }
        })
        // console.log(res)
        return res.data
    } catch (error: any) {
        // console.log(error)
        throw new Error(error.message)
    }
}
