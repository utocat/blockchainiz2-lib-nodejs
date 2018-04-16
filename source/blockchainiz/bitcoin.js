const Helper = require('../helper');

// exports.getNodes = opt => (callback) => {
//   // Do the request to blockchainiz via the helper function
//   Helper.requestBlockchainiz(
//     opt,
//     {},
//     'bitcoin/nodes',
//     'GET',
//     (err, res, body) => {
//       /* istanbul ignore if */
//       if (err) callback(err, null);
//       else callback(null, body);
//     });
// };
//
// exports.getTransactionsByTxid = opt => (txid, callback) => {
//   // Check the txid parameter
//   if (typeof txid !== 'string') {
//     callback('invalid parameters', null);
//     return;
//   }
//
//   // Do the request to blockchainiz via the helper function
//   Helper.requestBlockchainiz(
//     opt,
//     {},
//     `bitcoin/transactions/${txid}`,
//     'GET',
//     (err, res, body) => {
//       /* istanbul ignore if */
//       if (err) callback(err, null);
//       else callback(null, body);
//     });
// };

exports.postBitcoinNotaries = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.data !== 'string' ||
    typeof functionParameters.format !== 'string' ||
    typeof functionParameters.callbackUrl !== 'string'
  ) {
    callback('invalid parameters', null);
    return;
  }

  const rawBody = {
    data: functionParameters.data,
    format: functionParameters.format,
    callback: functionParameters.callbackUrl,
  };

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, rawBody, 'bitcoin/notaries', 'POST', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.getBitcoinNotariesList = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.page !== 'number' ||
    typeof functionParameters.perPage !== 'number'
  ) {
    callback('invalid parameters', null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `bitcoin/notaries?page=${functionParameters.page}&perPage=${functionParameters.perPage}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};
