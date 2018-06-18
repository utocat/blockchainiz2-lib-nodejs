const Helper = require('../helper');

exports.getNodes = opt => (callback) => {
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, {}, 'ethereum/nodes', 'GET', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.getContractsList = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.page !== 'number' ||
    typeof functionParameters.perPage !== 'number'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts?page=${functionParameters.page}&perPage=${functionParameters.perPage}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.postContracts = opt => (functionParameters, callback) => {
  // eslint-disable-line
  if (
    typeof functionParameters.language !== 'string' ||
    typeof functionParameters.sourceCode !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }
  let address;

  if (functionParameters.walletAddress) {
    address = functionParameters.walletAddress;
  }

  const rawBody = {
    language: functionParameters.language,
    sourceCode: functionParameters.sourceCode,
    parameters: functionParameters.parameters,
    name: functionParameters.name,
    address,
    pushedCallback: functionParameters.pushedCallback,
    minedCallback: functionParameters.minedCallback,
  };

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, rawBody, 'ethereum/contracts', 'POST', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.callContractsNoConstantFunction = opt => (functionParameters, callback) => {
  // eslint-disable-line
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.functionName !== 'string' ||
    !Array.isArray(functionParameters.functionParameters)
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }
  let minedCallback;
  let pushedCallback;
  let address;

  if (functionParameters.pushedCallback) {
    ({ pushedCallback } = functionParameters);
  }

  if (functionParameters.minedCallback) {
    ({ minedCallback } = functionParameters);
  }

  if (functionParameters.walletAddress) {
    address = functionParameters.walletAddress;
  }

  const rawBody = {
    functionParameters: functionParameters.functionParameters,
    address,
    pushedCallback,
    minedCallback,
  };
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    rawBody,
    `ethereum/contracts/${functionParameters.contractId}/noconstantfunction/${
      functionParameters.functionName
    }`,
    'POST',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.callContractsConstantFunction = opt => (parameters, callback) => {
  // eslint-disable-line
  if (
    typeof parameters.contractId !== 'string' ||
    typeof parameters.functionName !== 'string' ||
    !Array.isArray(parameters.functionParameters)
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    { functionParameters: parameters.functionParameters },
    `ethereum/contracts/${parameters.contractId}/constantfunction/${parameters.functionName}`,
    'POST',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getContractsById = opt => (functionParameters, callback) => {
  if (typeof functionParameters.contractId !== 'string') {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts/${functionParameters.contractId}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getNoConstantFuncById = opt => (functionParameters, callback) => {
  if (typeof functionParameters.functionId !== 'string') {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/noconstantfunction/${functionParameters.functionId}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getNoConstantFuncList = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.page !== 'number' ||
    typeof functionParameters.perPage !== 'number'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/noconstantfunction?page=${functionParameters.page}&perPage=${
      functionParameters.perPage
    }`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.subscribeEthereumEvent = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.eventName !== 'string' ||
    typeof functionParameters.callbackUrl !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {
      eventName: functionParameters.eventName,
      callback: functionParameters.callbackUrl,
    },
    `ethereum/contracts/${functionParameters.contractId}/subscribe`,
    'POST',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.unsubscribeEthereumEvent = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.subscriptionId !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts/${functionParameters.contractId}/subscribe/${
      functionParameters.subscriptionId
    }`,
    'DELETE',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getEthereumSubscribtion = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.subscriptionId !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts/${functionParameters.contractId}/subscribe/${
      functionParameters.subscriptionId
    }`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getEthereumEventsBySubscription = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.subscriptionId !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts/${functionParameters.contractId}/subscribe/${
      functionParameters.subscriptionId
    }/events`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getEthereumEvent = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.contractId !== 'string' ||
    typeof functionParameters.eventId !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/contracts/${functionParameters.contractId}/events/${functionParameters.eventId}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.postEthereumRawTransaction = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.format !== 'string' ||
    typeof functionParameters.rawtransaction !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  let minedCallback;
  let pushedCallback;

  if (functionParameters.pushedCallback) {
    ({ pushedCallback } = functionParameters);
  }

  if (functionParameters.minedCallback) {
    ({ minedCallback } = functionParameters);
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {
      format: functionParameters.format,
      rawtransaction: functionParameters.rawtransaction,
      pushedCallback,
      minedCallback,
    },
    'ethereum/rawtransactions',
    'POST',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getEthereumRawTransaction = opt => (functionParameters, callback) => {
  if (typeof functionParameters.rawtransactionId !== 'string') {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/rawtransactions/${functionParameters.rawtransactionId}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getEthereumRawTransactionList = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.page !== 'number' ||
    typeof functionParameters.perPage !== 'number'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/rawtransactions?page=${functionParameters.page}&perPage=${
      functionParameters.perPage
    }`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.getInfos = opt => (callback) => {
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, {}, 'ethereum/infos', 'GET', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.getWalletsList = opt => (callback) => {
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, {}, 'ethereum/wallets', 'GET', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};

exports.getWalletBalance = opt => (functionParameters, callback) => {
  if (
    typeof functionParameters.walletAddress !== 'string' ||
    typeof functionParameters.unit !== 'string'
  ) {
    callback(new Error('invalid parameters'), null);
    return;
  }

  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(
    opt,
    {},
    `ethereum/wallets/${functionParameters.walletAddress}/balance?unit=${functionParameters.unit}`,
    'GET',
    (err, res, body) => {
      /* istanbul ignore if */
      if (err) callback(err, null);
      else callback(null, body);
    },
  );
};

exports.postWallets = opt => (functionParameters, callback) => {
  // eslint-disable-line
  if (typeof functionParameters.default !== 'boolean') {
    callback(new Error('invalid parameters'), null);
    return;
  }

  const rawBody = {
    default: functionParameters.default,
  };
  // Do the request to blockchainiz via the helper function
  Helper.requestBlockchainiz(opt, rawBody, 'ethereum/wallets', 'POST', (err, res, body) => {
    /* istanbul ignore if */
    if (err) callback(err, null);
    else callback(null, body);
  });
};
