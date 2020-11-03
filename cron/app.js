const cron = require('node-cron')
const express = require('express')
var {getHaveEmployeeNotSP} = require('./mongo')

app = express();

console.log(getHaveEmployeeNotSP(""))

cron.schedule('* * * * *', function() {
    console.log('running a task every minute');
    
});

app.listen(5000);

