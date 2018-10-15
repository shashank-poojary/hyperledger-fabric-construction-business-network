var express = require('express');
var router = express.Router();

var routeConstants = require('../constants/routeConstants') 
var channelService = require('../services/channel');
var logger = require('../util/logger').getLogger("ChannelRoute");
var auth = require('../services/auth');
var getErrorMessage = require('../util/error').getErrorMessage

router.route(routeConstants.CREATE_CHANNEL)
.post(auth.verify, async function(req, res) {
	logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
	logger.debug('End point : /channels');
	var channelName = req.body.channelName;
	var channelConfigPath = req.body.channelConfigPath;
	logger.debug('Channel name : ' + channelName);
	logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!channelConfigPath) {
		res.json(getErrorMessage('\'channelConfigPath\''));
		return;
	}
	let message = await channelService.createChannel(channelName, channelConfigPath, req.username, req.orgname);
	res.send(message);
})


router.route(routeConstants.JOIN_CHANNEL)
.post(auth.verify, async function(req, res) {
	logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
	var channelName = req.params.channelName;
	var peers = req.body.peers;
	logger.debug('channelName : ' + channelName);
	logger.debug('peers : ' + peers);
	logger.debug('username :' + req.username);
	logger.debug('orgname:' + req.orgname);

	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!peers || peers.length == 0) {
		res.json(getErrorMessage('\'peers\''));
		return;
	}

	let message =  await channelService.joinChannel(channelName, peers, req.username, req.orgname);
	res.send(message);
})

module.exports = router; 