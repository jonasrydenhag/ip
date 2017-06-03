'use strict';

var detector = require('./lib/detector');
var Promise = require('promise');
var storage = require('./lib/storage');

function updateIp () {
  return new Promise(function (resolve, reject) {
    detector.detect()
      .then(function (ip) {
        storage.store(ip)
          .then(function () {
            resolve();
          })
          .catch(function (ex) {
            reject(ex);
          });
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

updateIp()
  .then(function () {
    process.exit();
  })
  .catch(function (ex) {
    console.log(ex);
    process.exit(1);
  });
