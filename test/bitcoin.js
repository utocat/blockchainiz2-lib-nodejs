const should = require('should');
const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
});

describe('POST Bitcoin notaries', () => {
  it('should return mongoId of the new notaries posted', done => {
    blockchainiz.postBitcoinNotaries(
      {
        data: 'testToNotaries',
        format: 'ascii',
        callbackUrl: 'http://test/callback/notaries',
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
    blockchainiz.postBitcoinNotaries(
      {
        data: null,
        format: undefined,
        callbackUrl: 3,
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

describe('GET Bitcoin notaries', () => {
  it('should return mongoId of the new notaries posted', done => {
    blockchainiz.getBitcoinNotariesList(
      {
        page: 1,
        perPage: 3,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
        should(res.length).be.equal(3);
        should.exist(res[0].id);
        should.exist(res[0].data);
        should.exist(res[0].callback);
        should.exist(res[0].transactionHash);
        should.not.exist(err);
        done();
      },
    );
  });

  it('should return invalid parameters', done => {
    blockchainiz.getBitcoinNotariesList(
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

describe('GET Bitcoin infos', () => {
  it('should return bitcoin prices', done => {
    blockchainiz.getBitcoinInfos((err, res) => {
      if (err) {
        console.log(err);
      }
      should.exist(res.bitcoinPrice);
      should.exist(res.timestamp);
      should.not.exist(err);
      done();
    });
  });
});

/// Tests /////////////////////////////////////////////////////////////////////
// test are commented because the bitcoin route are not finish on the api

// describe('GET Bitcoin nodes infos',() => {
//   it('should return infos about the Bitcoin node used by the API', (done) => {
//     blockchainiz.getBitcoinNodes((err, data) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(data);
//       done();
//     });
//   });
// });
//
// describe('GET Bitcoin transaction by txid',() => {
//   it('should return infos about the transactions',(done) => {
//     blockchainiz.getBitcoinTransactions('x12fec21789cehex', (err, data) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(data);
//       done();
//     });
//   });
// });
