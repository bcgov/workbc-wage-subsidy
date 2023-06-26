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
                queryBuilder.whereLike("createdby", user).orWhereLike("sharedwith", `%${user}%`)
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
        createdbyguid: userGuid,
        sharedwith: ""
    }
    const result = await knex("wage_subsidy_claim_form").insert(data)
    return result
}

export const getClaimByID = async (id: number) => {
    const claims = await knex("wage_subsidy_claim_form").where((builder: any) => builder.where("id", id))
    return claims[0]
}

export const updateClaims = async (
    id: number,
    confirmationId: string,
    submissionId: string,
    status: string,
    data: any
) => {
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    if (claims.length === 0) {
        return 0
    }
    if (data) {
        const result = await knex("wage_subsidy_claim_form").where("id", id).update(data)
        return result
    }
    const result = await knex("wage_subsidy_claim_form").where("id", id).update({
        confirmationid: confirmationId,
        applicationid: submissionId,
        status
    })
    console.log(result)
    return result
}

export const deleteClaim = async (id: number) => {
    const claims = await knex("wage_subsidy_claim_form").where("id", id)
    if (claims.length !== 0 && (claims[0].status === null || claims[0].status === "draft")) {
        const result = await knex("wage_subsidy_claim_form").where("id", id).del()
        return result
    }
    return null
}

export const updateClaimsData = async (body: any, id: number) => {
    // Insert into wage table
    const data = body.container
    Object.keys(data).forEach((e) => {
        // console.log(data[e])
        if (data[e] === "") {
            data[e] = null
        }
    })
    const claim = await knex("wage_subsidy_claim_form").where("id", id)
    const claimsData = {
        title: `Claim - ${data.employerName} - ${body.confirmationId}`,
        catchmentno: data.workbcCentre.split("-")[0],
        confirmationid: body.confirmationId,
        status: "submitted",
        formtype: "claim",
        applicationid: body.submissionId,
        applicationstatus: "New",
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
        hoursworked1: Number(data.hoursWorked1) * 100,
        hoursworked2: Number(data.hoursWorked2) * 100,
        hoursworked3: Number(data.hoursWorked3) * 100,
        hoursworked4: Number(data.hoursWorked4) * 100,
        hoursworked5: Number(data.hoursWorked5) * 100,
        hourlywage1: Number(data.hourlyWage1) * 100,
        hourlywage2: Number(data.hourlyWage2) * 100,
        hourlywage3: Number(data.hourlyWage3) * 100,
        hourlywage4: Number(data.hourlyWage4) * 100,
        hourlywage5: Number(data.hourlyWage5) * 100,
        workactivitiesandissues: data.clientIssues1,
        totalwage1: Number(data.hourlyWage1 || "0") * Number(data.hoursWorked1 || "0") * 100,
        totalwage2: Number(data.hourlyWage2 || "0") * Number(data.hoursWorked2 || "0") * 100,
        totalwage3: Number(data.hourlyWage3 || "0") * Number(data.hoursWorked3 || "0") * 100,
        totalwage4: Number(data.hourlyWage4 || "0") * Number(data.hoursWorked4 || "0") * 100,
        totalwage5: Number(data.hourlyWage5 || "0") * Number(data.hoursWorked5 || "0") * 100,
        files: { files: data.supportingDocuments },
        history: {
            history: [
                { changes: { applicationstatus: "New" }, date: claim[0].created, by: `bceid:${claim[0].createdby}` }
            ]
        },
        totalmercs1: data.totalMERCs,
        markedfordeletion: false,
        internalid: data.internalId
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
        claimsData.hourlywage2 = 0
    }
    if (data.hourlyWage3 === "") {
        claimsData.hourlywage3 = 0
    }
    if (data.hourlyWage4 === "") {
        claimsData.hourlywage4 = 0
    }
    if (data.hourlyWage5 === "") {
        claimsData.hourlywage5 = 0
    }
    if (data.hoursWorked2 === "") {
        claimsData.hoursworked2 = 0
    }
    if (data.hoursWorked3 === "") {
        claimsData.hoursworked3 = 0
    }
    if (data.hoursWorked4 === "") {
        claimsData.hoursworked4 = 0
    }
    if (data.hoursWorked5 === "") {
        claimsData.hoursworked5 = 0
    }
    if (data.totalWage2 === 0) {
        claimsData.totalwage2 = 0
    }
    if (data.totalWage3 === 0) {
        claimsData.totalwage3 = 0
    }
    if (data.totalWage4 === 0) {
        claimsData.totalwage4 = 0
    }
    if (data.totalWage5 === 0) {
        claimsData.totalwage5 = 0
    }
    console.log("data to be updated", claimsData)
    const insert = await knex("wage_subsidy_claim_form").where("id", id).update(claimsData)
    return insert
}
