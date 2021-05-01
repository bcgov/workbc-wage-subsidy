const cron = require('node-cron')
const express = require('express')
const spauth = require('node-sp-auth')
const request = require('request-promise')
var nodemailer = require("nodemailer");
var {getHaveEmployeeNotSP, getNeedEmployeeNotSP, getClaimNotSP, getHaveEmployeeNotReporting, getNeedEmployeeNotReporting, getClaimNotReporting, updateReporting, updateSavedToSP, getClaimNoEmail, getNeedEmployeeNoEmail, getHaveEmployeeNoEmail, updateEmailSent} = require('./mongo')
var clean = require('./clean')
var generateHTMLEmail = require('./utils/htmlEmail')
var notification = require('./utils/applicationReceivedEmail');
const { getHaveEmployeeSubmitted, getNeedEmployeeSubmitted } = require('./utils/confirmationData');

var listWebURL = process.env.LISTWEBURL || process.env.OPENSHIFT_NODEJS_LISTWEBURL || ""
var listUser = process.env.LISTUSER || process.env.OPENSHIFT_NODEJS_LISTUSER || ""
var listPass = process.env.LISTPASS || process.env.OPENSHIFT_NODEJS_LISTPASS || ""
var listDomain = process.env.LISTDOMAIN || process.env.OPENSHIFT_NODEJS_LISTDOMAIN || ""
var listParty = process.env.LISTPARTY || process.env.OPENSHIFT_NODEJS_LISTPARTY || ""
var listADFS = process.env.LISTADFS || process.env.OPENSHIFT_NODEJS_LISTADFS || ""

var confirmationEmail1 = process.env.CONFIRMATIONONE || process.env.OPENSHIFT_NODEJS_CONFIRMATIONONE || "";
var confirmationBCC = process.env.CONFIRMATIONBCC || process.env.OPENSHIFT_NODEJS_CONFIRMATIONBCC || "";
var pEmail = process.env.PARTICIPANTEMAIL || process.env.OPENSHIFT_NODEJS_PARTICIPANTEMAIL || "";
var listEmail = process.env.LISTEMAIL || process.env.OPENSHIFT_NODEJS_LISTEMAIL || "";
var clientURL = process.env.CLIENTURL || process.env.OPENSHIFT_NODEJS_CLIENTURL || ""
var notifyEmail = process.env.NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_NOTIFYEMAIL || "";
var caEmails = process.env.CAEMAILS.split(' ')
var claimConfirmationEmail = process.env.CLAIM_CONFIRMATION_EMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_EMAIL || "";
var claimConfirmationBCC = process.env.CLAIM_CONFIRMATION_BCC || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_BCC || "";
var claimListEmail = process.env.CLAIM_LISTEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_LISTEMAIL || "";
var claimNotifyEmail = process.env.CLAIM_NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_NOTIFYEMAIL || "";

console.log(caEmails)
console.log(caEmails.length)

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

async function sendEmailsClaim(values) {
  try {
    let transporter = nodemailer.createTransport({
      host: "apps.smtp.gov.bc.ca",
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      } // true for 465, false for other ports
    });
    return await transporter.verify()
      .then(function (r) {
        //console.log(r)
        console.log("Transporter connected.")
        var cEmail, cNotifyEmail;
        if (claimConfirmationEmail === "") {
          cEmail = values.ClaimEmail
        } else {
          cEmail = claimConfirmationEmail
        }
        if (claimNotifyEmail === "") {
          cNotifyEmail = caEmails[Number(values.ca)]
        } else {
          cNotifyEmail = claimNotifyEmail
        }
        console.log(values.ca)
        console.log(cNotifyEmail)
        // send mail with defined transport object
        /*
        let message1 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: cEmail,// list of receivers
          bcc: claimConfirmationBCC,
          subject: "Application Confirmation - ", // Subject line
          html: generateHTMLEmail("Thank you, your application has been received", 
            ["Thank you your application has been received", "The following information was received:"],  
            [],
            getClaimSubmitted(values)) // html body
        };
        */
        let message2 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: claimListEmail,// list of receivers
          subject: "A Wage Subsidy Claim application has been received", // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: cNotifyEmail,// list of receivers
          bcc: claimConfirmationBCC,
          subject: "A Wage Subsidy Claim application has been received", // Subject line
          html: notification.generateClaimNotification(values) // html body
        };
        /*
        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            return "An error occurred while submitting the form, please try again. If the error persists please try again later.";
          } else {
            console.log("Message sent: %s", info.messageId);
            return "success"
          }
        });
        */
        let info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            console.log("Error sending")
          } else {
            console.log("Message sent: %s", info.messageId);
            return "success"
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
            console.log("Error sending")
          } else {
            console.log("Message sent: %s", info.messageId);
            return "success"
          }
        });
        return true
      }).catch(function (e) {
        console.log(e)
        console.log("Error connecting to transporter")
        return false
      })
  } catch (error) {
    console.log(error)
  }
}

