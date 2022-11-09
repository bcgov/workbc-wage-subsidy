/* eslint-disable import/prefer-default-export */
import { knex } from "../config/db-config"

/** 
    @param data formio/chefs data
    @param user user information jwt or username
    @returns result of insert
*/
export const insertWage = async (data: any, user: any) => {
    // Insert into wage table
    const insertData = {
        // title: `${data.operatingName} - ${data.applicationId}`,
        catchmentno: data.catchmentNo,
        formtype: "wage",
        // applicationid: data.applicationId,
        applicationstatus: "NULL",
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
        wage0: data.wage0,
        applicationmercs0: data.applicationMERCs0,
        duties0: data.duties0,
        skills0: data.skills0,
        workexperience0: data.workExperience0,
        positiontitle1: data.positionTitle1,
        numberofpositions1: data.numberOfPositions1,
        startdate1: data.startDate1,
        hours1: data.hours1,
        wage1: data.wage1,
        applicationmercs1: data.applicationMERCs1,
        duties1: data.duties1,
        skills1: data.skills1,
        workexperience1: data.workExperience1,
        signatorytitle: data.signatoryTitle,
        signatory1: data.signatory1,
        organizationconsent: data.organizationConsent,
        // history:
        // sf: data.storefrontId,
        // centrename:
        markedfordeletion: false
        // modified:
        // created:
    }
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
    const insert = await knex("wage_subsidy_applications").insert(insertData)
    return insert
}
