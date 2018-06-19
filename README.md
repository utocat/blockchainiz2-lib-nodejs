
![Node Library for Blockchainiz API](./img/blockchainiz.png)

# BLOCKCHAINIZ LIBRARY

## Installation
Simply use NPM with the following command :
```
npm install blockchainiz2 --save
```

This will download the package and add an entry in your project's `package.json` file.


## Setup
In your project's source code, you need to start by importing the blockchainiz package and specify the options you want to use:

```javascript
const  blockchainiz = require('blockchainiz2')({
publicKey:  'your public key',
privateKey:  'your private key',
useSandbox:  true,
});
```

There are 3 options that you can set. You **NEED** to specify them in order for the package to work:

Option | Type | Description
| ------ | ---- | ----------- |
| publicKey | string | Your Blockchainiz public key |
| privateKey | string | Your Blockchainiz private key |
| useSandbox | bool | True to use the sandbox version of the API |


## License

Blockchainiz Library is distributed under MIT license, see the [LICENSE file](./LICENSE).



## Contacts
Report bugs or suggest features using [issue tracker on GitHub](https://github.com/utocat/blockchainiz2-lib-nodejs/issues).



## Account creation
You can ask an [account](https://www.utocat.com/fr/contact) (note that validation of your sandbox/production account can take a few days, so think about doing it in advance of when you actually want to go live).


## Sample usage

### Get Information about Ethereum Node
```javascript
blockchainiz.getEthereumInfos((err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	compilerVersion:{
		solc:{
			version: '0.4.21+commit.dfe3193c.Linux.g++'
		}
	},
	etherPrice: {
		EUR: 423.83,
		USD: 492.63
	},
	timestamp: 1529323176534
}
```

### Post an Ethereum contract
```javascript
blockchainiz.postEthereumContract(
{
	language: 'solidity', // REQUIRED: string: language of your Ethereum contract
	sourceCode: sourceCode, // REQUIRED: string: sourcecode of your Ethereum contract
	walletAddress : '0x1234567890abcdef' // string: if null = default wallet
	parameters: [15], // number: parameters for your constructor
	name: 'testSmartContract', // string: Name of your Ethereum contract
	pushedCallback: data.url + '?type=pushed', // string: url called after push
	minedCallback: data.url + '?type=mined', // string: url called after mining
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	id: '5b27a100b989df001152e02e',
	walletAddress: '0xabcdef1234567890'
}
```

### Get the Ethereum contracts list
```javascript
blockchainiz.getEthereumContractsList(
{
	page: 1, // number: current page
	perPage: 20, // number: total item per page
	sortBy: 'status', // string: apiRequest, pushedInBlockchain, minedInBlockchain, response, status (default: apiRequest)
	sortOrder: 'asc', // asc or desc (default : asc)
},(err, res) => {
	console.log(res);
	if (err) {
		console.log(err);
	}
	should.not.exist(err);
	done();
});
```
#### Response
```javascript
[
	{
		id: '5a9e5ac283490f0011d87293',
		abi: [
			[Object],
			[Object],
			[Object], 
			[Object],
			[Object] 
		],
		status: 'mined',
		address: '0x741e12ae8f9845366004202fabcdef',
		language: 'solidity',
		parameters: [
			'3'
		],
		name: 'Ballot',
		gasPriceInWei: 26000000000,
		infosCompilation:[
			'1:1: Warning: Source file does not specify required compiler version!Consider adding "pragma solidity ^0.4.19;"\ncontract Ballot {\n^\nSpanning multiple lines.\n'
		],
		etherPrice:{
			BTC: 0.07502,
			USD: 847.21,
			EUR: 688.68,
			AUD: 1098.65,
			CHF: 805.06,
			CAD: 1099.97,
			GBP: 630.38
		},
		timestampsInMs:{
			requestAPI: 1520327362396,
			pushedInBlockchain: 1520327366137,
			minedInBlockchain: 1520327377000,
			response: 1520327379267
		}
	},
	...
]
```

### Get an Ethereum contract by id
```javascript
blockchainiz.getEthereumContractsById(
{
	contractId: ‘5afaf0e64456d800113c94df’ // REQUIRED: string: the contract ID
});
```
#### Response
```javascript
{
	id: '5b27d894b989df001152e0bb',
	abi:[
		{
			constant: true,
			inputs: [],
			name: 'getVersion',
			outputs: [Array],
			payable: false,
			stateMutability: 'pure',
			type: 'function'
		},
		{
			constant: false,
			inputs: [Array],
			name: 'setStatus',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function'
		},
		...
	],
	status: 'mined',
	address: '0x033d4e371e9d8ac6678f796b4559cb66ba635dxx',
	amount: 0,
	language: 'solidity',
	parameters: [
		20
	],
	name: 'testSmartContract',
	infosCompilation:[
		'37:9: Warning: Invoking events without "emit" prefix is deprecated.\n statusChange(msg.sender, status);\n ^------------------------------^\n'
	],
	etherPrice:{
		BTC: 0.07695,
		USD: 497.14,
		EUR: 428.16,
		AUD: 667.32,
		CHF: 493.37,
		CAD: 676.34,
		GBP: 371.94
	},
	timestampsInMs:{
		apiRequest: 1529338004280,
		pushedInBlockchain: 1529338004529,
		minedInBlockchain: 1529338018000,
		response: 1529338028277
	},
	gasPriceInWei: 10000000000
}
```

### Get a no constant function called by id
```javascript
blockchainiz.getEthereumNoConstantFunctionById(
{
	functionId :'5b27dae1b989df001152e0ca' // REQUIRED : the function ID
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	id: '5b27dae1b989df001152e0ca',
	contract: '5b27dac3b989df001152e0c8',
	txid: '0xae54089532251676aba760f20760c0ba55bfdf055306efd35365e590b8aa2d5c',
	functionName: 'setStatus',
	functionParameters: [
		10
	],
	status: 'mined',
	pushedCallback: 'http://postb.in/DgmNHcCg?type=pushed',
	minedCallback: 'http://postb.in/DgmNHcCg?type=mined',
	blockHash: '0xb851637721fd2edb3d6a4ef3dd5434adaf94c60199b9ad8607d59ffcb3abfbe1',
	blockNumber: 3462888,
	gasUsed: 28378,
	gasLimit: 31216,
	gasPriceInWei: 10000000000,
	timestampsInMs:{
		apiRequest: 1529338593136,
		pushedInBlockchain: 1529338593250,
		minedInBlockchain: 1529338608000,
		response: 1529338610943
	},
	etherPrice:{
		BTC: 0.07692,
		USD: 497.42,
		EUR: 428.15,
		AUD: 667.32,
		CHF: 493.18,
		CAD: 679.01,
		GBP: 359.81
	}
}
```

### Get a list with all functions no constant called
```javascript
blockchainiz.getEthereumNoConstantFunctionList(
{
	page: 1, // number: current page
	perPage: 20, // number: total item per page
	sortBy: 'status', // string: apiRequest, pushedInBlockchain, minedInBlockchain, response, status (default: apiRequest)
	sortOrder: 'asc', // asc or desc (default : asc)
},(err, res) => {
		if (err) {
			console.log(err);
		}
});
```
#### Response
```javascript
[
	{
		id: '5b195ed7a7215d0011b73906',  
		contract: '5b195ebca7215d0011b73904',  
		txid: '0x66a30db58f6a66940b993f799fcc9fbc48e150d05de858027c6b2886f81aef',  
		functionName: 'setStatus',  
		functionParameters: [
			10
		],  
		status: 'mined',  
		pushedCallback: 'http://test/pushedCallback',  
		minedCallback: 'http://test/minedCallback',  
		blockHash: '0x2f3cd5ec71596f8b6896a6b0f5e9a2272042ce4d61a791ab1cbd364edd9caa',  
		blockNumber: 3392382,  
		gasUsed: 43378,  
		gasLimit: 47716,  
		gasPriceInWei: 10000000000,  
		timestampsInMs: {
			apiRequest: 1528389335421,  
			pushedInBlockchain: 1528389335705,  
			minedInBlockchain: 1528389336000,  
			response: 1528389342705
		},  
		etherPrice: {
			BTC: 0.07886,  
			USD: 606.26,  
			EUR: 513.15,  
			AUD: 793.73,  
			CHF: 629.93,  
			CAD: 788.97,  
			GBP: 455.81
		}
	},
	...  
]
```

### Call a no constant function for a contract in Ethereum
```javascript
blockchainiz.callEthereumNoConstantFunction(
{
	contractId: '5afaf0e64456d800113c94dd', // REQUIRED: string: The contract ID from Blockchainiz
	functionName: 'setStatus', // REQUIRED: string: name of the function called
	functionParameters: [ // if null = []
		10
	],
	walletAddress: // if null = default wallet
	pushedCallback: // string/url
	minedCallback: // string/url
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```

#### Response
```javascript
{
	id: '5b28f5adb989df001152e0f6',
	walletAddress: '0x8f136c013b1c541a7971c9dfbd0866c60f362f0a'
}
```

### Call a constant function for a contract in Ethereum
```javascript
blockchainiz.callEthereumConstantFunction(
{
	contractId:'5afaf0e64456d800113c94da',  // REQUIRED: string: The contract ID from Blockchainiz
	functionName: 'getStatus', // REQUIRED: string: name of the function called
	functionParameters: [] // if null = []
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	data:{
		'2': '0.0.1',
		a: '0x2bc2239448959a1ae54747c28827b2ad7d20006c',
		b: '20'
	}
}

```

### Subscribe to an Ethereum event in contract
```javascript
blockchainiz.subscribeEthereumEvent(
{
	contractId:'5afaf0e64456d800113c94df', // REQUIRED: string: The contract ID from Blockchainiz
	eventName: 'statusChange', // REQUIRED: string: Name of the event to subscribe
	callbackUrl: 'http://myserver.com/callback?type=event', // string : url for callback
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	id: '5b28f5feb989df001152e0f8' // ID of the subscribtion
}
```

### Unsubscribe to a specific event in a Ethereum contract
```javascript
blockchainiz.unsubscribeEthereumEvent(
{
	contractId:'5afaf0e64456d800113c94df', // REQUIRED: string: The contract ID from Blockchainiz
	subscriptionId:'5b28f5feb989df001152e0f8', // REQUIRED: string: ID of the subscription
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
No Content
```

### Get infos about a specific subscription
```javascript
blockchainiz.getEthereumSubscription(
{
	contractId:'5afaf0e64456d800113c94df', // REQUIRED: string: The contract ID from Blockchainiz
	subscriptionId:'5b28f5feb989df001152e0f8', // REQUIRED: string: ID of the subscription
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	id: '5b28f5feb989df001152e0f8',
	eventName: 'statusChange',
	contract: '5b28f59eb989df001152e0f4',
	callback: 'http://postb.in/57pmXc96?type=event'
}
```

### Get event infos with a specific subscription  ID
```javascript
blockchainiz.getEthereumEventsBySubscription(
{
	contractId:'5afaf0e64456d800113c94df', // REQUIRED: string: The contract ID from Blockchainiz
	subscriptionId:'5b28f5feb989df001152e0f8', // REQUIRED: string: ID of the subscription
},(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
[
	{
		id: '5b28f612b989df001152e0f9',
		eventName: 'statusChange',
    parameters: {
  		param1: '0x8f136c013b1c541a7971c9dfbd0866c60f362f0a',
  		param2: '10'
  	},
		contractId: '5b28f59eb989df001152e0f4',
		blockNumber: 3468496,
		blockHash: '0x338bf9674d2609830f3031ae69a6423b49c36f647bcc1afd2ff5cc5b8fca4bd3',
		transactionHash: '0xb86c49cda7fb392e655220aac093eef4d9ad999945ec5776cb5b8debab13d533'
	},
	...
]
```

### Get event infos with a specific event  ID
```javascript
blockchainiz.getEthereumEvent(
{
	contractId:'5afaf0e64456d800113c94df', // REQUIRED: string: The contract ID from Blockchainiz
	eventId: '5b28f5adb989df001152e0f6', // REQUIRED: string: The event ID from Blockchainiz
},
(err, res) => {
	if (err) {
		console.log(err);
	}
});
```

#### Response
```javascript
{
	id: '5b28f612b989df001152e0f9',
	eventName: 'statusChange',
	parameters: {
		param1: '0x8f136c013b1c541a7971c9dfbd0866c60f362f0a',
		param2: '10'
	},
	contract: '5b28f59eb989df001152e0f4',
	blockNumber: 3468496,
	blockHash: '0x338bf9674d2609830f3031ae69a6423b49c36f647bcc1afd2ff5cc5b8fca4bd3',
	transactionHash: '0xb86c49cda7fb392e655220aac093eef4d9ad999945ec5776cb5b8debab13d533'
}
```

### Create a new Ethereum wallet
```javascript
blockchainiz.postEthereumWallets(
{
	default: true // if true = the wallet created will be as default
}, (err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	walletAddress: '0x271c4832fa1c0dc541a910afa47facb484dc8bce' // your new wallet address
}
```

### Get the balance of a specific wallet address
```javascript
blockchainiz.getEthereumWalletBalance(
{
	walletAddress: '0x271c4832fa1c0dc541a910afa47facb484dc8bce', // the wallet address
	unit: // default = wei - possible ('Gwei','Kwei','Mwei','babbage','ether','femtoether','finney','gether','grand','gwei','kether','kwei','lovelace','mether','micro','microether','milli','milliether','mwei','nano','nanoether','noether','picoether','shannon','szabo','tether','wei')
}, (err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	balance: '11234654365',
  	address: '0x271c4832fa1c0dc541a910afa47facb484dc8bce',
  	unit: 'wei'
}
```

### Get the list of yours wallets
```javascript
blockchainiz.getEthereumWalletsList(
(err, res) => {
	if (err) {
		console.log(err);
	}
});
```
#### Response
```javascript
{
	addresses:[
		'0x8f136c013b1c541a7971c9dfbd0866c60f362f0a',
		'0x2bc2239448959a1ae54747c28827b2ad7d20006c',
		'0x60a30530ec6b7b2ef782d48863f3b6f2146075cb',
		...
	],
	defaultAddress: '0x2bc2239448959a1ae54747c28827b2ad7d20006c'
}
```



## Follow the changelog
You can follow all changes with our [changelog file](./CHANGELOG.md)
