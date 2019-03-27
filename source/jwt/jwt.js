const request = require('request');

const config = require('../config');
const Hmac = require('../hmac/hmac');

class Jwt {
  static getJWT(options) {
    if (Jwt.token) {
      return Promise.resolve(Jwt.token);
    }
    return Jwt.generateJWT(options).then(() => Promise.resolve(Jwt.token));
  }

  static generateJWT(options) {
    return new Promise((resolve, reject) => {
      const nonce = Date.now();
      // use the options publicKey to generate jwt from blockchainiz v2
      const rawBody = { apiPublicKey: options.publicKey };

      const message = `${nonce}${config.getApiUrl(
        options.useSandbox,
        options.url,
      )}authorize${JSON.stringify(rawBody)}`;

      const hmac = Hmac.generate(options.privateKey, message);

      // do the request to blockchainiz on POST /authorize route
      request(
        {
          url: `${config.getApiUrl(options.useSandbox, options.url)}authorize`,
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
            Jwt.token = body.authorizationToken;
            resolve(body.authorizationToken);
          } else {
            reject(body.message);
          }
        },
      );
    });
  }
}
Jwt.authorizationToken = false;
module.exports = Jwt;
