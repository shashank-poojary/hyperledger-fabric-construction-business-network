module.exports = {
    jwtSecret: 'SMP@144_~qez',
    orgName: "RegulatorOrg",
    credentialStore: { //Keyvalue store configuration for Org1
        couchDbOpt: {
            name: 'regulator-credential-store',
            url: 'http://127.0.0.1:5984'
        }
    },
    regulatorDatabase: {
        dbName: 'regulator',
        url: 'http://127.0.0.1:5984',
        collections: {
            users: 'users'
        }
    },
    setupTimeout: 5000
}