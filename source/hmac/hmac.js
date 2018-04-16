const crypto = require('crypto');

class Hmac {
  static generate(privateKey, message) {
    return crypto
      .createHmac('sha512', privateKey)
      .update(message)
      .digest('hex');
  }
}

module.exports = Hmac;
