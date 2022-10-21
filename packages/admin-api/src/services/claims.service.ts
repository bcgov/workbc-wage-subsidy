/* eslint-disable import/prefer-default-export */
import { knex } from '../config/db-config'

export const getAllClaims = async (perPage: number, currPage: number, filters: any) => {
  const claims = await knex('wage_subsidy_claim_form')
    .modify((queryBuilder: any) => {
      if (filters.applicationstatus) {
        queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
      }
      if (filters.catchmentno){
        queryBuilder.where("catchmentno", Number(filters.catchmentno))
      }
    })
    .paginate({ perPage, currentPage: currPage })
  return claims
}

export const getClaimsByCatchment = async (ca: number[]) => {
  const claims = await knex('wage_subsidy_claim_form').where((builder: any) => builder.whereIn('catchmentno', ca))
  return claims
}
