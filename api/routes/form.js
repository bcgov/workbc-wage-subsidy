var express = require('express');
var router = express.Router();
const yup = require('yup')
const yupPhone = require('yup-phone')

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });


var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
var confirmData = require('../utils/confirmationData');
const { getSubmitted } = require('../utils/confirmationData');

var confirmationEmail1 = process.env.CONFIRMATIONONE || process.env.OPENSHIFT_NODEJS_CONFIRMATIONONE || "";
var confirmationEmail2 = process.env.CONFIRMATIONTWO || process.env.OPENSHIFT_NODEJS_CONFIRMATIONTWO || "";
var confirmationBCC = process.env.CONFIRMATIONBCC || process.env.OPENSHIFT_NODEJS_CONFIRMATIONBCC || "";
var listEmail = process.env.LISTEMAIL || process.env.OPENSHIFT_NODEJS_LISTEMAIL || "";
var notifyEmail = process.env.NOTIFYEMAIL || process.env.OPENSHIFT_NODEJS_NOTIFYEMAIL || "";
var clientURL = process.env.CLIENTURL || process.env.OPENSHIFT_NODEJS_CLIENTURL || ""



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
        // send mail with defined transport object
        var mailingList;
        if (confirmationEmail1 !== "" && confirmationEmail2 !== "") {
          mailingList = [confirmationEmail1, confirmationEmail2]
        } else {
          mailingList = [values.contactEmail, values.emailAlternate]
        }
        // send mail with defined transport object
        let message1 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: mailingList,// list of receivers
          bcc: confirmationBCC,
          subject: "Application Confirmation - " + values._id, // Subject line
          html: generateHTMLEmail("Thank you, your application has been received",
            [
              `<b>Application ID: ${values._id}</b>`,
              `Your application has been successfully received. You can print this page for your records. A confirmation email has also been sent to the two contacts provided on the form.`,
              `<b>Next Steps:</b>`,
              `Please provide your participants the following instructions:`,
            ],
            [
              `Application ID: ${values._id}`,
              `Please visit the following URL in order to provide your consent to the Ministry.`,
              `<a href="${clientURL}/${values._id}">${clientURL}/${values._id}</a>`,
              ,
            ],
            getSubmitted(values)
          ) // html body
        };
        let message2 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: listEmail,// list of receivers
          subject: "A grant application has been received - " + values._id, // Subject line
          html: notification.generateListNotification(values) // html body
        };
        let message3 = {
          from: 'WorkBC Wage Subsidy <donotreply@gov.bc.ca>', // sender address
          to: notifyEmail,// list of receivers
          subject: "A grant application has been received - " + values._id, // Subject line
          html: notification.generateNotification(values) // html body
        };
        let info = transporter.sendMail(message1, (error, info) => {
          if (error) {
            console.log("Error sending confirmation for " + values._id)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message2, (error, info) => {
          if (error) {
            console.log("Error sending list notification for " + values._id)
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
        info = transporter.sendMail(message3, (error, info) => {
          if (error) {
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
  //console.log(req.body)
  MainFormValidationSchema.validate(req.body, { abortEarly: false })
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