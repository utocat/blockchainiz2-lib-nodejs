const request = require('request');
const { queue } = require('async');

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
    const task = {
      opt,
      rawBody,
      path,
      method,
      retry,
      callback,
    };
    Helper.queue.push(task);
    // console.log(Helper.queue.length());
  }
}

Helper.queue = queue((task, callback) => {
  Jwt.getJWT(task.opt)
    .then((jwtToken) => {
      const nonce = Date.now();
      const message = `${nonce}${config.getApiUrl(task.opt.useSandbox)}${task.path}${JSON.stringify(task.rawBody)}`;
      const hmac = Hmac.generate(task.opt.privateKey, message);

      // make the request to blockchainiz
      request(
        {
          url: config.getApiUrl(task.opt.useSandbox) + task.path,
          headers: {
            'x-Api-Key': task.opt.publicKey,
            'x-Api-Signature': hmac,
            'x-Api-Nonce': nonce,
            Authorization: `bearer ${jwtToken}`,
          },
          method: task.method,
          json: true,
          body: task.rawBody,
        },
        (err, res, body) => {
          if (!err && res && res.statusCode > 399) {
            // if blockchainiz return an internal error catch and return then to the user
            if (body.message) {
              if (
                (body.message === 'invalid token' ||
                  body.message === 'no token' ||
                  body.message === 'application linked with jwt not found in db') &&
                  task.retry
              ) {
                // if we are there its because the jwt is invalid
                // then generate new jwt automatically
                Jwt.generateJWT(task.opt)
                  .then(() => {
                    // eslint-disable-next-line no-param-reassign
                    task.retry = false;
                    Helper.queue.push(task);
                    callback();
                  })
                  .catch((err3) => {
                    task.callback(err3);
                    callback();
                  });
                return;
              }
              const errBlockchainiz = new Error(`Error by blockchainiz: ${body.message}`);
              errBlockchainiz.code = res.statusCode;
              task.callback(errBlockchainiz, res, body);
              callback();
            } else {
              const errBlockchainiz = new Error('Error by blockchainiz: unknown');
              errBlockchainiz.code = res.statusCode;
              task.callback(errBlockchainiz, res, body);
              callback();
            }
          } else {
            task.callback(err, res, body);
            callback();
          }
        },
      );
    })
    .catch((err2) => {
      task.callback(err2);
      callback();
    });
});
module.exports = Helper;
