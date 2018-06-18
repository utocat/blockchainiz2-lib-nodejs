const options = {
  sandboxUrl: 'https://api.blockchainiz.io/sandbox/v2/',
  prodUrl: 'https://api.blockchainiz.io/v2/',
};
const getApiUrl = (useSandbox) => {
  const apiUrl = useSandbox ? options.sandboxUrl : options.prodUrl;
  return apiUrl;
};

module.exports = {
  getApiUrl,
};
