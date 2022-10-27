/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

/** 
    @param data formio/chefs data
    @param user user information jwt or username
    @returns result of insert
*/
export const insertWage = async (data: any, user: any) => {
    // Insert into wage table
    await knex("wage_subsidy_applications")
}
