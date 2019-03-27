const request = require('request');
const basseUrl = 'https://postb.in';

function getUrl() {
  return new Promise((resolve, reject) => {
    request(
      {
        url: basseUrl + '/api/bin',
        method: 'POST',
        json: true,
      },
      (err, res, body) => {
        // console.log(body);
        if (res.statusCode === 201) {
          resolve({ url: basseUrl + '/' + body.binId, ...body });
        } else {
          reject(new Error('can not create postbin'));
        }
      },
    );
  });
}

function deleteBin(id) {
  return new Promise((resolve, reject) => {
    request(
      {
        url: basseUrl + '/api/bin/' + id,
        method: 'DELETE',
        json: true,
      },
      (err, res, body) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error('can not delete postbin'));
        }
      },
    );
  });
}

function waitRequest(id, callNumber = 0) {
  return new Promise((resolve, reject) => {
    waitRequestExecute(id, callNumber, resolve, reject);
  });
}

function waitRequestExecute(id, callNumber, resolve, reject) {
  callNumber++;
  // console.log(callNumber);
  if (callNumber >= 200) {
    reject(new Error('not call after 10min'));
    return;
  }
  // console.log(basseUrl + '/api/bin/' + id + '/req/shift');
  request(
    {
      url: basseUrl + '/api/bin/' + id + '/req/shift',
      method: 'GET',
      json: true,
    },
    (err, res, body) => {
      // console.log(body);
      if (body.msg === 'No requests in this bin' && res.statusCode === 404) {
        setTimeout(() => {
          waitRequestExecute(id, callNumber, resolve, reject);
        }, 2000);
      } else {
        if (res.statusCode === 200) {
          resolve(body);
        } else {
          reject(new Error('error for get request'));
        }
      }
    },
  );
}

module.exports = {
  getUrl,
  waitRequest,
  deleteBin,
};
