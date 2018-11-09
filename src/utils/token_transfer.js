var Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var contractAddress = '0x29fdd72c129ec6cfcd0e9ebe59abf9273b8b9444';

var fs = require('fs');
var abiFile = "contract/abi/WILI.abi";
var abi = JSON.parse(fs.readFileSync(abiFile));

var fromAddress = '0x2e8115c17fe971DA68acf0Ce574a71E372C9d169';
var privateKey = new Buffer.from('D96EA2E6DEE5829521ADEE3C9527CE557CF1BC50A3D64621F0DA417D5D26B7B9', 'hex');

function transfer(to, amount) {
	var web3 = new Web3();
	web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
	var wiliContract = web3.eth.contract(abi).at(contractAddress);

	var count = web3.eth.getTransactionCount(fromAddress);
	var gasPrice = web3.eth.gasPrice;
	var gasLimit = 90000;
	var tokenBalance = wiliContract.balanceOf(fromAddress);
	console.log('wili balance:' + tokenBalance);

	var value = Number(amount) * 1e18;
	var data = wiliContract.transfer.getData(to, value, {from:fromAddress});
	var rawTx = {
		"from": fromAddress,
		"nonce": web3.toHex(count),
		"gasPrice": web3.toHex(gasPrice),
		"gasLimit": web3.toHex(gasLimit),
		"to": contractAddress,
		"value": "0x0",
		"data": data
	};
	
	var tx = new Tx(rawTx);
	tx.sign(privateKey);

	var serializedTx = tx.serialize();
	web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), (err, hash) => {
		if(err){
			console.log('token transfer failed');
		} else {
			console.log('txHash: ' + hash);
		}
	});
}

module.exports = transfer;

//to = '0x37938BD31354b648fccE6A264BE44B48865dF657';
//transfer(fromAddress, 100, to);
