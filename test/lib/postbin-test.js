const postBin = require('./postbin');

postBin
  .getUrl()
  .then(data => {
    console.log(data);
    return postBin.waitRequest(data.binId);
  })
  .then(data => {
    console.log(data);
    return postBin.deleteBin(data.binId);
  })
  .then(console.log)
  .catch(console.log);
