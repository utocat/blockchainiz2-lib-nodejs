const request = require('request');

const config = require('./config');

const Jwt = require('./jwt/jwt');
const Hmac = require('./hmac/hmac');

class Helper {
  /**
   * Perform an HTTP request on Blockchainiz
   * @param {Object} opt The options provided by the user
   * @param {object} rawBody Data to send inside of the request
   * @param {string} path Path of the URL after blockchainiz
   * @param {string} method HTTP verb to use
   * @param {function} callback Function to call back with the result
   * @return {none} none
   */

  static requestBlockchainiz(opt, rawBody, path, method, callback, retry = true) {
    // Get jwt Token to perform blockchainiz request
    const jwtTokenP = Jwt.getJWT(opt);

    // a number that will always be higher than the last one when calling the blockchainiz API

    jwtTokenP
      .then((jwtToken) => {
        const nonce = Date.now();
        const message = `${nonce}${config.getApiUrl(opt.useSandbox)}${path}${JSON.stringify(
          rawBody,
        )}`;
        const hmac = Hmac.generate(opt.privateKey, message);

        // make the request to blockchainiz
        request(
          {
            url: config.getApiUrl(opt.useSandbox) + path,
            headers: {
              'x-Api-Key': opt.publicKey,
              'x-Api-Signature': hmac,
              'x-Api-Nonce': nonce,
              Authorization: `bearer ${jwtToken}`,
            },
            method,
            json: true,
            body: rawBody,
          },
          (err, res, body) => {
            if (!err && res && res.statusCode > 399) {
              // if blockchainiz return an internal error catch and return then to the user
              if (body.message) {
                if (
                  (body.message === 'invalid token' ||
                    body.message === 'no token' ||
                    body.message === 'application linked with jwt not found in db') &&
                  retry
                ) {
                  // if we are there its because the jwt is invalid
                  // then generate new jwt automatically
                  Jwt.generateJWT(opt)
                    .then(() => {
                      Helper.requestBlockchainiz(opt, rawBody, path, method, callback, false);
                    })
                    .catch(callback);
                  return;
                }
                const errBlockchainiz = new Error(`Error by blockchainiz: ${body.message}`);
                errBlockchainiz.code = res.statusCode;
                callback(errBlockchainiz, res, body);
              } else {
                const errBlockchainiz = new Error('Error by blockchainiz: unknown');
                errBlockchainiz.code = res.statusCode;
                callback(errBlockchainiz, res, body);
              }
            } else {
              callback(err, res, body);
            }
          },
        );
      })
      .catch(callback);
  }
}

module.exports = Helper;
