var hfc = require('fabric-client');


var loggerUtil = require('../util/logger');
var logger = loggerUtil.getLogger('set');
var channelService = require('./channel');
var chaincodeService = require('./chaincode');
var appConstants = require('../constants/appConstants');

var setupChannel = async function () {

    //Create Channel
    logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
    const channelName = hfc.getConfigSetting('channelName');
    const channelConfigPath = hfc.getConfigSetting('channelConfigPath');
    const admins = hfc.getConfigSetting('admins');
    const peers = hfc.getConfigSetting('peers');
    const userName = admins[0].username;
    const orgName = appConstants.orgName;
    let message;

    message = await channelService.createChannel(channelName, channelConfigPath, userName, orgName);
    logger.log("Create Channel", message)

    logger.info("sleeping 5s")
    setTimeout(async function () {
        //Join Channel
        logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
        message = await channelService.joinChannel(channelName, peers, userName, orgName);
        logger.log("Join channel", message);

        logger.info("sleeping 5s")
        setTimeout(async function () {
            //Install Chaincode
            const {
                chaincodeName,
                chaincodePath,
                chaincodeVersion,
                chaincodeType,
                metadataPath
            } = hfc.getConfigSetting('chaincode');
            logger.info('==================== INSTALL CHAINCODE ==================');
            message = await chaincodeService.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, metadataPath, userName, orgName)
            logger.log("Install chaincode", message);
        }, 5000)
    }, 5000);


}


exports.setupChannel = setupChannel;