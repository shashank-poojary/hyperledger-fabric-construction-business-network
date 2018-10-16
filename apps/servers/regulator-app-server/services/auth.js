'use strict';

var jwt = require('jsonwebtoken');

var logger = require('../util/logger').getLogger("AuthService");
var util = require('util');

var appConstansts = require('../constants/appConstants')
var verify = async function (req, res, next) {
	logger.debug(' ------>>>>>> new request for %s', req.originalUrl);
	if (req.originalUrl.indexOf('/users') >= 0) {
		return next();
	}

	var token = req.token;
	logger.log("Token %s ", token);
	jwt.verify(token, appConstansts.jwtSecret, function (err, decoded) {
		if (err) {
			logger.log(err)
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
}


exports.verify = verify;