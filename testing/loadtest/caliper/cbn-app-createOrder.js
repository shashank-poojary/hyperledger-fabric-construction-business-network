'use strict';

module.exports.info = 'Create order';

let accounts = [];
let data;
let bc, contx;
module.exports.init = function (blockchain, context, args) {
    console.log("Arguments", args);
    
    data = JSON.stringify(args.data);
    bc = blockchain;
    contx = context;
    return Promise.resolve();
};

const dic = 'abcdefghijklmnopqrstuvwxyz';
/**
 * Generate string by picking characters from dic variable
 * @param {*} number character to select
 * @returns {String} string generated based on @param number
 */
function get26Num(number) {
    let result = '';
    while (number > 0) {
        result += dic.charAt(number % 26);
        number = parseInt(number / 26);
    }
    return result;
}

let prefix;
/**
 * Generate unique account key for the transaction
 * @returns {String} account key
 */
function generateAccount() {
    // should be [a-z]{1,9}
    if (typeof prefix === 'undefined') {
        prefix = get26Num(process.pid);
    }
    return prefix + get26Num(accounts.length + 1);
}

module.exports.run = function () {
    let newAcc = generateAccount();
    accounts.push(newAcc);
    return bc.invokeSmartContract(contx, 'mycc', 'v0', {
        verb: 'createOrder',
        account: newAcc,
        data
    }, 30);
};

module.exports.end = function () {
    return Promise.resolve();
}; 

module.exports.accounts = accounts;