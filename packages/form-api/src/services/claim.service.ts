/* eslint-disable prefer-destructuring */
/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

/**
 *    @param data formio/chefs data
 *    @param user user information jwt or username
 *    @returns result of insert
 */
export const insertClaim = async (data: any, user: any) => {
    // Insert into claims table
    const claimsData = {
        // title: data.title,
        catchmentno: data.catchmentno,
        formtype: "claim",
        // applicationid: data.applicationid,
        applicationstatus: null,
        periodstart1: data.periodstart1,
        periodstart2: data.periodstart2,
        isfinalclaim: data.isfinalclaim,
        operatingname: data.operatingname,
        businessaddress1: data.businessaddress1,
        businessaddress2: data.businessaddress2,
        businesscity: data.businesscity,
        businesspostal: data.businesspostal,
        businessphone: data.businessphone,
        employeefirstname: data.employeefirstname,
        employeelastname: data.employeelastname,
        datefrom1: data.datefrom1,
        datefrom2: data.datefrom2,
        datefrom3: data.datefrom3,
        datefrom4: data.datefrom4,
        datefrom5: data.datefrom5,
        dateto1: data.dateto1,
        dateto2: data.dateto2,
        dateto3: data.dateto3,
        dateto4: data.dateto4,
        dateto5: data.dateto5,
        hoursworked1: data.hoursworked1,
        hoursworked2: data.hoursworked2,
        hoursworked3: data.hoursworked3,
        hoursworked4: data.hoursworked4,
        hoursworked5: data.hoursworked5,
        hourlywage1: data.hourlywage1,
        hourlywage2: data.hourlywage2,
        hourlywage3: data.hourlywage3,
        hourlywage4: data.hourlywage4,
        hourlywage5: data.hourlywage5,
        workactivitiesandissues: data.clientIssues1,
        totalwage1: data.totalwage1,
        totalwage2: data.totalwage2,
        totalwage3: data.totalwage3,
        totalwage4: data.totalwage4,
        totalwage5: data.totalwage5,
        // eligiblewages: data.eligiblewages,
        // eligiblewages2: data.eligiblewages2,
        totalmercs1: data.totalmercs1,
        // totalmercs2: data.totalmercs2,
        // subsidyratepercent1: data.subsidyratepercent1,
        // subsidyratepercent2: data.subsidyratepercent2,
        // subsidyratedatefrom1: data.subsidyratedatefrom1,
        // subsidyratedateto1: data.subsidyratedateto1,
        // totalamountreimbursed1: data.totalamountreimbursed1,
        // claimapprovedby1: data.claimapprovedby1,
        // subsidyratedatefrom2: data.subsidyratedatefrom2,
        // subsidyratedateto2: data.subsidyratedateto2,
        // totalamountreimbursed2: data.totalamountreimbursed2,
        // claimapprovedby2: data.claimapprovedby2,
        // claimverifieddate: data.claimverifieddate,
        // totalsubsidyclaimed: data.totalsubsidyclaimed,
        // totalweeks1: data.totalweeks1,
        // totalweeks2: data.totalweeks2,
        // wagesreimbursed1: data.wagesreimbursed1,
        // wagesreimbursed2: data.wagesreimbursed2,
        // mercsreimbursed1: data.mercsreimbursed1,
        // mercsreimbursed2: data.mercsreimbursed2,
        // claimemployeeinfo: data.claimemployeeinfo,
        // originalapplicationid: data.originalapplicationid,
        // history: data.history,
        // sf: data.sf,
        // centrename: data.centrename,
        markedfordeletion: false
        // modified,
        // created
    }
    claimsData.catchmentno = data.workbcCentre.split("-")[0]
    console.log(claimsData)
    const claims = await knex("wage_subsidy_applications").insert(claimsData)
    return claims
}

/**
 * @param applicatonId applicationID to which claim should be attached
 * @returns application object or null if not found
 */
export const getParentApplication = async (applicationId: string) => {
    const parent = await knex("wage_subsidy_applications").where({ applicationid: applicationId })
    return parent
}
