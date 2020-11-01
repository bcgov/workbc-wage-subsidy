var express = require('express');
var router = express.Router();
const yup = require('yup')
const yupPhone = require('yup-phone')

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var ClaimFormValidationSchema = require('../schemas/ClaimFormValidationSchema');


var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
const { getClaimSubmitted } = require('../utils/confirmationData');

var claimConfirmationEmail = process.env.CLAIM_CONFIRMATION_EMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_EMAIL || "";
var claimConfirmationBCC = process.env.CLAIM_CONFIRMATION_BCC || process.env.OPENSHIFT_NODEJS_CLAIM_CONFIRMATION_BCC || "";
var claimListEmail = process.env.CLAIM_LISTEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_LISTEMAIL || "";
var claimNotifyEmail = process.env.CLAIM_NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_CLAIM_NOTIFYEMAIL || "";

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
        console.log(r)
        console.log("Transporter connected.")
        var cEmail;
        if (claimConfirmationEmail === ""){
          cEmail = values.ClaimEmail
        } else {
          cEmail = ClaimConfirmationEmail
        }
        // send mail with defined transport object
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
        let message2 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: claimListEmail,// list of receivers
          subject: "A Claim grant application has been received", // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: claimNotifyEmail,// list of receivers
          subject: "A Claim grant application has been received", // Subject line
          html: notification.generateNotification(values) // html body
        };
        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            return "An error occurred while submitting the form, please try again. If the error persists please try again later.";
          } else {
            console.log("Message sent: %s", info.messageId);
            return "success"
          }
        });
        info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            return "An error occurred while submitting the form, please try again. If the error persists please try again later.";
          } else {
            console.log("Message sent: %s", info.messageId);
            return "success"
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
            return "An error occurred while submitting the form, please try again. If the error persists please try again later.";
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
  ClaimFormValidationSchema.validate(req.body, { abortEarly: false })
    .then(async function (value) {
      try {
        await sendEmails(value)
          .then(function (sent) {
            if (sent){
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