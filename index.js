const bitcoin = require('./source/blockchainiz/bitcoin');
const ethereum = require('./source/blockchainiz/ethereum');
const user = require('./source/blockchainiz/user');

module.exports = options =>
  ({
    // // ________________Bitcoin_______________ //
    //
    // // /notaries POST
    // postBitcoinNotaries: bitcoin.postBitcoinNotaries(options),
    //
    // // /notaries GET
    // getBitcoinNotariesList: bitcoin.getBitcoinNotariesList(options),
    //
    // // /notaries/:id GET
    // getBitcoinNotariesById: bitcoin.getBitcoinNotariesById(options),
    //
    // // /notaries/infos GET by Id
    // getBitcoinInfos: bitcoin.getBitcoinInfos(options),

    // ________________Ethereum_______________ //

    // /nodes GET
    getEthereumNodes: ethereum.getNodes(options),

    // /infos GET
    getEthereumInfos: ethereum.getInfos(options),

    // /contracts POST
    postEthereumContract: ethereum.postContracts(options),

    // /contracts GET
    getEthereumContractsList: ethereum.getContractsList(options),

    // /contracts/:id GET
    getEthereumContractsById: ethereum.getContractsById(options),

    // /noconstantfunction/:id GET
    getEthereumNoConstantFunctionById: ethereum.getNoConstantFuncById(options),

    // /noconstantfunction GET
    getEthereumNoConstantFunctionList: ethereum.getNoConstantFuncList(options),

    // /contracts/:id/noconstant/:functionName POST
    callEthereumNoConstantFunction: ethereum.callContractsNoConstantFunction(options),

    // /contracts/:id/constant/:functionName POST
    callEthereumConstantFunction: ethereum.callContractsConstantFunction(options),

    // /contracts/:id/subscribe POST
    subscribeEthereumEvent: ethereum.subscribeEthereumEvent(options),

    // /contracts/:contractId/subscribe/:subscriptionId DELETE
    unsubscribeEthereumEvent: ethereum.unsubscribeEthereumEvent(options),

    // /contracts/:contractId/subscribe/:id GET
    getEthereumSubscription: ethereum.getEthereumSubscription(options),

    // /contracts/:contractId/subscribe/:id/events GET
    getEthereumEventsBySubscription: ethereum.getEthereumEventsBySubscription(options),

    // /contracts/:contractId/events/:id GET
    getEthereumEvent: ethereum.getEthereumEvent(options),

    // /rawtransactions POST
    postEthereumRawTransaction: ethereum.postEthereumRawTransaction(options),

    // /rawtransactions/:id GET
    getEthereumRawTransaction: ethereum.getEthereumRawTransaction(options),

    // /rawtransactions GET
    getEthereumRawTransactionList: ethereum.getEthereumRawTransactionList(options),

    // /wallets POST
    postEthereumWallets: ethereum.postWallets(options),

    // /wallets PATCH
    patchEthereumWallet: ethereum.patchWallet(options),

    // /wallets/:id/balance GET
    getEthereumWalletBalance: ethereum.getWalletBalance(options),

    // /wallets GET
    getEthereumWalletsList: ethereum.getWalletsList(options),

    // /wallets/:walletAddress/sign POST
    signData: ethereum.signData(options),

    // /users/ GET
    getUser: user.getUser(options),

    // /users/ PATCH
    patchUser: user.patchUser(options),
  });
