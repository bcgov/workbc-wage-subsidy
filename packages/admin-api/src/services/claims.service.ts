/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import axios from "axios"
import { knex } from "../config/db-config"
import { getCHEFSToken } from "./common.service"

export const getAllClaims = async (
    perPage: number,
    currPage: number,
    filters: any,
    sortFields: string[],
    sortOrder: string,
    getDrafts?: boolean,
    trx?: any
) => {
    const claims = await knex("claims")
        .modify((queryBuilder: any) => {
            if (!getDrafts) {
                queryBuilder.whereNot("status", "Draft")
            }
            if (filters.id) {
                queryBuilder.where("id", `%${filters.id}%`)
            }
            if (filters.catchmentno && Number(filters.catchmentno) !== 0) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (filters.associated_application_id) {
                queryBuilder.where("associated_application_id", filters.associated_application_id)
            }
            if (filters.search_query) {
                // special logic for full names //
                const searchSplit = filters.search_query.split(" ")
                const firstName = searchSplit[0]
                const lastName = searchSplit.length === 2 && searchSplit[1] ? searchSplit[1] : searchSplit[0]

                queryBuilder.where((queryBuilder: any) => {
                    queryBuilder
                        .where("form_confirmation_id", "ILIKE", `%${filters.search_query}%`)
                        .orWhere("position_title", "ILIKE", `%${filters.search_query}%`)
                        .orWhere("employee_first_name", "ILIKE", `%${firstName}%`)
                        .orWhere("employee_last_name", "ILIKE", `%${lastName}%`)
                        .orWhere("associated_application_id", "ILIKE", `%${filters.search_query}%`)
                })
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
    return claims
}

export const getClaimCounts = async (catchmentno: string) => {
    let claimCounts
    if (Number(catchmentno) !== 0) {
        // 0 <=> all catchments
        claimCounts = knex
            .select("status")
            .count("*")
            .from("claims")
            .whereNot("status", "Draft")
            .where("catchmentno", Number(catchmentno))
            .groupBy("status")
    } else {
        claimCounts = knex.select("status").count("*").from("claims").whereNot("status", "Draft").groupBy("status")
    }

    return claimCounts
}

export const getClaimByID = async (id: string) => {
    const claim = await knex("claims").where((builder: any) => builder.where("id", id))
    return claim.length > 0 ? claim[0] : null
}

export const updateClaim = async (id: string, username: string, data: any, trx?: any) => {
    let numUpdated = 0
    if (Object.keys(data).length > 0) {
        numUpdated = await knex("claims")
            .where("id", id)
            .modify((queryBuilder: any) => {
                queryBuilder.update("updated_by", username)
                queryBuilder.update("updated_date", new Date().toISOString())
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

export const deleteClaim = async (id: string) => {
    const numDeleted = await knex("claims").where("id", id).del()
    return numDeleted
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
        return res.data
    } catch (error: any) {
        throw new Error(error.message)
    }
}
