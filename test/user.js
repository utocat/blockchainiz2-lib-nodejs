const should = require('should');
const fs = require('fs');
const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
});
const postBin = require('./lib/postbin');
const gasPrice = Math.round(Date.now() / 10);
console.log(gasPrice);

describe('GET User', () => {
  it('should return user preferences', done => {
    blockchainiz.getUser((err, res) => {
      if (err) {
        console.log(err);
      }
      res.defaultWalletAddress.should.be.a.String();
      res.wallets.should.be.an.Array();
      should.not.exist(err);
      done();
    });
  });
});

describe('PATCH User', () => {
  it('should update the gasPriceDefault for an user', done => {
    blockchainiz.patchUser({ defaultGasPrice: gasPrice }, (err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      blockchainiz.getUser((err2, res2) => {
        if (err2) {
          console.log(err2);
        }
        res2.defaultWalletAddress.should.be.a.String();
        res2.wallets.should.be.an.Array();
        Number.parseInt(res2.defaultGasPrice).should.be.equal(Number.parseInt(gasPrice));
        should.not.exist(err);
        done();
      });
    });
  });
});
