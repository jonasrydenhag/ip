'use strict';

var publicIp = require('public-ip');

function detectIp() {
  return publicIp.v4({ "https": true });
}

module.exports = {
  detect: detectIp
};
