'use strict';

var detector = require('./lib/detector');
var storage = require('./lib/storage');

var currentIp = detector.detect();

storage.store(currentIp)
  .then(function () {
    process.exit();
  });
