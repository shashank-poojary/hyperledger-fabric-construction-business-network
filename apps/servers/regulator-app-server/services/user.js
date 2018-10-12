var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('userService');
var hfc = require('fabric-client');
var CouchDBKeyValueStore = require('fabric-client/lib/impl/CouchDBKeyValueStore.js')

const nano = require('../util/couchdb');

logger.setLevel('DEBUG');
hfc.setLogger(logger);

var appConstants = require('../constants/appConstants');

const {
	regulatorDatabase
} = appConstants;


async function getClientForOrg(userorg, username) {
	if (userorg === appConstants.orgName) {
		const organization = appConstants.credentialStore;
		logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
		let config = '-connection-profile-path';
		let client = hfc.loadFromConfig(hfc.getConfigSetting('network' + config));
		logger.info("loading org");
		client.loadFromConfig(hfc.getConfigSetting('RegulatorOrg-connection-profile-path'));
		logger.info("loaded org");
		const stateStore = await new CouchDBKeyValueStore(organization.couchDbOpt)
		client.setStateStore(stateStore)
		var cryptoSuite = await hfc.newCryptoSuite()
		var cryptoStore = await hfc.newCryptoKeyStore(CouchDBKeyValueStore, organization.couchDbOpt)
		await cryptoSuite.setCryptoKeyStore(cryptoStore);
		await client.setCryptoSuite(cryptoSuite);
		// if (username) {
		// 	let user = await client.getUserContext(username, true);
		// 	if (!user) {
		// 		 throw new Error(util.format('User was not found :', username));
		// 	} else {
		// 		logger.debug('User %s was found to be registered and enrolled', username);
		// 	}
		// }
		logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)
		return client;
	} else {
		throw new Error(util.format('Configuration for organization %s not found', userorg));
	}
}

var getRegisteredUser = async function (username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg, username);
		logger.debug('Successfully initialized the credential stores');
		// client can now act as an agent for organization Org1
		// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('User %s was not enrolled, so we will need an admin user object to register', username);
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({
				username: admins[0].username,
				password: admins[0].secret
			});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: "org1" + '.department1'
			}, adminUserObj);
			logger.debug('Successfully got the secret for user %s', username);
			user = await client.setUserContext({
				username: username,
				password: secret
			});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if (user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch (error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed ' + error.toString();
	}
};

var authenticateUser = async function (username, password) {
	try {
		const db = nano.use(regulatorDatabase.dbName);
		return db.get(username).then((body) => {
			if (body && body.password === password) {
				return body;
			} else {
				logger.error("User credential is wrong");
				return "User credential is wrong";
			}
		}).catch((error) => {
			logger.error(error);
			return error.toString()
		})
	} catch (error) {
		logger.error('Failed to authenticate user', username, error.toString());
		return error.toString();
	}
}

exports.getRegisteredUser = getRegisteredUser;
exports.getClientForOrg = getClientForOrg;
exports.authenticateUser = authenticateUser;