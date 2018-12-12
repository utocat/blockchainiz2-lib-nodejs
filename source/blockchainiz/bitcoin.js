const Helper = require('../helper');
const url = require('url');

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
//     callback(new Error('invalid parameters'), null);
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
    typeof functionParameters.format !== 'string') {
    callback(new Error('invalid parameters'), null);
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
  const params = new url.URLSearchParams(functionParameters);

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `bitcoin/notaries?${params.toString()}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getBitcoinNotariesById = opt => (functionParameters, callback) => {
  const params = new url.URLSearchParams();

  if (typeof functionParameters.notariesId !== 'string') {
    callback(new Error('invalid parameters'), null);
    return;
  }
  if (functionParameters.format) {
    params.set('format', functionParameters.format);
  }
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `bitcoin/notaries/${functionParameters.notariesId}?${params.toString()}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getBitcoinInfos = opt => (callback) => {
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, {}, 'bitcoin/infos', 'GET', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};
