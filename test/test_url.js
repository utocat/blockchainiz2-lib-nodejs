const should = require('should');
const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
  url: 'https://preprod.api.blockchainiz.io',
});

const blockchainiz2 = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
  url: 'https://preprod.api.blockchainiz.io/',
});

describe('Test it works with / and no / at end of the given blockchainiz api url', () => {
  it('should return infos about ethereum without /', done => {
    blockchainiz.getEthereumInfos((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      done();
    });
  });
  it('should return infos about ethereum with /', done => {
    blockchainiz2.getEthereumInfos((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      done();
    });
  });
});
