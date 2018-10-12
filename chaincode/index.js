var shim = require('fabric-shim');
const util = require('util');


const docType = 'wallet';

var ChainCode = class {

    async Init(stub) {
        console.log("-*-*-*-*-*-*-*-*- Chain code initilization -*-*-*-*-*-*-*-*-*-*-*-*");
        let ret = stub.getFunctionAndParameters()
        console.info(ret);
        return shim.success();
    }

    async Invoke(stub) {
        console.log("-*-*-*-*-*-*- Invoking chain code -*-*-*-*-*-*-*-*-*");
        let ret = stub.getFunctionAndParameters();
        let method = this[ret.fcn]
        if (!method) {
            console.error("No method found with name" + ret.fcn);
            return shim.error("No method found with name" + ret.fcn);
        }
        console.log("Calling method" + ret.fcn);
        try {
            const payload = await method(stub, ret.params, this)
            return shim.success(payload);
        } catch (error) {
            console.log(error);
            return shim.error(error);
        }
    }

    async updateOrderStatus(stub, args) {
        console.log("-*-*-*-*-*-*-*-*-* Updating Order Status *-*-*-*-*-*-*-*", args);
        if (args.length !== 2) {
            throw new Error("no of parameters does not matching required");
        }
        const user = args[0];
        const status = args[1];
        var dataBytes = await stub.getState(user);
        if (!dataBytes.toString()) {
            const error = 'Cannot find a account with the username ' + user;
            throw new Error(error);
        }
        var data = JSON.parse(dataBytes.toString());
        data.status = status;
        await stub.putState(user,Buffer.from((JSON.stringify(data))));
    }

    async createOrder(stub, args) {
        console.log("-*-*-*-*-*-*-*-*-* Creating order *-*-*-*-*-*-*-*", args);
        if (args.length !== 2) {
            throw new Error("no of parameters does not matching required");
        }
        const user = args[0];
        const data = args[1];
        await stub.putState(user, Buffer.from(data));
    }
}

shim.start(new ChainCode())