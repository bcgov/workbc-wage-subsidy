/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

/**
 * Fetches all wage subsidy applications, optionally filtered by a given set of filters.
 * @param {number} perPage - the number of applications to fetch per page
 * @param {number} currPage - the page number to fetch
 * @param {object} filters - an object containing filters to apply to the query
 * @param {number} filters.id - the id of the application to fetch
 * @param {string} filters.applicationid - the application id to fetch
 * @param {string} filters.title - the title of the application to fetch
 * @param {string} filters.catchmentno - the catchment number of the application to fetch
 * @param {string[]} filters.applicationstatus - an array of application statuses to filter by
 * @param {string[]} filters.status - an array of application statuses to filter by
 * @param {string[]} sort - an array containing the sort column and sort direction
 * @param {string[]} permission - an array of catchment numbers to filter by, or an empty array if no catchment numbers are provided
 * @returns {object} - a paginated set of wage subsidy applications
 */

// get all wage subsidy applications
export const getAllWage = async (perPage: number, currPage: number, filters: any, sort: any, permission: any[]) => {
    const claims = await knex("wage_subsidy_applications")
        // get all applications that have a status
        .whereNotNull("applicationstatus")
        // modify the query
        .modify((queryBuilder: any) => {
            // if there is a filter with the id key, filter by id
            if (filters.id) {
                queryBuilder.where("id", Number(filters.id))
            }
            // if there is a filter with the applicationid key, filter by applicationid
            if (filters.applicationid) {
                queryBuilder.whereLike("applicationid", `%${filters.applicationid}%`)
            }
            // if there is a filter with the title key, filter by title
            if (filters.title) {
                queryBuilder.whereLike("title", `%${filters.title}%`)
            }
            // if there is a filter with the catchmentno key, filter by catchmentno
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            // if there is a filter with the applicationstatus key, filter by applicationstatus
            if (filters.applicationstatus) {
                if (filters.applicationstatus.includes("NULL")) {
                    filters.applicationstatus.push("New")
                }
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            // if there is a sort array, sort by that
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        // paginate the query for the current page
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

/**
 * Gets a wage subsidy application based on its ID.
 * @param {number} id - The ID of the wage subsidy application to get.
 * @param {any[]} permission - The user's permission array.
 * @returns {Promise<any[]>} A promise that resolves to the wage subsidy application, or an empty array if the user doesn't have permission to view the wage subsidy application.
 */
export const getWageByID = async (id: number, permission: any[]) => {
    // Check if the user has the '*' permission, which allows them to access all wage subsidy applications
    if (permission[0] !== "*") {
        // Convert the permission values to numbers
        permission.map((p: any) => Number(p))
    }
    // Get the wage subsidy application based on the id
    const wage = await knex("wage_subsidy_applications").where("id", id)
    // Check if the user has permission to view this wage subsidy application
    if (wage[0].catchmentno in permission || permission[0] === "*") {
        // If the user has permission, return the wage subsidy application
        return wage
    }
    // If the user doesn't have permission, return an empty array
    return []
}

// This function is used to update an application in the wage subsidy database
// The function takes an id, data, permission, and user as arguments
// The id is the id of the application in the database
// The data is the data that is being updated
// The permission is the permission the user has to edit the application
// The user is the user that is updating the application
// The function returns 0 if the user does not have permission to edit the application
// The function returns the number of applications that were updated if the user has permission to edit the application
export const updateWage = async (id: number, data: any, permission: any[], user: string) => {
    // console.log(data, id)
    // Check if the user has permission to edit this application
    if (permission[0] !== "*") {
        permission.map((p: any) => Number(p))
    }
    // Get the application from the database
    const wages = await knex("wage_subsidy_applications").where("id", id)
    // If the application does not exist, return 0
    if (wages.length === 0) {
        return 0
    }
    // This helper function takes the old data and the new data and returns the difference
    // Source: https://stackoverflow.com/questions/57669696/getting-difference-object-from-two-objects-using-es6
    const getDifference = (a: any, b: any) =>
        Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val))
    // Check if the user has permission to edit this application
    if (wages[0].catchmentno in permission || permission[0] === "*") {
        // Update the application
        const result = await knex("wage_subsidy_applications")
            .where("id", id)
            .update(
                wages[0].history
                    ? {
                          ...data,
                          history: {
                              history: [
                                  {
                                      by: user,
                                      date: new Date(),
                                      changes: getDifference(wages[0], data)
                                  },
                                  ...wages[0].history.history
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

// Deletes a wage subsidy application from the database.
// The function takes an id and an array of permissions.
// The id is the id of the wage subsidy application to delete.
// The permissions are used to check if the user is allowed to delete the application.
// If the user is allowed to delete the application, the function deletes the application from the database and returns the number of rows deleted.
// If the user is not allowed to delete the application, the function returns 0.
// The function returns an error if the id doesn't match any wage subsidy applications.

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

/**
 * Get a wage subsidy application by id
 * @param id of the wage subsidy application
 */
export const getWageByIdPDF = async (id: number) => {
    const wage = await knex("wage_subsidy_applications").where("id", id)
    return wage
}
