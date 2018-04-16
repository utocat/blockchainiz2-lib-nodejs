const fs = require('fs');
const request = require('request');

const config = require('../config');
const Hmac = require('../hmac/hmac');

class Jwt {
  static getJWT() {
    // if jwt Store file not exist create then
    if (!fs.existsSync(`${__dirname}/jwtStore.json`)) {
      fs.writeFileSync(`${__dirname}/jwtStore.json`, JSON.stringify({ jwt: '' }));
    }

    const jwtStored = fs.readFileSync(`${__dirname}/jwtStore.json`, 'utf8');

    // convert jwtStore file to and usable js object
    const authorizationToken = JSON.parse(jwtStored);

    // return the jwt
    return authorizationToken.jwt;
  }

  static generateJWT(options, callback) {
    const nonce = Date.now();

    // use the options publicKey to generate jwt from blockchainiz v2
    const rawBody = { apiPublicKey: options.publicKey };

    const message = `${nonce}${config.getApiUrl(options.useSandbox)}authorize${JSON.stringify(
      rawBody,
    )}`;

    const hmac = Hmac.generate(options.privateKey, message);

    // do the request to blockchainiz on POST /authorize route
    request(
      {
        url: `${config.getApiUrl(options.useSandbox)}authorize`,
        headers: {
          'Content-Type': 'application/json',
          'x-Api-Signature': hmac,
          'x-Api-Nonce': nonce,
        },
        method: 'POST',
        json: true,
        body: rawBody,
      },
      (err, res, body) => {
        /* istanbul ignore if */
        if (err) {
          callback(err);
        } else if (res.statusCode === 200) {
          const newAuthorizationToken = {
            jwt: body.authorizationToken,
          };

          // convert return to a stringify json object
          const authorizationTokenStringified = JSON.stringify(newAuthorizationToken);

          // then write it on jwt Store file
          fs.writeFileSync(`${__dirname}/jwtStore.json`, authorizationTokenStringified);

          callback(null);
        }
      },
    );
  }
}

module.exports = Jwt;
