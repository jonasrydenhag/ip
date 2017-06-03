'use strict';

var detector = require('./lib/detector');
var storage = require('./lib/storage');

function updateIp () {
  var currentIp = detector.detect();

  return storage.store(currentIp);
}

updateIp()
  .then(function () {
    process.exit();
  });
