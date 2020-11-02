var express = require('express');
var router = express.Router();

var { check, validationResult, matchedData } = require('express-validator')
var nodemailer = require("nodemailer");
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var spauth = require('node-sp-auth')
var request = require('request-promise')


var ParticipantFormValidationSchema = require('../schemas/ParticipantFormValidationSchema')
var generateHTMLEmail = require('../utils/htmlEmail')
var notification = require('../utils/applicationReceivedEmail');
var clean = require('../utils/clean')
var confirmData = require('../utils/confirmationData');
const { getSubmitted } = require('../utils/confirmationData');

// env var info here...
var confirmationEmail1 = process.env.CONFIRMATIONONE || process.env.OPENSHIFT_NODEJS_CONFIRMATIONONE || "";
var confirmationEmail2 = process.env.CONFIRMATIONTWO || process.env.OPENSHIFT_NODEJS_CONFIRMATIONTWO || "";
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
// send email func

// get

// post
router.get('/', csrfProtection, (req, res) => {
    var token = req.csrfToken()
    res.cookie('XSRF-TOKEN', token)
    res.send({
      csrfToken: token
    });
  });

  module.exports = router;