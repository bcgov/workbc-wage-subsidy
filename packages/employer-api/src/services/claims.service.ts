/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllClaims = async (perPage: number, currPage: number, filters: any, sort: any, user: string) => {
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
            if (user) {
                queryBuilder.where("createdbyguid", user)
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

export const getClaimsByCatchment = async (ca: number[]) => {
    const claims = await knex("wage_subsidy_claim_form").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const insertClaim = async (id: string, user: string, formType: string, userGuid: string) => {
    const data = {
        internalid: id,
        // user: user
        created: new Date(),
        formtype: formType,
        createdby: user,
        createdbyguid: userGuid
    }
    const result = await knex("wage_subsidy_claim_form").insert(data)
    return result
}

export const getClaimByID = async (id: number) => {
    const claims = await knex("wage_subsidy_claim_form").where((builder: any) => builder.whereIn("id", id))
    return claims
}

export const updateClaims = async (id: number, confirmationId: string, submissionId: string, status: string) => {
    const result = await knex("wage_subsidy_claim_form").where("id", id).update({
        confirmationid: confirmationId,
        applicationid: submissionId,
        status
    })
    console.log(result)
}

export const updateClaimsData = async (body: any, id: number) => {
    // Insert into wage table
    const data = body
    console.log(data)
    Object.keys(data).forEach((e) => {
        console.log(data[e])
        if (data[e] === "") {
            data[e] = null
        }
    })
    console.log(data)
    const claimsData = {
        // title: data.title,
        catchmentno: data.container.workbcCentre.split("-")[0],
        formtype: "claim",
        // applicationid: data.applicationid,
        applicationstatus: null,
        periodstart1: data.periodStart1,
        periodstart2: data.periodStart2,
        isfinalclaim: data.isFinalClaim,
        operatingname: data.employerName,
        businessaddress1: data.businessAddress1,
        businessaddress2: data.businessAddress2,
        businesscity: data.employerCity,
        businesspostal: data.employerPostal,
        businessphone: data.employerPhone,
        employeefirstname: data.employeeFirstName,
        employeelastname: data.employeeLastName,
        datefrom1: data.dateFrom1,
        datefrom2: data.dateFrom2,
        datefrom3: data.dateFrom3,
        datefrom4: data.dateFrom4,
        datefrom5: data.dateFrom5,
        dateto1: data.dateTo1,
        dateto2: data.dateTo2,
        dateto3: data.dateTo3,
        dateto4: data.dateTo4,
        dateto5: data.dateTo5,
        hoursworked1: data.hoursWorked1,
        hoursworked2: data.hoursWorked2,
        hoursworked3: data.hoursWorked3,
        hoursworked4: data.hoursWorked4,
        hoursworked5: data.hoursWorked5,
        hourlywage1: data.hourlyWage1,
        hourlywage2: data.hourlyWage2,
        hourlywage3: data.hourlyWage3,
        hourlywage4: data.hourlyWage4,
        hourlywage5: data.hourlyWage5,
        workactivitiesandissues: data.clientIssues1,
        totalwage1: data.total1,
        totalwage2: data.total2,
        totalwage3: data.total3,
        totalwage4: data.total4,
        totalwage5: data.total5,
        // eligiblewages: data.eligiblewages,
        // eligiblewages2: data.eligiblewages2,
        totalmercs1: data.totalMERCs,
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
        markedfordeletion: false,
        internalid: data.internalId
        // modified,
        // created
    }
    if (data.dateFrom2 === "") {
        claimsData.datefrom2 = null
    }
    if (data.dateFrom3 === "") {
        claimsData.datefrom3 = null
    }
    if (data.dateFrom4 === "") {
        claimsData.datefrom4 = null
    }
    if (data.dateFrom5 === "") {
        claimsData.datefrom5 = null
    }
    if (data.dateTo2 === "") {
        claimsData.dateto2 = null
    }
    if (data.dateTo3 === "") {
        claimsData.dateto3 = null
    }
    if (data.dateTo4 === "") {
        claimsData.dateto4 = null
    }
    if (data.dateTo5 === "") {
        claimsData.dateto5 = null
    }
    if (data.hourlyWage2 === "") {
        claimsData.hourlywage2 = null
    }
    if (data.hourlyWage3 === "") {
        claimsData.hourlywage3 = null
    }
    if (data.hourlyWage4 === "") {
        claimsData.hourlywage4 = null
    }
    if (data.hourlyWage5 === "") {
        claimsData.hourlywage5 = null
    }
    if (data.hoursWorked2 === "") {
        claimsData.hoursworked2 = null
    }
    if (data.hoursWorked3 === "") {
        claimsData.hoursworked3 = null
    }
    if (data.hoursWorked4 === "") {
        claimsData.hoursworked4 = null
    }
    if (data.hoursWorked5 === "") {
        claimsData.hoursworked5 = null
    }
    if (data.totalWage2 === 0) {
        claimsData.totalwage2 = null
    }
    if (data.totalWage3 === 0) {
        claimsData.totalwage3 = null
    }
    if (data.totalWage4 === 0) {
        claimsData.totalwage4 = null
    }
    if (data.totalWage5 === 0) {
        claimsData.totalwage5 = null
    }
    console.log(claimsData)
    const insert = await knex("wage_subsidy_claim_form").where("id", id).update(claimsData)
    return insert
}
