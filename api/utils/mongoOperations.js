
const MongoClient = require('mongodb').MongoClient;
const strings = require("./strings");


// Private function to get a working client
function getClient() {
    // i.e: 'mongodb://superuser:password@localhost/test'
    // don't have to do it this way to connect locally 
    // docs @ http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html
    let uri;
    if (!process.env.MONGO_USERNAME  || !process.env.MONGO_PASSWORD){
        uri = `mongodb://${process.env.MONGO_CONNECTION_URI || 'localhost'}/${process.env.MONGO_DB_NAME || 'test'}`;
    } else {
        uri = `mongodb://${process.env.MONGO_USERNAME || "superuser"}:${process.env.MONGO_PASSWORD || "password"}@${process.env.MONGO_CONNECTION_URI || 'localhost'}/${process.env.MONGO_DB_NAME || 'test'}`;
    }

    
    let client = new MongoClient(uri, { useUnifiedTopology: true });
    return client;
}



module.exports = {
    saveHaveEmployeeValues: function (values, email, savedToSP) {
        const client = getClient();
        client.connect().then(mClient => {
            // get a handle on the db
            let db = mClient.db();
            // add our values to db (they are always new)
            db.collection("HaveEmployee").insertOne({
                applicationID       : values._id,// id is provided
                ca                  : strings.orEmpty(values._ca),                                     
                savedToSP           : savedToSP,
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
                signatory1          : strings.orEmpty(values.signatory1),
                signatoryTitle      : strings.orEmpty(values.signatoryTitle),
                organizationConsent : strings.orEmpty(values.organizationConsent),
            });
        });
    },
    saveNeedEmployeeValues: function(values, savedToSP) {
        const client = getClient();
        client.connect().then(mClient => {
            // get a handle on the db
            let db = mClient.db();
            // add our values to db (they are always new)
            db.collection("NeedEmployee").insertOne({
                applicationID       : strings.orEmpty(values._id),
                ca                  : strings.orEmpty(values._ca),
                savedToSP           : savedToSP,
                savedReporting      : false,  // default to false for now
                operatingName       : strings.orEmpty(values.operatingName),
                businessNumber      : strings.orEmpty(values.businessNumber),
                businessAddress     : strings.orEmpty(values.businessAddress),
                businessCity        : strings.orEmpty(values.businessCity),
                businessProvince    : strings.orEmpty(values.businessProvince),
                businessPostal      : strings.orEmpty(values.businessPostal),
                businessEmail       : strings.orEmpty(values.businessEmail),
                businessPhone       : strings.orEmpty(values.businessPhone),
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
                WSBCNumber          : strings.orEmpty(values.WSBCNumber),
                operatingName0      : strings.orEmpty(values.operatingName0),
                numberOfPositions0  : strings.orEmpty(values.numberOfPositions0),
                startDate0          : strings.orEmpty(values.startDate0),
                hours0              : strings.orEmpty(values.hours0),
                wage0               : strings.orEmpty(values.wage0),
                duties0             : strings.orEmpty(values.duties0),
                skills0             : strings.orEmpty(values.skills0),
                operatingName1      : strings.orEmpty(values.operatingName1),
                numberOfPositions1  : strings.orEmpty(values.numberOfPositions1),
                startDate0          : strings.orEmpty(values.startDate0),
                hours1              : strings.orEmpty(values.hours1),
                wage1               : strings.orEmpty(values.wage1),
                duties1             : strings.orEmpty(values.duties1),
                skills1             : strings.orEmpty(values.skills1),
                workExperience1     : strings.orEmpty(values.workExperience1),
                signatory1          : strings.orEmpty(values.signatory1),
                signatoryTitle      : strings.orEmpty(values.signatoryTitle),
                organizationConsent : strings.orEmpty(values.organizationConsent),
            });
        });
    },
    saveClaimValues: function(values, savedToSP) {
        const client = getClient();
        client.connect().then(mClient => {
            // get a handle on the db
            let db = mClient.db();
            // add our values to db (they are always new)
            db.collection("Claim").insertOne({
                applicationID    : strings.orEmpty(values._id),
                ca               : strings.orEmpty(values.workbcCentre.substring(0,2)), 
                savedToSP        : savedToSP,
                savedReporting   : false,  // default to false for now
                periodStart1     : strings.orEmpty(values.periodStart1),
                periodStart2     : strings.orEmpty(values.periodStart2),
                isFinalClaim     : strings.orEmpty(values.isFinalClaim),
                employerName     : strings.orEmpty(values.employerName),
                employerPhone    : strings.orEmpty(values.employerPhone),
                employerAddress1 : strings.orEmpty(values.employerAddress1),
                employerAddress2 : strings.orEmpty(values.employerAddress2),
                employerCity     : strings.orEmpty(values.employerCity),
                employerPostal   : strings.orEmpty(values.employerPostal),
                employeeFirstName: strings.orEmpty(values.employeeFirstName),
                employeeLastName : strings.orEmpty(values.employeeLastName),
                dateFrom1        : strings.orEmpty(values.dateFrom1),
                dateTo1          : strings.orEmpty(values.dateTo1),
                hoursWorked1     : strings.orEmpty(values.hoursWorked1),
                hourlyWage1      : strings.orEmpty(values.hourlyWage1),
                total1           : strings.orEmpty(values.total1),
                dateFrom2        : strings.orEmpty(values.dateFrom2),
                dateTo2          : strings.orEmpty(values.dateTo2),
                hoursWorked2     : strings.orEmpty(values.hoursWorked2),
                hourlyWage2      : strings.orEmpty(values.hourlyWage2),
                total2           : strings.orEmpty(values.total2),
                dateFrom3        : strings.orEmpty(values.dateFrom3),
                dateTo3          : strings.orEmpty(values.dateTo3),
                hoursWorked3     : strings.orEmpty(values.hoursWorked3),
                hourlyWage3      : strings.orEmpty(values.hourlyWage3),
                total3           : strings.orEmpty(values.total3),
                dateFrom4        : strings.orEmpty(values.dateFrom4),
                dateTo4          : strings.orEmpty(values.dateTo4),
                hoursWorked4     : strings.orEmpty(values.hoursWorked4),
                hourlyWage4      : strings.orEmpty(values.hourlyWage4),
                total4           : strings.orEmpty(values.total4),
                dateFrom5        : strings.orEmpty(values.dateFrom5),
                dateTo5          : strings.orEmpty(values.dateTo5),
                hoursWorked5     : strings.orEmpty(values.hoursWorked5),
                hourlyWage5      : strings.orEmpty(values.hourlyWage5),
                total5           : strings.orEmpty(values.total5),
                hoursWorkedTotal1: strings.orEmpty(values.hoursWorkedTotal1),
                hourlyWageTotal1 : strings.orEmpty(values.hourlyWageTotal1),
                totalTotal1      : strings.orEmpty(values.totalTotal1),
                totalMERCs       : strings.orEmpty(values.totalMERCs),
                clientIssues1    : strings.orEmpty(values.clientIssues1),
                signatory1       : strings.orEmpty(values.signatory1)
            });
        });
    },
    printValues: function(collection) {
        const client = getClient();
        client.connect().then(mc => {
            const db = mc.db("test");
            let cursor = db.collection(collection).find({});

            const iterateFunc = doc => console.log(JSON.stringify(doc, null, 4));
            const errorFunc = error => console.log(error);
            
            cursor.forEach(iterateFunc, errorFunc);
        });
    }
};