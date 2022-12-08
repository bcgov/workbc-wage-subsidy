/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

export const getAllWage = async (perPage: number, currPage: number, filters: any, sort: any, user: string) => {
    const claims = await knex("wage_subsidy_applications")
        .modify((queryBuilder: any) => {
            if (filters.applicationstatus) {
                queryBuilder.whereIn("applicationstatus", filters.applicationstatus)
            }
            if (filters.catchmentno) {
                queryBuilder.where("catchmentno", Number(filters.catchmentno))
            }
            if (user) {
                queryBuilder.where("createdbyguid", user)
            }
            if (sort) {
                queryBuilder.orderBy(sort[0], sort[1])
            }
        })
        .paginate({ perPage, currentPage: currPage })
    return claims
}

export const getWageByCatchment = async (ca: number[]) => {
    const claims = await knex("wage_subsidy_applications").where((builder: any) => builder.whereIn("catchmentno", ca))
    return claims
}

export const insertWage = async (id: string, user: string, formType: string, userGuid: string) => {
    const data = {
        internalid: id,
        // user: user
        created: new Date(),
        formtype: formType,
        createdby: user,
        createdbyguid: userGuid
    }
    const result = await knex("wage_subsidy_applications").insert(data)
    console.log(result)
    return result
}

export const updateWage = async (id: number, confirmationId: string, submissionId: string, status: string) => {
    const result = await knex("wage_subsidy_applications").where("id", id).update({
        confirmationid: confirmationId,
        applicationid: submissionId,
        status
    })
    console.log(result)
}

export const updateWageData = async (body: any, id: number) => {
    // Insert into wage table
    const data = body
    console.log(data)
    Object.keys(data).forEach((e) => {
        console.log(data[e])
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
    console.log(data)
    const insertData = {
        // title: `${data.operatingName} - ${data.applicationId}`,
        catchmentno: data.catchmentNo,
        // formtype: "wage",
        // applicationid: data.applicationId,
        // applicationstatus: "NULL",
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
        participantemail0: data.participantEmail0,
        participantemail1: null,
        participantemail2: null,
        participantemail3: null,
        participantemail4: null,
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
        wage1: data.position2.wage1 ? Math.round(100 * parseFloat(data.wage1)) : null,
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
        status: "submitted"
        // internalid: data.internalId
        // modified: new Date(),
        // created: new Date()
    }

    /*
    for (let i = 0; i < pins.length; i += 1) {
        for (let j = 0; i < pins[i].Storefronts.length; j += 1) {
            if (i === data.storefrontId && j === data.catchmentNo) {
                insertData.centrename = pins[i].Storefronts[j].name
            }
        }
    }
    */

    if (data.numberOfPositions0 === 5) {
        insertData.participantemail1 = data.participantEmail1
        insertData.participantemail2 = data.participantEmail2
        insertData.participantemail3 = data.participantEmail3
        insertData.participantemail4 = data.participantEmail4
    } else if (data.numberOfPositions0 === 4) {
        insertData.participantemail1 = data.participantEmail1
        insertData.participantemail2 = data.participantEmail2
        insertData.participantemail3 = data.participantEmail3
        if (data.position2.numberOfPositions1 === 1) {
            insertData.participantemail4 = data.position2.participantEmail0
        }
    } else if (data.numberOfPositions0 === 3) {
        insertData.participantemail1 = data.participantEmail1
        insertData.participantemail2 = data.participantEmail2
        if (data.position2.numberOfPositions1 === 2) {
            insertData.participantemail3 = data.position2.participantEmail0
            insertData.participantemail4 = data.position2.participantEmail1
        } else if (data.position2.numberOfPositions1 === 1) {
            insertData.participantemail3 = data.position2.participantEmail0
        }
    } else if (data.numberOfPositions0 === 2) {
        insertData.participantemail1 = data.participantEmail1
        if (data.position2.numberOfPositions1 === 3) {
            insertData.participantemail2 = data.position2.participantEmail0
            insertData.participantemail3 = data.position2.participantEmail1
            insertData.participantemail4 = data.position2.participantEmail2
        } else if (data.position2.numberOfPositions1 === 2) {
            insertData.participantemail2 = data.position2.participantEmail0
            insertData.participantemail2 = data.position2.participantEmail1
        } else if (data.position2.numberOfPositions1 === 1) {
            insertData.participantemail2 = data.position2.participantEmail0
        }
    } else if (data.position2.numberOfPositions1 === 4) {
        insertData.participantemail1 = data.position2.participantEmail0
        insertData.participantemail2 = data.position2.participantEmail1
        insertData.participantemail3 = data.position2.participantEmail2
        insertData.participantemail4 = data.position2.participantEmail3
    } else if (data.position2.numberOfPositions1 === 3) {
        insertData.participantemail1 = data.position2.participantEmail0
        insertData.participantemail2 = data.position2.participantEmail1
        insertData.participantemail3 = data.position2.participantEmail2
    } else if (data.position2.numberOfPositions1 === 2) {
        insertData.participantemail1 = data.position2.participantEmail0
        insertData.participantemail2 = data.position2.participantEmail1
    } else if (data.position2.numberOfPositions1 === 1) {
        insertData.participantemail1 = data.position2.participantEmail0
    }
    const insert = await knex("wage_subsidy_applications").where("id", id).update(insertData)
    return insert
}
