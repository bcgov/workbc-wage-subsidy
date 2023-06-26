/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllWage = async (perPage: number, currPage: number, filters: any, sort: any, user: string) => {
    const claims = await knex("wage_subsidy_applications")
        .modify((queryBuilder: any) => {
            if (filters.applicationstatus) {
                queryBuilder.where("applicationstatus", filters.applicationstatus)
            }
            if (filters.status) {
                queryBuilder.where("status", filters.status)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (filters.id) {
                queryBuilder.where("id", Number(filters.id))
            }
            if (user) {
                queryBuilder.whereLike("createdby", user).orWhereLike("sharedwith", `%${user}%`)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage, isLengthAware: true })
    return claims
}

export const getWageByCatchment = async (ca: number[]) => {
    const claims = await knex("wage_subsidy_applications").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const getWageByID = async (id: string) => {
    const wages = await knex("wage_subsidy_applications").where((builder: any) => builder.where("id", id))
    return wages[0]
}

export const insertWage = async (id: string, user: string, formType: string, userGuid: string) => {
    const data = {
        internalid: id,
        created: new Date(),
        formtype: formType,
        createdby: user,
        createdbyguid: userGuid,
        sharedwith: "",
        status: "not submitted"
    }
    const result = await knex("wage_subsidy_applications").insert(data)
    return result
}

export const updateWage = async (
    id: number,
    confirmationId: string,
    submissionId: string,
    status: string,
    data: any
) => {
    const wages = await knex("wage_subsidy_applications").where("id", id)
    if (wages.length === 0) {
        return 0
    }
    if (data) {
        const result = await knex("wage_subsidy_applications").where("id", id).update(data)
        return result
    }
    const result = await knex("wage_subsidy_applications").where("id", id).update({
        confirmationid: confirmationId,
        applicationid: submissionId,
        status
    })
    return result
}

export const deleteWage = async (id: number) => {
    const result = await knex("wage_subsidy_applications").where("id", id).del()
    return result
}

// Only gets called on submitted status
export const updateWageData = async (body: any, id: number) => {
    // Insert into wage table
    const data = body
    Object.keys(data).forEach((e) => {
        if (data[e] === "") {
            data[e] = null
        } else if (e === "position2") {
            Object.keys(data[e]).forEach((p) => {
                if (data[e][p] === "") {
                    data[e][p] = null
                }
            })
        }
    })
    const wage = await knex("wage_subsidy_applications").where("id", id)
    const insertData = {
        title: `${data.operatingName} - ${data.confirmationId}`,
        catchmentno: data.catchmentNo,
        applicationid: data.submissionId,
        confirmationid: data.confirmationId,
        applicationstatus: "New",
        operatingname: data.operatingName,
        businessnumber: data.businessNumber,
        businessaddress1: data.businessAddress,
        businesscity: data.businessCity,
        businessprovince: data.businessProvince,
        businesspostal: data.businessPostal,
        businessphone: data.businessPhone,
        businessfax: data.businessFax,
        businessemail: data.businessEmail,
        otherworkaddress: data.otherWorkAddress,
        sectortype: data.sectorType,
        typeofindustry: data.typeOfIndustry,
        organizationsize: data.organizationSize,
        cewsandorcrhp: data.CEWSAndOrCRHP,
        employeedisplacement: data.employeeDisplacement,
        labourdispute: data.labourDispute,
        unionconcurrence: data.unionConcurrence,
        liabilitycoverage: data.liabilityCoverage,
        wagesubsidy: data.wageSubsidy,
        wsbccoverage: data.WSBCCoverage,
        lawcomplianceconsent: data.lawComplianceConsent,
        orgeligibilityconsent: data.orgEligibilityConsent,
        wsbcnumber: data.WSBCNumber,
        addressalt: data.addressAlt,
        cityalt: data.cityAlt,
        provincealt: data.provinceAlt,
        postalalt: data.postalAlt,
        participantemail0: `${data.employeeEmail0 ? data.employeeEmail0 : ""};${
            data.position2.employeeEmail0 !== undefined ? data.position2.employeeEmail0 : ""
        }`,
        participantemail1: `${data.employeeEmail1 ? data.employeeEmail1 : ""};${
            data.position2.employeeEmail1 !== undefined ? data.position2.employeeEmail1 : ""
        }`,
        participantemail2: `${data.employeeEmail2 ? data.employeeEmail2 : ""};${
            data.position2.employeeEmail2 !== undefined ? data.position2.employeeEmail2 : ""
        }`,
        participantemail3: `${data.employeeEmail3 ? data.employeeEmail3 : ""};${
            data.position2.employeeEmail3 !== undefined ? data.position2.employeeEmail3 : ""
        }`,
        participantemail4: `${data.employeeEmail4 ? data.employeeEmail4 : ""};${
            data.position2.employeeEmail4 !== undefined ? data.position2.employeeEmail4 : ""
        }`,
        positiontitle0: data.positionTitle0,
        numberofpositions0: data.numberOfPositions0,
        startdate0: data.startDate0,
        hours0: data.hours0,
        wage0: Math.round(100 * parseFloat(data.wage0)),
        applicationmercs0: data.applicationMERCs0,
        duties0: data.duties0,
        skills0: data.skills0,
        workexperience0: data.workExperience0,
        positiontitle1: data.position2.positionTitle1,
        numberofpositions1: data.position2.numberOfPositions1,
        startdate1: data.startDate1,
        hours1: data.position2.hours1,
        wage1: data.position2.wage1 ? Math.round(100 * parseFloat(data.position2.wage1)) : 0,
        applicationmercs1: data.position2.applicationMERCs1,
        duties1: data.position2.duties1,
        skills1: data.position2.skills1,
        workexperience1: data.position2.workExperience1,
        signatorytitle: data.signatoryTitle,
        signatory1: data.signatory1,
        organizationconsent: data.organizationConsent,
        // history:
        sf: data.storefrontId,
        centrename: "",
        markedfordeletion: false,
        status: "submitted",
        history: {
            history: [
                { changes: { applicationstatus: "New" }, date: wage[0].created, by: `bceid:${wage[0].createdby}` }
            ]
        }
    }
    const insert = await knex("wage_subsidy_applications").where("id", id).update(insertData)
    return insert
}
