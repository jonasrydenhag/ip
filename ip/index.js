#!/usr/bin/env node

'use strict';

var debug = require('debug')('ip');
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

(function(){
  module.exports.updateIp = updateIp;

  if (module.parent === null) {
    updateIp()
      .then(function () {
        process.exit();
      })
      .catch(function (ex) {
        debug(ex);
        process.exit(1);
      });
  }
})();
