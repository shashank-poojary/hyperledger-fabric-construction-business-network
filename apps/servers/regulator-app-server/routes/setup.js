
var express = require('express');
var router = express.Router();

var routeConstants = require('../constants/routeConstants');
var loggerUtil = require('../util/logger');
var logger = loggerUtil.getLogger('setup');

var authService = require('../services/auth');
var setupService = require('../services/setup');

 

router.route(routeConstants.SETUP).post(authService.verify,async function(req, res) {
    logger.debug('================ SETUP ======================');
	let message = await setupService.setupChannel();
	res.send(message);
})


module.exports = router;