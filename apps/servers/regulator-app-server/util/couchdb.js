
var appConstants = require('../constants/appConstants');

const {
    regulatorDatabase
} = appConstants;

const nano = require('nano')(regulatorDatabase.url);


module.exports = nano;