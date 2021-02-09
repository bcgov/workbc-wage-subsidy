var express = require('express');
var router = express.Router();
const yup = require('yup')
const yupPhone = require('yup-phone')

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var spauth = require('node-sp-auth')
var request = require('request-promise')
var ClaimFormValidationSchema = require('../schemas/ClaimFormValidationSchema');


var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
const { getClaimSubmitted } = require('../utils/confirmationData');
const {saveClaimValues} = require('../utils/mongoOperations');

var claimConfirmationEmail = process.env.CLAIM_CONFIRMATION_EMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_EMAIL || "";
var claimConfirmationBCC = process.env.CLAIM_CONFIRMATION_BCC || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_BCC || "";
var claimListEmail = process.env.CLAIM_LISTEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_LISTEMAIL || "";
var claimNotifyEmail = process.env.CLAIM_NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_NOTIFYEMAIL || "";
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
        var cEmail, cNotifyEmail;
        if (claimConfirmationEmail === ""){
          cEmail = values.ClaimEmail
        } else {
          cEmail = claimConfirmationEmail
        }
        if (claimNotifyEmail === ""){
          cNotifyEmail = caEmails[Number(values.workbcCentre.substring(0,2))]
        } else {
          cNotifyEmail = claimNotifyEmail
        }
        console.log(values.workbcCentre.substring(0,2))
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
      var l = listWebURL + `Apps/WageSubsidy/_api/web/lists/getByTitle('Catchment${values.workbcCentre.substring(0,2)}')/items`
      console.log(l)
      return request.post({
        url: l,
        headers: headers,
        json: true,
        body: {
          "__metadata": {
            "type": `SP.Data.Catchment${values.workbcCentre.substring(0,2)}ListItem`
          },
          "Title": `Claim - ${values.employerName} - ${values._id}`,
          "CatchmentNo": values.workbcCentre.substring(0,2),
          "FormType": "claim",
          "ApplicationID" : values._id,
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
          "DateFrom1":values.dateFrom1,
          "DateFrom2":values.dateFrom2,
          "DateFrom3":values.dateFrom3,
          "DateFrom4":values.dateFrom4,
          "DateFrom5":values.dateFrom5,
          "DateTo1":values.dateTo1,
          "DateTo2":values.dateTo2,
          "DateTo3":values.dateTo3,
          "DateTo4":values.dateTo4,
          "DateTo5":values.dateTo5,
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
          /*
          "FinalHours":Number(values.hoursWorkedTotal1),
          "FinalWage":Number(values.hourlyWageTotal1),
          "FinalTotal":Number(values.totalTotal1),
          */
          "TotalMERCs":Number(values.totalMERCs),
          "ClientIssues":values.clientIssues1,
          "Signatory1": values.signatory1,
          //"OrganizationConsent":values.organizationConsent
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

router.get('/', csrfProtection, (req, res) => {
  var token = req.csrfToken()
  res.cookie('XSRF-TOKEN', token)
  res.send({
    csrfToken: token
  });

})

router.post('/', csrfProtection, async (req, res) => {
  //clean the body
  clean(req.body);
  console.log(req.body)
  console.log(req.body.workbcCentre.substring(0,2))
  ClaimFormValidationSchema.validate(req.body, { abortEarly: false })
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
                  saveClaimValues(value, saved);
                }
                catch (error) {
                  console.log(error);
                }
              })
              .catch(function(e){
                console.log("error")
                console.log(e)
                try {
                  saveClaimValues(value, false);
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