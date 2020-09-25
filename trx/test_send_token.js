let provider = 'https://api.shasta.trongrid.io/';
const TronWeb = require('tronweb');
let tronWeb = new TronWeb({
    fullHost: provider
});

async function signTransaction(transaction, privateKey) {
    const signedTransaction = tronWeb.trx.sign(
        transaction,
        privateKey
    );

    return await signedTransaction;
}

async function sendSignedTransaction(rawTransaction) {
    return await tronWeb.trx.sendRawTransaction(rawTransaction);
}

async function createSendTransaction(from, to, amount, tokenId, decimals) {
    try {
        amount = parseInt(amount * Math.pow(10, decimals));
        return tronWeb.transactionBuilder.sendToken(to, amount, tokenId, from);
    } catch (e) {
        console.log(e);
    }
}

async function  test() {
    try {
        let transaction = await createSendTransaction('TPRTB2sNG79uA6nTrHMSceTSgncjSVMnQt', 'TFysCB929XGezbnyumoFScyevjDggu3BPq', 1000, sendInfo.tokenId, 0, title);
        let signedTransaction = await signTransaction(transaction, sendInfo.privateKey);
        let t = await sendSignedTransaction(signedTransaction);
        if (t.result === true) {
            result.txId = transaction['txID'];
        }
        console.log(transaction['txID']);
    } catch (e) {
        console.error('ERROR' + e);
        result.error = e.message;
    }
    return result;
}