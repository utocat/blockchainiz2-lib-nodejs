const Helper = require('../helper');

exports.getUser = opt => (callback) => {
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, {}, 'users/', 'GET', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.patchUser = opt => (functionParameters, callback) => {
  const rawBody = {
    defaultGasPrice: functionParameters.defaultGasPrice,
  };
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, rawBody, 'users/', 'PATCH', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};
