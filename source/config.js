const options = {
  sandboxUrl: 'https://qualif.api.blockchainiz.io/v2/testnet/',
  prodUrl: 'https://preprod.api.blockchainiz.io/v2/testnet/',
};

const getApiUrl = (useSandbox) => {
  const apiUrl = useSandbox ? options.sandboxUrl : options.prodUrl;
  return apiUrl;
};

module.exports = {
  getApiUrl,
};
