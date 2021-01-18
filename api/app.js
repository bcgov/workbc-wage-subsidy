var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var csrf = require('csurf')
var bodyParser = require('body-parser')
var cors = require('cors')

var origin = process.env.ORIGIN_URL || process.env.OPENSHIFT_NODEJS_ORIGIN_URL || "http://localhost:3000"

const corsOptions = {
    origin: origin,
    credentials: true,
    optionsSuccessStatus: 200,
};

var formRouter = require('./routes/haveEmployeeForms');
//var participantFormRouter = require('./routes/participantForm');
var claimFormRouter = require('./routes/claimForm');
var needEmployeeRouter = require('./routes/needEmployeeForm');

var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(helmet());


app.use('/api/haveEmployeeForm', formRouter)
//app.use('/api/participantForm',participantFormRouter)
app.use('/api/claimForm', claimFormRouter)
app.use('/api/needEmployeeForm', needEmployeeRouter);

module.exports = app;
