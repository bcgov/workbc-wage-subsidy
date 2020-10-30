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
const { getSubmitted } = require('../utils/confirmationData');

// env var info here...

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