/* eslint-disable import/prefer-default-export */
import axios from "axios"
import { knex } from "../config/db-config"
import { getCHEFSToken } from "./common.service"

export const getAllClaims = async (
    perPage: number,
    currPage: number,
    filters: any,
    sortFields: string[],
    sortOrders: string[],
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
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (filters.associated_application_id) {
                queryBuilder.where("associated_application_id", filters.associated_application_id)
            }
            if (sortFields?.length > 0 && sortOrders?.length > 0) {
                sortFields.forEach((field, i) => {
                    queryBuilder.orderByRaw(`${field} ${sortOrders[i]} NULLS LAST`)
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
    const claimCounts = knex
        .select("status")
        .count("*")
        .from("claims")
        .whereNot("status", "Draft")
        .where("catchmentno", Number(catchmentno))
        .groupBy("status")
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

export const deleteClaim = async (id: string) => {
    const numDeleted = await knex("claims").where("id", id).del()
    return numDeleted
}

export const getFile = async (url: string) => {
    // TODO: rework when we implement attachments.
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
