'use strict';

module.exports.info  = 'Update Order Status';


let bc, contx;
let accounts;
let status;
module.exports.init = function(blockchain, context, args) {
    const open = require('./cbn-app-createOrder.js');
    bc       = blockchain;
    contx    = context;
    accounts = open.accounts;
    status = args.status;
    return Promise.resolve();
};

module.exports.run = function() {
    const acc  = accounts[Math.floor(Math.random()*(accounts.length))];
    return bc.invokeSmartContract(contx, 'mycc', 'v0', {
        verb: 'updateOrderStatus',
        account: acc,
        status,
    }, 30);
};

module.exports.end = function() {
    // do nothing
    return Promise.resolve();
};
