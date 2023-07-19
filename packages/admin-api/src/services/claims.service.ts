/* eslint-disable import/prefer-default-export */
import axios from "axios"
import { knex } from "../config/db-config"
import { getCHEFSToken } from "./common.service"

/**
 * Get all claims, filtered by the given parameters
 * @param perPage The number of items to return on each page
 * @param currPage The current page number
 * @param filters The filters to apply to the query
 * @param sort The sort to apply to the query
 * @param permission The permissions of the user
 */

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    const claims = await knex("claims")
        .whereNot("status", "Draft")
        .modify((queryBuilder: any) => {
            if (filters.id) {
                queryBuilder.where("id", `%${filters.id}%`)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

// This function gets a claim by ID
export const getClaimByID = async (id: number, permission: any[]) => {
    // Check if the user has permission to access all claims
    if (permission[0] !== "*") {
        // Convert the permission array to an array of numbers
        permission.map((p: any) => Number(p))
    }
    // Get the claim from the database
    const claims = await knex("claims").where("id", id)
    // Check if the claim is in the user's catchment area
    if (claims[0].catchmentno in permission || permission[0] === "*") {
        // Return the claim
        return claims
    }
    // If the claim is not in the user's catchment area, return an empty array
    return []
}

/**
 * This function is used to update a claim
 * @param {number} id - The id of the claim to be updated
 * @param {object} data - The new data for the claim
 * @param {array} permission - An array of catchment numbers that the user has permission to edit
 * @param {string} user - The username of the user who is editing the claim
 * @returns {number} Returns the number of rows that were updated
 */

export const updateClaim = async (id: number, data: any, permission: any[], user: string) => {
    // This helper function takes the old data and the new data and returns the difference
    // Source: https://stackoverflow.com/questions/57669696/getting-difference-object-from-two-objects-using-es6
    const getDifference = (a: any, b: any) =>
        Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val))

    if (permission[0] !== "*") {
        // Convert the permission array to an array of numbers
        permission.map((p: any) => Number(p))
    }
    // 1. Check if the claim exists
    const claims = await knex("claims").where("id", id)
    if (claims.length === 0) {
        return 0
    }

    // 2. Check if the user has permission to edit this claim
    if (claims[0].catchmentno in permission || permission[0] === "*") {
        // 3. Update the claim
        const result = await knex("claims")
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

    // 4. User does not have permission to edit this claim
    return 0
}

export const deleteClaim = async (id: number, permission: string[]) => {
    if (permission[0] === "*") {
        const result = await knex("claims").where("id", id).del()
        return result
    }
    return 0
}

// This function gets the file from the CHEFS API using the URL provided
// It uses the getCHEFSToken function to get the token from the local storage
// It then uses axios to make the GET request to the API
// The responseType and responseEncoding are set to "arraybuffer" and "binary" respectively
// This is because otherwise the file will be corrupted
// The headers are also set to get the file
// It then returns the data from the response

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
