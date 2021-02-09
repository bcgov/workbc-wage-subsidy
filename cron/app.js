const cron = require('node-cron')
const express = require('express')
const spauth = require('node-sp-auth')
const request = require('request-promise')
var {getHaveEmployeeNotSP, getNeedEmployeeNotSP, getClaimNotSP, getHaveEmployeeNotReporting, getNeedEmployeeNotReporting, getClaimNotReporting, updateReporting, updateSavedToSP} = require('./mongo')
var clean = require('./clean')
var listWebURL = process.env.LISTWEBURL || process.env.OPENSHIFT_NODEJS_LISTWEBURL || ""
var listUser = process.env.LISTUSER || process.env.OPENSHIFT_NODEJS_LISTUSER || ""
var listPass = process.env.LISTPASS || process.env.OPENSHIFT_NODEJS_LISTPASS || ""
var listDomain = process.env.LISTDOMAIN || process.env.OPENSHIFT_NODEJS_LISTDOMAIN || ""
var listParty = process.env.LISTPARTY || process.env.OPENSHIFT_NODEJS_LISTPARTY || ""
var listADFS = process.env.LISTADFS || process.env.OPENSHIFT_NODEJS_LISTADFS || ""

app = express();

var spr;

async function saveListClaim(values,ca) {
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
      var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${ca}')/items`
      console.log(l)
      return request.post({
        url: l,
        headers: headers,
        json: true,
        body: {
          "__metadata": {
            "type": `SP.Data.Catchment${ca}ListItem`
          },
          "Title": `Claim - ${values.employerName} - ${values.applicationID}`,
          "CatchmentNo": values.ca,
          "FormType": "claim",
          "ApplicationID" : values.applicationID,
          "PeriodStart1" : values.periodStart1,
          "PeriodStart2": values.periodStart2,
          "IsFinalClaim": values.isFinalClaim === "yes",          
          "OperatingName":values.employerName,
          "EmployerContact":values.employerContact,
          "BusinessAddress1":values.employerAddress1,
          "BusinessAddress2":values.employerAddress2,
          "BusinessCity":values.employerCity,
          "BusinessPostal":values.employerPostal,
          "BusinessPhone":values.employerPhone,
          "EmployeeFirstName":values.employeeFirstName,
          "EmployeeLastName":values.employeeLastName,
          "DateFrom1": typeof values.dateFrom1 !== "undefined" ? new Date(values.dateFrom1) : null,
          "DateFrom2": typeof values.dateFrom2 !== "undefined" ? new Date(values.dateFrom2) : null,
          "DateFrom3": typeof values.dateFrom3 !== "undefined" ? new Date(values.dateFrom3) : null,
          "DateFrom4": typeof values.dateFrom4 !== "undefined" ? new Date(values.dateFrom4) : null,
          "DateFrom5": typeof values.dateFrom5 !== "undefined" ? new Date(values.dateFrom5) : null,
          "DateTo1": typeof values.dateTo1 !== "undefined" ? new Date(values.dateTo1) : null,
          "DateTo2": typeof values.dateTo2 !== "undefined" ? new Date(values.dateTo2) : null,
          "DateTo3": typeof values.dateTo3 !== "undefined" ? new Date(values.dateTo3) : null,
          "DateTo4": typeof values.dateTo4 !== "undefined" ? new Date(values.dateTo4) : null,
          "DateTo5": typeof values.dateTo5 !== "undefined" ? new Date(values.dateTo5) : null,
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
          "ClientIssues":values.clientIssues1,
          "Signatory1": values.signatory1,
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
      if (err.statusCode !== 403){
        console.log(err);
      }
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

async function saveListHaveEmployee(values,email,ca) {
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
      var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${ca}')/items`
      console.log("webURL:")
      console.log(l)
      return request.post({
        url: l,
        headers: headers,
        json: true,
        body: {
          "__metadata": {
            "type": `SP.Data.Catchment${ca}ListItem`
          },
          "Title": `${values.operatingName} - ${values.applicationID}`,
          "CatchmentNo": values.ca,
          "FormType": "wage",
          "ApplicationID" : values.applicationID,
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
          "ParticipantEmail0": email,
          "OperatingName0": values.operatingName0,
          "NumberOfPositions0": values.numberOfPositions0,
          "StartDate0": typeof values.startDate0 !== "undefined" ? new Date(values.startDate0) : null,
          "Hours0": values.hours0,
          "Wage0": values.wage0,
          "Duties0": values.duties0,
          "Skills0": values.skills0,
          "WorkExperience0": values.workExperience0,
          "OperatingName1": values.operationName1,
          "NumberOfPositions1": values.numberOfPositions1,
          "Duties1": values.duties1,
          "Skills1": values.skills1,
          "WorkExperience1": values.workExperience1,
          "StartDate1": typeof values.startDate1 !== "undefined" ? new Date(values.startDate1) : null,
          "Hours1": values.hours1,
          "Wage1": values.wage1,
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
      if (err.statusCode !== 403){
        console.log(err);
      }
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

async function saveListNeedEmployee(values,ca) {
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
      var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${ca}')/items`
      console.log(l)
      return request.post({
        url: l,
        headers: headers,
        json: true,
        body: {
          "__metadata": {
            "type": `SP.Data.Catchment${ca}ListItem`
          },
          "Title": `${values.operatingName} - ${values.applicationID}`,
          "CatchmentNo": values.ca,
          "FormType": "wage",
          "ApplicationID" : values.applicationID,
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
          "NumberOfPositions0": values.numberOfPositions0,
          "StartDate1": typeof values.startDate0 !== "undefined" ? new Date(values.startDate0) : null,
          "Hours0": values.hours0,
          "Wage0": values.wage0,
          "Duties0": values.duties0,
          "Skills0": values.skills0,
          "WorkExperience0": values.workExperience0,
          "OperatingName1": values.operationName1,
          "NumberOfPositions1": values.numberOfPositions1,
          "Duties1": values.duties1,
          "Skills1": values.skills1,
          "WorkExperience1": values.workExperience1,
          "StartDate1": typeof values.startDate1 !== "undefined" ? new Date(values.startDate1) : null,
          "Hours1": values.hours1,
          "Wage1": values.wage1,
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
      if (err.statusCode !== 403){
        console.log(err);
      }
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

cron.schedule('*/3 * * * *', async function() {
    console.log('running a task every 3 minutes');
    //console.log('running a task every 10 seconds');
    spr = spauth.getAuth(listWebURL, {
      username: listUser,
      password: listPass,
      domain: listDomain,
      relyingParty: listParty,
      adfsUrl: listADFS
  })
    
    await getHaveEmployeeNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListHaveEmployee(data,data.position0Email0,data.ca)
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateSavedToSP("HaveEmployee",data._id);
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
    await getNeedEmployeeNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListNeedEmployee(data,data.ca)
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateSavedToSP("NeedEmployee",data._id);
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
    await getClaimNotSP()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListClaim(data,data.ca)
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateSavedToSP("Claim",data._id);
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
    await getClaimNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log("Claims not saved to reporting")
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListClaim(data,"Reporting")
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateReporting("Claim",data._id);
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
    await getHaveEmployeeNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log("Have employee not saved to reporting")
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListHaveEmployee(data,data.position0Email0,"Reporting")
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateReporting("HaveEmployee",data._id);
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
    await getNeedEmployeeNotReporting()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log("Need employee not saved to reporting")
        console.log(results.length)
        for (const data of results){
          clean(data)
          await saveListNeedEmployee(data,"Reporting")
              .then(function(saved){
                console.log("saved")
                console.log(saved)
                // save values to mongo db
                if (saved) {
                  try {
                    updateReporting("NeedEmployee",data._id);
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
});

app.listen(5000);