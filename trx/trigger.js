let provider = 'https://api.shasta.trongrid.io/';
const TronWeb = require('tronweb');
let tronWeb = new TronWeb({
    fullHost: provider
});


tronWeb.setAddress('TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt');


async function sign(transaction, privateKey) {
    const signedTransaction = tronWeb.trx.sign(
        transaction,
        privateKey
    );

    return await signedTransaction;
}

async function signAndBroadcastTransaction(transaction, privateKey) {

    let signed = await sign(transaction, privateKey);
    let t =  await tronWeb.trx.sendRawTransaction(signed);
    return t;
}

async function triggerSmartContract(contractAddress, functionSelector, options, params, address) {
    console.log(`Trigger contract ${contractAddress}, function: ${functionSelector}`);
    try {
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            functionSelector,
            options,
            params,
            address
        );
        console.log(transaction.transaction);
        return transaction.transaction;

        // return signAndBroadcastTransaction(transaction.transaction, pk);
    } catch (e) {
        console.error('Failed to trigger smart contract: ', e);
        return Promise.reject(e);
    }
}

//transferFrom(address _from, address _to, uint256 _value)
async function transferFrom( contractAddress, fromAddress, toAddress, amount, pk) {
    try {
        let functionSelector = 'transferFrom(address,address,uint256)';
        let options = {};
        let params = [{'type': 'address', 'value': fromAddress}, // from
            {'type': 'address', 'value': toAddress}, // to
            {'type': 'uint256', 'value': amount}];

        let t = await triggerSmartContract(contractAddress, functionSelector, options, params,
            fromAddress);
        await signAndBroadcastTransaction(t, pk);
        return t;
    } catch (e) {
        console.log('Error when transfer M721 from %s to %s', fromAddress, toAddress);
    }
};

async function transfer(contractAddress, fromAddress, toAddress, amount, pk) {
    try {
        let functionSelector = 'transfer(address,uint256)';
        let options = {};
        let params = [ {'type': 'address', 'value': toAddress}, // to
            {'type': 'uint256', 'value': amount}];

        let t = await triggerSmartContract(contractAddress, functionSelector, options, params,
            fromAddress);
        await signAndBroadcastTransaction(t, pk);
        return t;
    } catch (e) {
        console.log('Error when transfer M721 from %s to %s', fromAddress, toAddress);
    }
};


async function balanceOf(contractAddress, toAddress, fromAddress, pk) {
    try {
        let functionSelector = 'balanceOf(address)';
        let options = {};
        let params = [{'type': 'address', 'value': toAddress}];

        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
            contractAddress,
            functionSelector,
            options,
            params,
            address
        );
        let res = transaction.constant_result[0];
        console.log('Balance of this address is: ' + parseInt(res, 16));
    } catch (e) {
        console.log('Error when transfer M721 from %s to %s', fromAddress, toAddress);
    }
};


async function createAuthen() {
    let message = tronWeb.toHex(text='hello')
    let signed = await tronWeb.trx.sign(message, 'B230BF77460370D821201969EDEC52FEE0E8615A155581D562D16A3974FCD8A7');
    console.log(signed)

    let verifyMsg = await tronWeb.trx.verifyMessage(message, signed, 'TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt');
    console.log(verifyMsg)
}

createAuthen()
// transfer('TSS9aeFpQJSPGUWQTWjiCzT5pjn3denf8D', 'TEGdcXoFwdBN6gooV4wVcaaNDyyW2XTBVH', 'TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt', 50, '');
// transfer('TSS9aeFpQJSPGUWQTWjiCzT5pjn3denf8D', 'TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt', 'TEGdcXoFwdBN6gooV4wVcaaNDyyW2XTBVH', 100, '');
// balanceOf('TSS9aeFpQJSPGUWQTWjiCzT5pjn3denf8D', 'TEw9EGNgL91b4jBtgAeC11nswjazVnnfUb', 'TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt', '');