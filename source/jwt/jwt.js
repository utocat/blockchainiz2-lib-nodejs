const fs = require('fs');
const request = require('request');

const config = require('../config');
const Hmac = require('../hmac/hmac');

class Jwt {
  static getJWT(options) {
    if (Jwt.authorizationToken && Jwt.authorizationToken.jwt) {
      return Promise.resolve(Jwt.authorizationToken.jwt);
    }
    try {
      // if jwt Store file not exist create then
      if (!fs.existsSync(`${__dirname}/jwtStore.json`)) {
        return Jwt.generateJWT(options);
      }

      const jwtStored = fs.readFileSync(`${__dirname}/jwtStore.json`, 'utf8');

      // convert jwtStore file to and usable js object
      Jwt.authorizationToken = JSON.parse(jwtStored);
    } catch (e) {
      return Promise.reject(e);
    }

    // return the jwt
    return Promise.resolve(Jwt.authorizationToken.jwt);
  }

  static generateJWT(options) {
    return new Promise((resolve, reject) => {
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
            reject(err);
          } else if (res.statusCode === 200) {
            Jwt.authorizationToken = {
              jwt: body.authorizationToken,
            };

            // convert return to a stringify json object
            const authorizationTokenStringified = JSON.stringify(Jwt.authorizationToken);

            // then write it on jwt Store file
            fs.writeFileSync(`${__dirname}/jwtStore.json`, authorizationTokenStringified);

            resolve(body.authorizationToken);
          }
        },
      );
    });
  }
}
Jwt.authorizationToken = false;
module.exports = Jwt;
