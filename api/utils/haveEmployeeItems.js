const strings = require("./strings");

function createHaveEmployeeItems(emails, values){
    var items = []
    for (const email of emails){
        items.push({
            applicationID       : values._id,// id is provided
            ca                  : strings.orEmpty(values._ca),                                     
            savedToSP           : false,
            savedReporting      : false,  // default to false for now
            operatingName       : strings.orEmpty(values.operatingName),
            businessNumber      : strings.orEmpty(values.businessNumber),
            businessAddress     : strings.orEmpty(values.businessAddress),
            businessCity        : strings.orEmpty(values.businessCity),
            businessProvince    : strings.orEmpty(values.businessProvince),
            businessPostal      : strings.orEmpty(values.businessPostal),
            businessEmail       : strings.orEmpty(values.businessEmail),
            businessPhone       : strings.orEmpty(values.businessPhone),
            businessFax         : strings.orEmpty(values.businessFax),
            addressAlt          : strings.orEmpty(values.addressAlt),
            cityAlt             : strings.orEmpty(values.cityAlt),
            provinceAlt         : strings.orEmpty(values.provinceAlt),
            postalAlt           : strings.orEmpty(values.postalAlt),
            sectorType          : strings.orEmpty(values.sectorType),
            typeOfIndustry      : strings.orEmpty(values.typeOfIndustry),
            organizationSize    : strings.orEmpty(values.organizationSize),
            cewsParticipation   : strings.orEmpty(values.cewsParticipation),
            employeeDisplacement: strings.orEmpty(values.employeeDisplacement),
            labourDispute       : strings.orEmpty(values.labourDispute),
            unionConcurrence    : strings.orEmpty(values.unionConcurrence),
            liabilityCoverage   : strings.orEmpty(values.liabilityCoverage),
            wageSubsidy         : strings.orEmpty(values.wageSubsidy),
            eligibility         : strings.orEmpty(values.eligibility),
            lawCompliance       : strings.orEmpty(values.lawCompliance),
            WSBCNumber          : strings.orEmpty(values.WSBCNumber),
            operatingName0      : strings.orEmpty(values.operatingName0),
            numberOfPositions0  : strings.orEmpty(values.numberOfPositions0),
            position0Email0     : strings.orEmpty(email),
            position0Email1     : strings.orEmpty(values.position0Email1),
            position0Email2     : strings.orEmpty(values.position0Email2),
            position0Email3     : strings.orEmpty(values.position0Email3),
            position0Email4     : strings.orEmpty(values.position0Email4),
            startDate0          : strings.orEmpty(values.startDate0),
            hours0              : strings.orEmpty(values.hours0),
            wage0               : strings.orEmpty(values.wage0),
            duties0             : strings.orEmpty(values.duties0),
            skills0             : strings.orEmpty(values.skills0),
            workExperience0     : strings.orEmpty(values.workExperience0),
            operatingName1      : strings.orEmpty(values.operatingName1),
            numberOfPositions1  : strings.orEmpty(values.numberOfPositions1),
            position1Email0     : strings.orEmpty(values.position1Email0),
            position1Email1     : strings.orEmpty(values.position1Email1),
            position1Email2     : strings.orEmpty(values.position1Email2),
            position1Email3     : strings.orEmpty(values.position1Email3),
            startDate1          : strings.orEmpty(values.startDate1),
            hours1              : strings.orEmpty(values.hours1),
            wage1               : strings.orEmpty(values.wage1),
            duties1             : strings.orEmpty(values.duties1),
            skills1             : strings.orEmpty(values.skills1),
            workExperience1     : strings.orEmpty(values.workExperience1),
            signatory1          : strings.orEmpty(values.signatory1),
            signatoryTitle      : strings.orEmpty(values.signatoryTitle),
            organizationConsent : strings.orEmpty(values.organizationConsent),
            applicationMERCs0   : strings.orEmpty(values.applicationMERCs0),
            applicationMERCs1   : strings.orEmpty(values.applicationMERCs1),            
        })
    }
    return items
}

module.exports = createHaveEmployeeItems