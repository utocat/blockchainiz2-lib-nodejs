const should = require('should');
const fs = require('fs');
const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
});

let scId;
let functionId;
let rawTransactionId;
let subscriptionId;
/// Tests /////////////////////////////////////////////////////////////////////

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
  it('should return the id of the Contract Uploaded', done => {
    const sourceCode = fs.readFileSync('./test_data/testSmartContract.sol', 'utf8');

    const testStatus = () => {
      blockchainiz.getContractsById({ contractId: scId }, (errored, responsed) => {
        if (errored) {
          done(errored);
        }
        if (responsed.status === 'mined') {
          done();
        } else {
          setTimeout(testStatus, 5000);
        }
      });
    };

    blockchainiz.postEthereumContract(
      {
        language: 'solidity',
        sourceCode: sourceCode,
        parameters: [],
        name: 'testSmartContract',
        pushedCallback: 'http://test/pushedCallback',
        minedCallback: 'http://test/minedCallback',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        scId = res.id;
        should.exist(res.id);
        should.not.exist(err);
        setTimeout(testStatus, 5000);
      },
    );
  }).timeout(50000);

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
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum contracts', () => {
  it('should return the Contract with the txid given', done => {
    blockchainiz.getContractsById({ contractId: scId }, (err, res) => {
      if (err) {
        console.log(err);
      }
      res.id.should.be.equal(scId);
      should.exist(res.abi);
      res.status.should.be.equal('mined');
      should.exist(res.status);
      should.exist(res.language);
      should.not.exist(err);
      done();
    });
  });

  it('should response invalid parameters', done => {
    blockchainiz.getContractsById({ contractId: 2 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.should.be.equal('invalid parameters');
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
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum call function constant', () => {
  it('should return the execution of the function', done => {
    blockchainiz.callEthereumConstantFunc(
      {
        contractId: scId,
        functionName: 'getStatus',
        functionParameters: [],
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        res.data.status.should.be.equal('0');
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return the execution of the function', done => {
    blockchainiz.callEthereumConstantFunc(
      {
        contractId: scId,
        functionName: 'get',
        functionParameters: [],
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        res.data.a.should.be.equal('0x0000000000000000000000000000000000000000');
        res.data.b.should.be.equal('0');
        res.data[2].should.be.equal('0.0.1');
        should.not.exist(err);
        done();
      },
    );
  });

  it('should response invalid parameters', done => {
    blockchainiz.callEthereumConstantFunc(
      {
        contractId: 'toto',
        functionName: 1,
        functionParameters: 'lol',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum call function no constant', () => {
  it('should return the id of the transaction to call the no constant function', done => {
    blockchainiz.callEthereumNoConstantFunc(
      {
        contractId: scId,
        functionName: 'setStatus',
        functionParameters: [10],
        pushedCallback: 'http://test/pushedCallback',
        minedCallback: 'http://test/minedCallback',
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        functionId = res.id;
        should.exist(res.id);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return the id of the transaction to call the no constant function without callback', done => {
    blockchainiz.callEthereumNoConstantFunc(
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
    blockchainiz.callEthereumNoConstantFunc(
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
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum no constant function', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getNoConstantFuncById({ functionId }, (err, res) => {
      if (err) {
        console.log(err);
      }
      should.exist(res.id);
      should.exist(res.status);
      should.exist(res.pushedCallback);
      should.exist(res.minedCallback);
      should.exist(res.timestampsInMs.requestAPI);
      should.exist(res.etherPrice);
      should.not.exist(err);
      done();
    });
  });

  it('should return invalid parameters', done => {
    blockchainiz.getNoConstantFuncById({ functionId: 666 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.should.be.equal('invalid parameters');
      should.not.exist(res);
      done();
    });
  });
});

describe('GET Ethereum no constant function list', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getNoConstantFuncList(
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
        should.exist(res[0].functionName);
        should.exist(res[0].functionParameters);
        should.exist(res[0].blockHash);
        should.exist(res[0].gasUsed);
        should.exist(res[0].timestampsInMs.requestAPI);
        should.exist(res[0].etherPrice);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getNoConstantFuncList(
      {
        page: 'toto',
        perPage: 'titi',
      },
      (err, res) => {
        if (res) {
          console.log(res);
        }
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('POST Ethereum subscribe event', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.subscribeEthereumEvent(
      {
        eventName: 'statusChange',
        callbackUrl: 'http://test/eventCallback',
        contractId: scId,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        subscriptionId = res.id;
        should.exist(res.id);
        should.not.exist(err);
        done();
      },
    );
  });

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
        err.should.be.equal('invalid parameters');
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
        err.should.be.equal('invalid parameters');
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
        err.should.be.equal('invalid parameters');
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
        err.should.be.equal('invalid parameters');
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
        eventId: subscriptionId,
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
        err.should.be.equal('invalid parameters');
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
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});

describe('GET Ethereum rawTransaction', () => {
  it('should return the mongo object about the id given', done => {
    blockchainiz.getEthereumRawTransaction({ rawtransactionId: rawTransactionId }, (err, res) => {
      if (err) {
        console.log(err);
      }
      should.exist(res.id);
      should.exist(res.data);
      should.exist(res.status);
      should.not.exist(err);
      done();
    });
  });

  it('should return invalid parameters', done => {
    blockchainiz.getEthereumRawTransaction({ rawTransactionId: 6666 }, (err, res) => {
      if (res) {
        console.log(res);
      }
      err.should.be.equal('invalid parameters');
      should.not.exist(res);
      done();
    });
  });
});

describe('GET Ethereum raw transaction list', () => {
  it('should return the mongo object about the id given', done => {
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
        should.exist(res[0].timestampsInMs.requestAPI);
        should.exist(res[0].timestampsInMs.pushedInBlockchain);
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
        err.should.be.equal('invalid parameters');
        should.not.exist(res);
        done();
      },
    );
  });
});