async function sendEmailsHaveEmployee(values) {
  try {
    let transporter = nodemailer.createTransport({
      host: "apps.smtp.gov.bc.ca",
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      } // true for 465, false for other ports
    });
    return await transporter.verify()
      .then(function (r) {
        //console.log(r)
        console.log("Transporter connected.")
        // send mail with defined transport object
        var mailingList;
        if (confirmationEmail1 !== "") {
          mailingList = confirmationEmail1
        } else {
          mailingList = values.businessEmail
        }
        var positionEmails;
        if (pEmail === "") {
          positionEmails = [values.position0Email0, values.position0Email1, values.position0Email2,
          values.position0Email3, values.position0Email4, values.position1Email0, values.position1Email1, values.position1Email2, values.position1Email3, confirmationBCC].filter(e => e != null);
        } else {
          positionEmails = pEmail
        }
        console.log(positionEmails)
        var cNotifyEmail;
        if (notifyEmail === "") {
          cNotifyEmail = caEmails[Number(values.ca)]
        } else {
          cNotifyEmail = notifyEmail
        }
        console.log(values.ca)
        console.log(cNotifyEmail)
        // filter out empty addresses
        // send mail with defined transport object
        let message1 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: mailingList,// list of receivers
          bcc: confirmationBCC,
          subject: "Application Confirmation - " + values.applicationID, // Subject line
          html: generateHTMLEmail("Thank you, your application has been received",
            [
              `<b>Application ID: ${values.applicationID}</b>`,
              `Thank you for your interest in WorkBC Wage Subsidy services. Your application has been received and a WorkBC staff member will be in touch with you soon to confirm your business qualifies for WorkBC Wage Subsidy and to complete the application process. `,
            ],
            [
            ],
            getHaveEmployeeSubmitted(values)
          ) // html body
        };
        let message2 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: listEmail,// list of receivers
          subject: "A Wage Subsidy application has been received - " + values.applicationID, // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: cNotifyEmail,// list of receivers
          bcc: confirmationBCC,
          subject: "A Wage Subsidy application has been received - " + values.applicationID, // Subject line
          html: notification.generateHaveEmployeeNotification(values) // html body
        };
        let message4 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          bcc: positionEmails,// list of receivers
          subject: "WorkBC Wage Subsidy Application - Next Steps", // Subject line
          html: generateHTMLEmail("WorkBC Wage Subsidy Application - Next Steps",
            [
              `Hello,`,
              `You’re receiving this email because your future employer recently applied for a WorkBC Wage Subsidy.`,
              `WorkBC is a provincial government service that helps residents of B.C. improve their skills, explore career options, and find employment.`,
            ],
            [
              `Only a few steps remain before you are back at work.`,
              `If you are participating in WorkBC Services, contact your Employment Counsellor right away, before taking the steps below.`,
              `If you are NOT already participating in WorkBC Services, please follow these steps:`,
              `<b>Step 1:</b> Register for Online Employment Services.`,
              `<b>Step 2:</b> Complete an online application. Click <a href="https://apply.workbc.ca/">here</a> to get started and ensure you <b>select WorkBC Self-Serve<b> to begin your application.`,
              `<img class="img-fluid" src="${clientURL}/images/workbc_self_serve.png" alt="WorkBC Self Serve Option" style="height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;">`,
              `When selecting your WorkBC Centre, select the community where your job is located.`,
              `<img class="img-fluid" src="${clientURL}/images/workbc_community_select.png" alt="WorkBC Community Selector" style="height: auto; line-height: 100%; outline: none; text-decoration: none; width: 100%; max-width: 100%; border: 0 none;">`,
              `<b>Step 3:</b> Let your employer know you have applied! A team member will be in touch soon.`,
            ],
            [
              `<b>Why use WorkBC?</b></p><p>
              <ul>
                <li>
                  <b>Expertise: </b>We're ready to help you start career planning now or get you ready for the next phase of BC's COVID-19 Restart Plan.</li>
                <li>
                  <b>Free Services: </b>We offer skills training and personalized, one-on-one job counselling. WorkBC services are completely free.</li>
                <li>
                  <b>Benefits: </b>You might also be eligible for exclusive benefits.</li>
              </ul>
              `,
              `Sincerely,<br><b>Your WorkBC team<br></b>`
            ]
          ) // html body
        };
        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending confirmation for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending list notification for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
            console.log("error:", error);

            console.log("Error sending notification for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message4, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending position email(s) for " + values.applicationID);
          } else {
            1
            console.log("Message sent: %s", info.messageId);
          }
        });
        return true
      }).catch(function (e) {
        console.log(e)
        console.log("Error connecting to transporter")
        return false
      })
  } catch (error) {
    console.log(error)
    return false
  }
}

