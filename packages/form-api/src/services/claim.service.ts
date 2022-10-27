/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

/**
 *    @param data formio/chefs data
 *    @param user user information jwt or username
 *    @returns result of insert
 */
export const insertClaim = async (data: any, user: any) => {
    // Insert into claims table
    await knex("wage_subsidy_claim_form")
}

/**
 * @param applicatonId applicationID to which claim should be attached
 * @returns application object or null if not found
 */
export const getParentApplication = async (applicationId: string) => {
    await knex("wage_subsidy_applications")
}
