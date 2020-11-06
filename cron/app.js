const cron = require('node-cron')
const express = require('express')
var {getHaveEmployeeNotSP, getNeedEmployeeNotSP} = require('./mongo')

var listWebURL = process.env.LISTWEBURL || process.env.OPENSHIFT_NODEJS_LISTWEBURL || ""
var listUser = process.env.LISTUSER || process.env.OPENSHIFT_NODEJS_LISTUSER || ""
var listPass = process.env.LISTPASS || process.env.OPENSHIFT_NODEJS_LISTPASS || ""
var listDomain = process.env.LISTDOMAIN || process.env.OPENSHIFT_NODEJS_LISTDOMAIN || ""
var listParty = process.env.LISTPARTY || process.env.OPENSHIFT_NODEJS_LISTPARTY || ""
var listADFS = process.env.LISTADFS || process.env.OPENSHIFT_NODEJS_LISTADFS || ""

app = express();

var spr = spauth.getAuth(listWebURL, {
    username: listUser,
    password: listPass,
    domain: listDomain,
    relyingParty: listParty,
    adfsUrl: listADFS
})

async function saveList(values, email) {
    try{
      var headers;
    return await spr
    .then(async data => {
        headers = data.headers;
        headers['Accept'] = 'application/json;odata=verbose';
        return headers
    }).then(async response => {
          //return true
          //console.log(response)
          headers = response
          return request.post({
            url: listWebURL + 'Apps/WageSubsidy/_api/contextInfo',
            headers: headers,
            json: true,
          })
      }).then(async response => {
        var digest = response.d.GetContextWebInformation.FormDigestValue
        return digest
      }).then(async response => {
        //console.log(headers)
        headers['X-RequestDigest'] = response
        headers['Content-Type'] = "application/json;odata=verbose"
        var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${values._ca}')/items`
        console.log(l)
        return request.post({
          url: l,
          headers: headers,
          json: true,
          body: {
            "__metadata": {
              "type": `SP.Data.Catchment${values._ca}ListItem`
            },
            "Title": `${values.operatingName} - ${values._id}`,
            "CatchmentNo": values._ca,
            "FormType": "wage",
            "ApplicationID" : values._id,
            "OperatingName":values.operatingName,
            "BusinessNumber": values.businessNumber,
            "BusinessAddress1":values.businessAddress,
            "BusinessCity":values.businessCity,
            "BusinessProvince":values.businessProvince,
            "BusinessPostal":values.businessPostal,
            "BusinessPhone":values.businessPhone,
            "BusinessFax":values.businessFax,
            "BusinessEmail":values.businessEmail,
            "OtherWorkAddress":values.otherWorkAddress,
            "SectorType":values.sectorType,
            "TypeOfIndustry":values.typeOfIndustry,
            "OrganizationSize":values.organizationSize,
            "CewsParticipation":values.cewsParticipation,
            "EmployeeDisplacement":values.employeeDisplacement === "yes",
            "LabourDispute":values.labourDispute === "yes",
            "UnionConcurrence":values.unionConcurrence,
            "LiabilityCoverage":values.liabilityCoverage === "yes",
            "WageSubsidy":values.wageSubsidy === "yes",
            "WSBCCoverage":values.WSBCCoverage === "yes",
            "LawComplianceConsent": values.lawCompliance,
            "OrgEligibilityConsent": values.eligibility,
            "EmployeesClaimed": values.employeesClaimed,
            "WSBCNumber": values.WSBCNumber,
            "ProvinceAlt": values.provinceAlt,
            "PostalAlt": values.postalAlt,
            "OperatingName0": values.operatingName0,
            "OperatingName1": values.operationName1,
            "NumberOfPositions0": values.numberOfPositions0,
            "NumberOfPositions1": values.numberOfPositions1,
            "ParticipantEmail0": email,
            "StartDate0": values.startDate0,
            "StartDate1": values.startDate1,
            "Duties0": values.duties0,
            "Duties1": values.duties1,
            "SignatoryTitle": values.signatoryTitle,
            "Signatory1": values.signatory1,
            "OrganizationConsent": values.organizationConsent
            //"": values.,
          }
        })
      }).then(async response => {
        //item was created
        return true
      })    
      .catch(err => {
        //there was an error in the chan
        //item was not created
        console.log("error in chain")
        //console.log(err);
        console.log(err.statusCode)
        /*
        if (err.statusCode == 403){
          saveList(values)
        }
        */
        return false
      })
    
    //try catch catcher
    } catch (error) {
      console.log(error)
      return false
    }
  }



cron.schedule('*/10 * * * * *', async function() {
    console.log('running a task every 10 seconds');
    await getHaveEmployeeNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
    })
    await getNeedEmployeeNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
    })
    await getClaimNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
    })
    /*
    .then(client => {
        let db = client.db()
        return db
    }).then(db => {
        // add our values to db (they are always new)
            db.collection("HaveEmployee").find({savedToSP: false},function(err, doc){
                console.log(err)
                console.log(doc)
            })
    })
    */
    
});

app.listen(5000);