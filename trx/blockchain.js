const TronWeb = require('tronweb');
let tronWeb;
let provider = process.env.NODE_ENV === 'production' ? 'https://api.trongrid.io' : 'https://api.trongrid.io';
const app = require('../../../server/server');

module.exports.initialize = async function () {
	console.log(provider);
	tronWeb = new TronWeb({
		fullHost: provider
	});
};


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

async function createSendTransaction(coinSymbol, from, to, amount, tokenId, decimals) {
	try {
		amount = parseInt(amount * Math.pow(10, decimals));
		return tronWeb.transactionBuilder.sendToken(to, amount, tokenId, from);
	} catch (e) {
		console.log(e);
	}
}

module.exports.getRemainBandWidth = async function(address) {
	let bandWidth = await tronWeb.trx.getBandwidth(address);
	return bandWidth;
};

module.exports.getBalance = async function(address, tokenId) {
	let balance = await tronWeb.trx.getAccount(address);
	let assets = balance.assetV2;
	for (let asset of assets){
		if (asset.key === tokenId) {
			return asset.value;
		}
	}
	return 0;
};

module.exports.checkAddressIsActive = async function(address) {
	try {
		let account = await tronWeb.trx.getAccount(address);
		if (account && account.address) {
			return true;
		}
	} catch (e) {
		console.log(e)
	}
	return false;
};

module.exports.getTransactionInfo = async function(txId) {
	let transaction = await tronWeb.trx.getTransactionInfo(txId);
	return transaction
};

module.exports.sendMoney = async function (coinSymbol, sendInfo, type, title) {
	let TRXAccount = app.models.TRXAccount;
	await TRXAccount.updateAccount();
	let account = await TRXAccount.getAccount(sendInfo.amount * Math.pow(10, sendInfo.decimals));
	if (!account) {
		return;
	}
	sendInfo.address = account.address;
	sendInfo.privateKey = account.private_key;
	console.log('-- %s.sendMoney %s from %s to %s', coinSymbol, sendInfo.title, sendInfo.address, sendInfo.receiverAddress);

	let result = {};
	try {
		let transaction = await createSendTransaction(coinSymbol, sendInfo.address, sendInfo.receiverAddress, sendInfo.amount, sendInfo.tokenId, sendInfo.decimals, title);
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
};
