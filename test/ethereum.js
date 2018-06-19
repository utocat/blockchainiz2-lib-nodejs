const should = require('should');
const fs = require('fs');
const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
});
const postBin = require('./lib/postbin');

const testWallet = '0x2bc2239448959a1ae54747c28827b2ad7d20006c';
// default wallet 0x8f136c013b1c541a7971c9dfbd0866c60f362f0a
// https://ropsten.etherscan.io/address/0x2bc2239448959a1ae54747c28827b2ad7d20006c
// https://ropsten.etherscan.io/address/0x8f136c013b1c541a7971c9dfbd0866c60f362f0a
let newWallet;
let scId;
let functionId;
let rawTransactionId;
let subscriptionId;
let eventId;

/// Tests /////////////////////////////////////////////////////////////////////

describe('POST Ethereum wallets', () => {
  it('should return the wallet address', done => {
    blockchainiz.postEthereumWallets({}, (err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      newWallet = res.walletAddress;
      should.exist(res.walletAddress);
      done();
    });
  });

  it('should return the created wallet address', done => {
    blockchainiz.getEthereumWalletsList((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      res.addresses.should.containEql(newWallet);
      done();
    });
  });
});
describe('GET Wallet balance', () => {
  it('should return 0 balance for the created wallet default unit', done => {
    blockchainiz.getEthereumWalletBalance({ walletAddress: newWallet }, (err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      res.balance.should.be.equal('0');
      res.unit.should.be.equal('wei');
      res.address.should.be.equal(newWallet);
      done();
    });
  });
  it('should return 0 balance for the created wallet unit set to ether', done => {
    blockchainiz.getEthereumWalletBalance(
      { walletAddress: newWallet, unit: 'ether' },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.not.exist(err);
        res.balance.should.be.equal('0');
        res.unit.should.be.equal('ether');
        res.address.should.be.equal(newWallet);
        done();
      },
    );
  });
});
describe('GET Ethereum infos', () => {
  it('should return infos about the Ethereum', done => {
    blockchainiz.getEthereumInfos((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      res.compilerVersion.solc.version.should.be.a.String();
      res.etherPrice.should.be.an.Object();
      res.timestamp.should.be.an.Number();
      done();
    });
  });
});

describe('GET Ethereum nodes infos', () => {
  it('should return infos about the Ethereum node used by the API', done => {
    blockchainiz.getEthereumNodes((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      res.ethereum.version.should.be.an.Object();
      done();
    });
  });
});

