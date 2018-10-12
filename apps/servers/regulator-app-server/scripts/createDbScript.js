var logger = require('../util/logger').getLogger("DbScript");

var appConstants = require('../constants/appConstants');

const {
    regulatorDatabase
} = appConstants;

const nano = require('../util/couchdb');

console.log("DB create script");
nano.db.list(function (error, databases) {
    if (error)
        return console.log('ERROR :: nano.db.list - %s', JSON.stringify(error));

    if (databases.indexOf(regulatorDatabase.dbName) < 0) {
        nano.db.create(regulatorDatabase.dbName, function (error, body, headers) {
            if (error) {
                logger.log('ERROR :: %s', JSON.stringify(error));
            }
            insertAdminRecord();
        })
    } else {
        insertAdminRecord();
    }
});


function insertAdminRecord() {
    const db = nano.use(regulatorDatabase.dbName);
    db.get('admin').then((body) => {
        if (body) {
            return;
        }
    }).catch((err) => {
        db.insert({
            doctype: 'users',
            userName: 'admin',
            role: 'admin',
            password: 'pass123'
        }, 'admin').then((body) => {
            console.log(body);
        });
    })

}