async function sendEmailsNeedEmployee(values) {
  try {
    let transporter = nodemailer.createTransport({
      host: "apps.smtp.gov.bc.ca",
      port: 25,
      secure: false,
      tls: {
        rejectUnauthorized: false
      } // true for 465, false for other ports
    });
    return await transporter.verify()
      .then(function (r) {
        //console.log(r)
        console.log("Transporter connected.")
        // send mail with defined transport object
        var mailingList;
        if (confirmationEmail1 !== "") {
          mailingList = confirmationEmail1
        } else {
          mailingList = values.businessEmail
        }
        var cNotifyEmail;
        if (notifyEmail === ""){
          cNotifyEmail = caEmails[Number(values.ca)]
        } else {
          cNotifyEmail = notifyEmail
        }
        console.log(values.ca)
        console.log(cNotifyEmail)
        // send mail with defined transport object
        let message1 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: mailingList,// list of receivers
          bcc: confirmationBCC,
          subject: "Application Confirmation - " + values.applicationID, // Subject line
          html: generateHTMLEmail("Thank you, your application has been received",
            [
              `<b>Application ID: ${values.applicationID}</b>`,
              `Thank you for your interest in WorkBC Wage Subsidy services. Your application has been received and a WorkBC staff member will be in touch with you soon to confirm your business qualifies for WorkBC Wage Subsidy and to complete the application process. `,
            ],
            [
            ],
            getNeedEmployeeSubmitted(values)
          ) // html body
        };
        let message2 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: listEmail,// list of receivers
          subject: "A Wage Subsidy application has been received - " + values.applicationID, // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: cNotifyEmail,// list of receivers
          bcc: confirmationBCC,
          subject: "A Wage Subsidy application has been received - " + values.applicationID, // Subject line
          html: notification.generateNeedEmployeeNotification(values) // html body
        };

        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending confirmation for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending list notification for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending notification for " + values.applicationID)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });

        return true
      }).catch(function (e) {
        console.log(e)
        console.log("Error connecting to transporter")
        return false
      })
  } catch (error) {
    console.log(error)
    return false
  }
}

cron.schedule('*/1 * * * *', async function() {
    console.log('running a task every 3 minutes');
    //console.log('running a task every 10 seconds');
    /*
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
    */
    await getHaveEmployeeNoEmail()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await sendEmailsHaveEmployee(data)
              .then(function(sent){
                console.log("email")
                console.log(sent)
                // save values to mongo db
                if (sent) {
                  try {
                    updateEmailSent("HaveEmployee",data._id);
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
    await getNeedEmployeeNoEmail()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await sendEmailsNeedEmployee(data)
              .then(function(sent){
                console.log("email")
                console.log(sent)
                // save values to mongo db
                if (sent) {
                  try {
                    updateEmailSent("NeedEmployee",data._id);
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
    await getClaimNoEmail()
    .then(async cursor => {
        var results = await cursor.toArray()
        console.log(results.length)
        for (const data of results){
          clean(data)
          await sendEmailsClaim(data)
              .then(function(sent){
                console.log("email")
                console.log(sent)
                // save values to mongo db
                if (sent) {
                  try {
                    updateEmailSent("Claim",data._id);
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