describe('POST Ethereum contracts', () => {
  it('should return the id of the Contract Uploaded for default wallet', () => {
    const sourceCode = fs.readFileSync('./test_data/testSmartContract.sol', 'utf8');
    return postBin
      .getUrl()
      .then(data => {
        blockchainiz.postEthereumContract(
          {
            language: 'solidity',
            sourceCode,
            parameters: [15],
            name: 'testSmartContract',
            pushedCallback: data.url + '?type=pushed',
            minedCallback: data.url + '?type=mined',
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            should.not.exist(err);
            scId = res.id;
            should.exist(res.id);
          },
        );
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(scId);
        data.query.type.should.be.equal('pushed');
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(scId);
        data.query.type.should.be.equal('mined');
        return postBin.deleteBin(data.binId);
      });
  }).timeout(120000);

  it('should return the id of the Contract Uploaded for a wallet', () => {
    const sourceCode = fs.readFileSync('./test_data/testSmartContract.sol', 'utf8');
    return postBin
      .getUrl()
      .then(data => {
        blockchainiz.postEthereumContract(
          {
            language: 'solidity',
            sourceCode: sourceCode,
            parameters: [20],
            name: 'testSmartContract',
            walletAddress: testWallet,
            pushedCallback: data.url + '?type=pushed',
            minedCallback: data.url + '?type=mined',
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            scId = res.id;
            should.exist(res.id);
            should.not.exist(err);
          },
        );
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(scId);
        data.query.type.should.be.equal('pushed');
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(scId);
        data.query.type.should.be.equal('mined');
        return postBin.deleteBin(data.binId);
      });
  }).timeout(120000);

  it('should return the id of the Contract Uploaded without callbackUrl', done => {
    const sourceCode = fs.readFileSync('./test_data/testSmartContract.sol', 'utf8');

    blockchainiz.postEthereumContract(
      {
        language: 'solidity',
        sourceCode: sourceCode,
        parameters: [],
        name: 'testSmartContract',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        should.not.exist(err);
        done();
      },
    );
  }).timeout(20000);

  it('should response invalid parameters', done => {
    blockchainiz.postEthereumContract(
      {
        language: 3,
        sourceCode: 2,
        parameters: 'troll',
        name: 4,
        pushedCallback: 34,
        minedCallback: 12,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum contracts', () => {
  it('should return the Contract with the txid given', done => {
    blockchainiz.getEthereumContractsById({ contractId: scId }, (err, res) => {
      if (err) {
        console.log(err);
      }
      res.id.should.be.equal(scId);
      should.exist(res.abi);
      res.status.should.be.equal('mined');
      should.exist(res.status);
      res.language.should.be.equal('solidity');
      res.parameters.should.be.deepEqual([20]);
      res.name.should.be.deepEqual('testSmartContract');
      should.exist(res.infosCompilation);
      should.exist(res.etherPrice);
      should.exist(res.timestampsInMs.apiRequest);
      should.exist(res.timestampsInMs.pushedInBlockchain);
      should.exist(res.timestampsInMs.minedInBlockchain);
      should.exist(res.timestampsInMs.response);
      should.exist(res.gasPriceInWei);
      should.not.exist(err);
      done();
    });
  });

  it('should response invalid parameters', done => {
    blockchainiz.getEthereumContractsById({ contractId: 2 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.message.should.be.equal('invalid parameters');
      should.not.exist(res);
      done();
    });
  });
});

describe('GET Ethereum contracts list', () => {
  it('should return the list of the user Contract ', done => {
    blockchainiz.getEthereumContractsList(
      {
        page: 1,
        perPage: 20,
        sortBy: 'status',
        sortOrder: 'asc',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.not.exist(err);
        done();
      },
    );
  });

  it('should response invalid parameters', done => {
    blockchainiz.getEthereumContractsList(
      {
        page: 'toto',
        perPage: 'toto',
        sortBy: 'titi',
        sortOrder: 'tata',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('Error by blockchainiz: "page" must be a number');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum call function constant', () => {
  it('should return the execution of the function', done => {
    blockchainiz.callEthereumConstantFunction(
      {
        contractId: scId,
        functionName: 'getStatus',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        res.data.status.should.be.equal('20');
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return the execution of the function', done => {
    blockchainiz.callEthereumConstantFunction(
      {
        contractId: scId,
        functionName: 'get',
        functionParameters: [],
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        res.data.a.should.be.equal('0x2bc2239448959a1ae54747c28827b2ad7d20006c');
        res.data.b.should.be.equal('20');
        res.data[2].should.be.equal('0.0.1');
        should.not.exist(err);
        done();
      },
    );
  });

  it('should response invalid parameters', done => {
    blockchainiz.callEthereumConstantFunction(
      {
        contractId: 'toto',
        functionName: 1,
        functionParameters: 'lol',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum call function no constant', () => {
  it('should return the id of the transaction to call the no constant function', () => {
    return postBin
      .getUrl()
      .then(data => {
        blockchainiz.callEthereumNoConstantFunction(
          {
            contractId: scId,
            functionName: 'setStatus',
            functionParameters: [10],
            pushedCallback: data.url + '?type=pushed',
            minedCallback: data.url + '?type=mined',
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            functionId = res.id;
            should.exist(res.id);
            should.not.exist(err);
          },
        );
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(functionId);
        data.query.type.should.be.equal('pushed');
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        data.body.id.should.be.equal(functionId);
        data.query.type.should.be.equal('mined');
        return postBin.deleteBin(data.binId);
      });
  }).timeout(120000);

  it('should return the id of the transaction to call the no constant function without callback', done => {
    blockchainiz.callEthereumNoConstantFunction(
      {
        contractId: scId,
        functionName: 'setStatus',
        functionParameters: [10],
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should response invalid parameters', done => {
    blockchainiz.callEthereumNoConstantFunction(
      {
        contractId: 'toto',
        functionName: 1,
        functionParameters: 2,
        pushedCallback: 3,
        minedCallback: 4,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum no constant function', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumNoConstantFunctionById({ functionId }, (err, res) => {
      if (err) {
        console.log(err);
      }
      res.id.should.be.equal(functionId);
      res.contract.should.be.equal(scId);
      should.exist(res.txid);
      res.functionName.should.be.equal('setStatus');
      res.functionParameters.should.be.deepEqual([10]);
      res.status.should.be.equal('mined');
      should.exist(res.pushedCallback);
      should.exist(res.minedCallback);
      should.exist(res.blockHash);
      should.exist(res.blockNumber);
      should.exist(res.gasUsed);
      should.exist(res.gasLimit);
      should.exist(res.gasPriceInWei);
      should.exist(res.timestampsInMs.apiRequest);
      should.exist(res.timestampsInMs.pushedInBlockchain);
      should.exist(res.timestampsInMs.minedInBlockchain);
      should.exist(res.timestampsInMs.response);
      should.exist(res.etherPrice);
      should.not.exist(err);
      done();
    });
  });

  it('should return invalid parameters', done => {
    blockchainiz.callEthereumConstantFunction({ functionId: 666 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.message.should.be.equal('invalid parameters');
      should.not.exist(res);
      done();
    });
  });
});

describe('GET Ethereum no constant function list', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumNoConstantFunctionList(
      {
        page: 1,
        perPage: 3,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should(res.length).be.equal(3);
        res[0].should.be.an.instanceOf(Object);
        should.exist(res[0].id);
        should.exist(res[0].status);
        should.exist(res[0].timestampsInMs.response);
        should.exist(res[0].timestampsInMs.minedInBlockchain);
        should.exist(res[0].timestampsInMs.pushedInBlockchain);
        should.exist(res[0].timestampsInMs.apiRequest);
        should.exist(res[0].etherPrice);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumNoConstantFunctionList(
      {
        page: 'toto',
        perPage: 'titi',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('Error by blockchainiz: "page" must be a number');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum subscribe event', () => {
  it('should return the mongo object about the id given', () => {
    return postBin
      .getUrl()
      .then(data => {
        blockchainiz.subscribeEthereumEvent(
          {
            eventName: 'statusChange',
            callbackUrl: data.url + '?type=event',
            contractId: scId,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            }
            subscriptionId = res.id;
            should.exist(res.id);
            should.not.exist(err);

            // call function for triggers event, not need because after teste call the function
            // blockchainiz.callEthereumNoConstantFunction(
            //   {
            //     contractId: scId,
            //     functionName: 'setStatus',
            //     functionParameters: [30],
            //   },
            //   () => {},
            // );
          },
        );
        return postBin.waitRequest(data.binId);
      })
      .then(data => {
        should.exist(data.body.eventId);
        eventId = data.body.eventId;
        data.query.type.should.be.equal('event');
        return postBin.deleteBin(data.binId);
      });
  }).timeout(120000);

  it('should return invalid parameters', done => {
    blockchainiz.subscribeEthereumEvent(
      {
        eventName: undefined,
        callbackUrl: null,
        contractId: 10,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('DELETE Ethereum unsubscribe event', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.unsubscribeEthereumEvent(
      {
        contractId: scId,
        subscriptionId: subscriptionId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.not.exist(res);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.unsubscribeEthereumEvent(
      {
        contractId: undefined,
        subscriptionId: null,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum subscription', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumSubscribtion(
      {
        contractId: scId,
        subscriptionId: subscriptionId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        res.contract.should.be.equal(scId);
        should.exist(res.contract);
        res.eventName.should.be.equal('statusChange');
        should.exist(res.eventName);
        should.exist(res.enabled);
        should.exist(res.callback);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumSubscribtion(
      {
        contractId: undefined,
        subscriptionId: null,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum event by subscription', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumEventsBySubscription(
      {
        contractId: scId,
        subscriptionId: subscriptionId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        // TODO: test contente
        should.exist(res);
        res.should.be.an.Array();
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumEventsBySubscription(
      {
        contractId: undefined,
        subscriptionId: null,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum event', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumEvent(
      {
        contractId: scId,
        eventId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        res.id.should.be.equal(eventId);
        should(res.parameters[0]['_adresse']).be.equal(
          '0x8f136c013b1c541a7971c9dfbd0866c60f362f0a',
        );
        should(res.parameters[0]['_status']).be.equal('10');
        res.contract.should.be.equal(scId);
        res.id.should.be.equal(eventId);
        should(res.blockNumber).is.a.number;
        should.exist(res.blockHash);
        should.exist(res.transactionHash);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumEvent(
      {
        contractId: undefined,
        eventId: null,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum rawTransaction', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.postEthereumRawTransaction(
      {
        format: 'ascii',
        rawtransaction: 'toto',
        pushedCallback: '',
        minedCallback: '',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        rawTransactionId = res.id;
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return the mongo object about the id given', done => {
    blockchainiz.postEthereumRawTransaction(
      {
        format: 'ascii',
        rawtransaction: 'toto',
        pushedCallback: 'http://callback/test/pushed',
        minedCallback: 'http://callback/test/mined',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        rawTransactionId = res.id;
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return the mongo object about the id given without callback', done => {
    blockchainiz.postEthereumRawTransaction(
      {
        format: 'ascii',
        rawtransaction: 'toto',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.postEthereumRawTransaction(
      {
        format: null,
        rawtransaction: null,
        pushedCallback: null,
        pushedCallback: null,
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum rawTransaction', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumRawTransaction(
      { format: 'ascii', rawtransactionId: rawTransactionId },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should.exist(res.id);
        should.exist(res.data);
        should.exist(res.status);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumRawTransaction({ rawTransactionId: 6666 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.message.should.be.equal('invalid parameters');
      should.not.exist(res);
      done();
    });
  });
});

describe('GET Ethereum raw transaction list', () => {
  it('should return the raw transaction list', done => {
    blockchainiz.getEthereumRawTransactionList(
      {
        page: 1,
        perPage: 3,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should(res.length).be.equal(3);
        res[0].should.be.an.instanceOf(Object);
        should.exist(res[0].id);
        should.exist(res[0].data);
        should.exist(res[0].status);
        should.exist(res[0].timestampsInMs.apiRequest);
        should.exist(res[0].etherPrice);
        res[0].data.should.be.an.instanceOf(Object);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumRawTransactionList(
      {
        page: 'toto',
        perPage: 'titi',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.message.should.be.equal('Error by blockchainiz: "page" must be a number');
        should.not.exist(res);
        done();
      },
    );
  });
});
