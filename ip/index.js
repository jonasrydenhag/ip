'use strict';

var detector = require('./lib/detector');
var Promise = require('promise');
var storage = require('./lib/storage');

function updateIp () {
  return new Promise(function (resolve) {
    detector.detect()
      .then(function (ip) {
        storage.store(ip)
          .then(function () {
            resolve();
          });
      });
  });
}

updateIp()
  .then(function () {
    process.exit();
  });
