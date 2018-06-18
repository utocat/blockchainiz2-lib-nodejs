
![Node Library for Catalizr API](./img/blockchainiz.png)
BLOCKCHAINIZ LIBRARY
=================================================
 This is a PHP client library to work with [Blockchainiz API](https://doc.api.v2.blockchainiz.io/).

## Description

Blockchainiz is a platform to access the blockchain. It is dedicated to banks and insurance companies. This package is a node library to interact more easily with the Blockchainiz API.

## Installation

Simply use NPM with the following command:

```
npm install blockchainiz2 --save
```

This will download the package and add an entry in your project's `package.json` file.

## Setup

In your project's source code, you need to start by importing the blockchainiz package and specify the options you want to use:

```javascript
const blockchainiz = require('blockchainiz2')({
  publicKey: 'your public key',
  privateKey: 'your private key',
  useSandbox: true,
});
```

There are 3 options that you can set. You **NEED** to specify them in order for the package to work:

Option | Type | Description
------ | ---- | -----------
publicKey | string | Your Blockchainiz public key
privateKey | string | Your Blockchainiz private key
useSandbox | bool | True to use the sandbox version of the API
