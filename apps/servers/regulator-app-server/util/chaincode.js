
var hfc = require('fabric-client');
var path = require('path');


var setupChaincodeDeploy = function() {
    process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('CC_SRC_PATH'));
};


exports.setupChaincodeDeploy = setupChaincodeDeploy;