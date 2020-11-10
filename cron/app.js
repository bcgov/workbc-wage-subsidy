const cron = require('node-cron')
const express = require('express')
const spauth = require('node-sp-auth')
const request = require('request-promise')
var {getHaveEmployeeNotSP, getNeedEmployeeNotSP, getClaimNotReporting, updateClaimReporting} = require('./mongo')

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

async function saveListClaim(values) {
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
      var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${values.ca}')/items`
      console.log(l)
      return request.post({
        url: l,
        headers: headers,
        json: true,
        body: {
          "__metadata": {
            "type": `SP.Data.Catchment${values.ca}ListItem`
          },
          "Title": `Claim - ${values.employerName} - ${values._id}`,
          "CatchmentNo": values.ca,
          "FormType": "claim",
          //"ApplicationID" : values._id,
          "OperatingName":values.employerName,
          "EmployerContact":values.employerContact,
          "BusinessAddress1":values.employerAddress1,
          "BusinessAddress2":values.employerAddress2,
          "BusinessCity":values.employerCity,
          "BusinessPostal":values.employerPostal,
          "BusinessPhone":values.employerPhone,
          "EmployeeFirstName":values.employeeFirstName,
          "EmployeeLastName":values.employeeLastName,
          "DateFrom1": values.dateFrom1 !== '' ? new Date(values.dateFrom1) : null,
          "DateFrom2": values.dateFrom2 !== '' ? new Date(values.dateFrom2) : null,
          "DateFrom3": values.dateFrom3 !== '' ? new Date(values.dateFrom3) : null,
          "DateFrom4": values.dateFrom4 !== '' ? new Date(values.dateFrom4) : null,
          "DateFrom5": values.dateFrom5 !== '' ? new Date(values.dateFrom5) : null,
          "DateTo1": values.dateTo1 !== '' ? new Date(values.dateTo1) : null,
          "DateTo2": values.dateTo2 !== '' ? new Date(values.dateTo2) : null,
          "DateTo3": values.dateTo3 !== '' ? new Date(values.dateTo3) : null,
          "DateTo4": values.dateTo4 !== '' ? new Date(values.dateTo4) : null,
          "DateTo5": values.dateTo5 !== '' ? new Date(values.dateTo5) : null,
          "HoursWorked1":Number(values.hoursWorked1),
          "HoursWorked2":Number(values.hoursWorked2),
          "HoursWorked3":Number(values.hoursWorked3),
          "HoursWorked4":Number(values.hoursWorked4),
          "HoursWorked5":Number(values.hoursWorked5),
          "HourlyWage1":Number(values.hourlyWage1),
          "HourlyWage2":Number(values.hourlyWage2),
          "HourlyWage3":Number(values.hourlyWage3),
          "HourlyWage4":Number(values.hourlyWage4),
          "HourlyWage5":Number(values.hourlyWage5),
          "TotalWage1":Number(values.total1),
          "TotalWage2":Number(values.total2),
          "TotalWage3":Number(values.total3),
          "TotalWage4":Number(values.total4),
          "TotalWage5":Number(values.total5),
          "FinalHours":Number(values.hoursWorkedTotal1),
          "FinalWage":Number(values.hourlyWageTotal1),
          "FinalTotal":Number(values.totalTotal1),
          "TotalMERCs":Number(values.totalMERCs),
          "clientIssues":values.clientIssues1,
          //"OrganizationConsent":values.organizationConsent
          //"": values.,
        }
      })
    }).then(async response => {
      //item was created
      //console.log(response)
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
        var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${values.ca}')/items`
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
            "StartDate0": Date(values.startDate0),
            "StartDate1": Date(values.startDate1),
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
        console.log(response)
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
    /*
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
    await getHaveEmployeeNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
    })
    await getNeedEmployeeNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
    })
    */
    await getClaimNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          await saveListClaim(data)
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateClaimReporting(data._id);
                  }
                  catch (error) {
                    console.log(error);
                  }
                }
              })
              .catch(function(e){
                console.log("error")
                console.log(e)
              })
              
        }
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