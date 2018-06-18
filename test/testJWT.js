const should = require('should');
const fs = require('fs');
const Jwt = require('../source/jwt/jwt');
//
// try {
//   fs.unlinkSync(__dirname + '/../source/jwt/jwtStore.json');
// } catch (ex) {
//   console.log(ex);
// }

const blockchainiz = require('../index.js')({
  publicKey: process.env.API_PUBLIC_KEY,
  privateKey: process.env.API_PRIVATE_KEY,
  useSandbox: true,
});

describe('test generate jwt', () => {
  it('write invalid jwt', done => {
    // add wrong cache
    fs.writeFileSync(
      `${__dirname}/../source/jwt/jwtStore.json`,
      JSON.stringify({ jwt: 'AzErTyUiOp' }),
    );
    blockchainiz.getEthereumNodes((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      done();
    });
  });
  it('remove jwt', done => {
    // remove memory cache
    Jwt.authorizationToken = false;
    // remove file cache
    fs.unlinkSync(__dirname + '/../source/jwt/jwtStore.json');
    blockchainiz.getEthereumNodes((err, res) => {
      if (err) {
        console.log(err);
      }
      should.not.exist(err);
      // remove memory cache
      Jwt.authorizationToken = false;
      // remove file cache
      fs.unlinkSync(__dirname + '/../source/jwt/jwtStore.json');
      done();
    });
  });
});
