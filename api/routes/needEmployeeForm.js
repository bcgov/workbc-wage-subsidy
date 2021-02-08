var express = require('express');
var router = express.Router();

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var spauth = require('node-sp-auth')
var request = require('request-promise')


var NeedEmployeeValidationSchema = require('../schemas/NeedEmployeeValidationSchema')
var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
var confirmData = require('../utils/confirmationData');
const { getNeedEmployeeSubmitted } = require('../utils/confirmationData');
const {saveNeedEmployeeValues} = require('../utils/mongoOperations');

// env var info here...
var confirmationEmail1 = process.env.CONFIRMATIONONE || process.env.OPENSHIFT_NODEJS_CONFIRMATIONONE || "";
var confirmationBCC = process.env.CONFIRMATIONBCC || process.env.OPENSHIFT_NODEJS_CONFIRMATIONBCC || "";
var listEmail = process.env.LISTEMAIL || process.env.OPENSHIFT_NODEJS_LISTEMAIL || "";
var notifyEmail = process.env.NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_NOTIFYEMAIL || "";
var clientURL = process.env.CLIENTURL || process.env.OPENSHIFT_NODEJS_CLIENTURL || ""
var listWebURL = process.env.LISTWEBURL || process.env.OPENSHIFT_NODEJS_LISTWEBURL || ""
var listUser = process.env.LISTUSER || process.env.OPENSHIFT_NODEJS_LISTUSER || ""
var listPass = process.env.LISTPASS || process.env.OPENSHIFT_NODEJS_LISTPASS || ""
var listDomain = process.env.LISTDOMAIN || process.env.OPENSHIFT_NODEJS_LISTDOMAIN || ""
var listParty = process.env.LISTPARTY || process.env.OPENSHIFT_NODEJS_LISTPARTY || ""
var listADFS = process.env.LISTADFS || process.env.OPENSHIFT_NODEJS_LISTADFS || ""
var caEmails = process.env.CAEMAILS.split(' ')

console.log(caEmails)
console.log(caEmails.length)

var spr = spauth.getAuth(listWebURL, {
  username: listUser,
  password: listPass,
  domain: listDomain,
  relyingParty: listParty,
  adfsUrl: listADFS
})

// send email func
async function sendEmails(values) {
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
          cNotifyEmail = caEmails[Number(values._ca)]
        } else {
          cNotifyEmail = notifyEmail
        }
        console.log(values._ca)
        console.log(cNotifyEmail)
        // send mail with defined transport object
        let message1 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: mailingList,// list of receivers
          bcc: confirmationBCC,
          subject: "Application Confirmation - " + values._id, // Subject line
          html: generateHTMLEmail("Thank you, your application has been received",
            [
              `<b>Application ID: ${values._id}</b>`,
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
          subject: "A Wage Subsidy application has been received - " + values._id, // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: cNotifyEmail,// list of receivers
          bcc: confirmationBCC,
          subject: "A Wage Subsidy application has been received - " + values._id, // Subject line
          html: notification.generateNeedEmployeeNotification(values) // html body
        };

        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending confirmation for " + values._id)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending list notification for " + values._id)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
            console.log("error:", error);
            console.log("Error sending notification for " + values._id)
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

async function saveList(values) {
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
      console.log(headers)
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
          "NumberOfPositions0": values.numberOfPositions0,
          "StartDate0": values.startDate0,
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
          "StartDate1": values.startDate1,
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

// get
router.get('/', csrfProtection, (req, res) => {
  var token = req.csrfToken()
  res.cookie('XSRF-TOKEN', token)
  res.send({
    csrfToken: token
  });
});
// post
router.post('/', csrfProtection, async (req, res) => {
  //clean the body
  //console.log(req.body)
  clean(req.body);
  //console.log(req.body)
  
  NeedEmployeeValidationSchema.validate(req.body, { abortEarly: false })
    .then(async function (value) {
      try {
        await sendEmails(value)
          .then(async function (sent) {
            if (sent){        
              await saveList(value)
                .then(function(saved){
                  console.log("saved")
                  console.log(saved)
                  // save values to mongo db
                  try {
                    saveNeedEmployeeValues(value, saved);
                  }
                  catch (error) {
                    console.log(error);
                  }
                })
                .catch(function(e){
                  console.log("error")
                  console.log(e)
                  try {
                    saveNeedEmployeeValues(value, false);
                  }
                  catch (error) {
                    console.log(error);
                  }
                })
                res.send({
                  ok: "ok"
                })
            } else if (!sent) {
              res.send({
                emailErr: "emailErr"
              })
            }
          }).catch(function (e) {
            console.log(e)
          })
      } catch (error) {
        console.log(error)
      }
      return
    })
    .catch(function (errors) {
      var err = {}
      errors.inner.forEach(e => {
        err[e.path] = e.message
      })
      res.send({
        err
      })
      return
    })
})

  module.exports = router;