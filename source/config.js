const options = {
  sandboxUrl: 'https://preprod.api.blockchainiz.io/',
  prodUrl: 'https://api.blockchainiz.io/',
};

const getApiUrl = (useSandbox, url) => {
  if (url) {
    let urlOk = url;
    urlOk += url.endsWith('/') ? '' : '/';
    return urlOk;
  }
  const apiUrl = useSandbox ? options.sandboxUrl : options.prodUrl;
  return apiUrl;
};

module.exports = {
  getApiUrl,
};
