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


var HaveEmployeeValidationSchema = require('../schemas/HaveEmployeeValidationSchema')
var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
var confirmData = require('../utils/confirmationData');
const { getHaveEmployeeSubmitted } = require('../utils/confirmationData');
var {saveHaveEmployeeValues} = require("../utils/mongoOperations");

var confirmationEmail1 = process.env.CONFIRMATIONONE || process.env.OPENSHIFT_NODEJS_CONFIRMATIONONE || "";
var confirmationBCC = process.env.CONFIRMATIONBCC || process.env.OPENSHIFT_NODEJS_CONFIRMATIONBCC || "";
var pEmail = process.env.PARTICIPANTEMAIL || process.env.OPENSHIFT_NODEJS_PARTICIPANTEMAIL || "";
var listEmail = process.env.LISTEMAIL || process.env.OPENSHIFT_NODEJS_LISTEMAIL || "";
var clientURL = process.env.CLIENTURL || process.env.OPENSHIFT_NODEJS_CLIENTURL || ""
var notifyEmail = process.env.NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_NOTIFYEMAIL || "";
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
        // send mail with defined transport object
        var mailingList;
        if (confirmationEmail1 !== "") {
          mailingList = confirmationEmail1
        } else {
          mailingList = values.businessEmail
        }
        var positionEmails;
        if (pEmail === ""){
          positionEmails = [values.position0Email0, values.position0Email1, values.position0Email2, 
            values.position0Email3, values.position0Email4, values.position1Email0, values.position1Email1, values.position1Email2,values.position1Email3].filter(e => e != null);
        } else {
          positionEmails = pEmail
        }
        console.log(positionEmails)
        var cNotifyEmail;
        if (notifyEmail === ""){
          cNotifyEmail = caEmails[Number(values._ca)]
        } else {
          cNotifyEmail = notifyEmail
        }
        console.log(values._ca)
        console.log(cNotifyEmail)
             // filter out empty addresses
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
            getHaveEmployeeSubmitted(values)
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
        info = transporter.sendMail(message4, (error, info) => {
          if (error) {
            console.log ("error:", error);
            console.log("Error sending position email(s) for " + values._id);
          } else {1
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
      console.log("webURL:")
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
          "ParticipantEmail0": email,
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

router.get('/', csrfProtection, (req, res) => {
  //saveList()
  /*
  console.log(process.env)
  console.log(listWebURL)
  console.log(listUser)
  console.log(listPass)
  console.log(listDomain)
  console.log(listParty)
  console.log(listADFS)
  */
  
  var token = req.csrfToken()
  res.cookie('XSRF-TOKEN', token)
  res.send({
    csrfToken: token
  });

})

router.post('/', csrfProtection, async (req, res) => {
  //clean the body
  //console.log(req.body)
  clean(req.body);
  //console.log(req.body)
  
  HaveEmployeeValidationSchema.validate(req.body, { abortEarly: false })
    .then(async function (value) {

      try {
        await sendEmails(value)
          .then(async function (sent) {
            if (sent){
              var pE = [
                value.position0Email0, value.position0Email1, value.position0Email2, 
                value.position0Email3, value.position0Email4, value.position1Email0, 
                value.position1Email1, value.position1Email2,value.position1Email3].filter(e => e != null);
              for (const email of pE){
                console.log(email)
                await saveList(value,email)
                .then(function(saved){
                  console.log("saved")
                  console.log(saved)
                  // save values to mongo db
                  try {
                    saveHaveEmployeeValues(value, email, saved);
                  }
                  catch (error) {
                    console.log(error);
                  }
                })
                .catch(function(e){
                  console.log("error")
                  console.log(e)
                  //save failed one
                  try {
                    saveHaveEmployeeValues(value, email, false);
                  }
                  catch (error) {
                    console.log(error);
                  }
                })               
              }
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