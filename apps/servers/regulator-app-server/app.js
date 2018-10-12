'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var bearerToken = require('express-bearer-token');
var cors = require('cors');

require('./config.js');
var hfc = require('fabric-client');

var routeConstants = require('./constants/routeConstants');


var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');

//Routes
var users = require('./routes/users');
// var channels = require('./routes/channel');
// var chaincodeRoute = require('./routes/chaincode');
// var invokeRoute = require('./routes/Invoke');
// var transactionRoute = require('./routes/transaction');

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bearerToken());


app.use(routeConstants.BASE, users);
// app.use(routeConstants.BASE, channels);
// app.use(routeConstants.BASE, chaincodeRoute);
// app.use(routeConstants.BASE, invokeRoute);
// app.use(routeConstants.BASE, transactionRoute);

var server = http.createServer(app).listen(port, function () {});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;