'use strict';

var debug = require('debug')('ip/storage');
var firebase = require('firebase-admin');
var Promise = require('promise');

var serviceAccount = require('../firebase-account.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hagarasp.firebaseio.com'
});

var db = firebase.database();
var ipsRef = db.ref("ips");

function pushIp(ip) {
  return ipsRef
    .push({
      ip: ip,
      createDate: firebase.database.ServerValue.TIMESTAMP
    });
}

function getLastIp() {
  return new Promise(function (resolve, reject) {
    ipsRef
      .orderByChild("createDate")
      .limitToLast(1)
      .once("value", function (snapshot) {
        if (snapshot.hasChildren() === true) {
          snapshot.forEach(function (data) {
            resolve(data.val().ip);
          });
        } else {
          resolve(null);
        }
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

function storeIp(ip) {
  return new Promise(function (resolve, reject) {
    getLastIp()
      .then(function (lastIp) {
        if (lastIp !== ip || lastIp === null) {
          pushIp(ip)
            .then(function () {
              debug('Stored new IP', ip);
              resolve();
            })
            .catch(function (ex) {
              reject(ex);
            });
        } else {
          debug('Current IP is same as the last stored one', ip);
          resolve();
        }
      })
      .catch(function (ex) {
        reject(ex);
      });
  });
}

module.exports = {
  store: storeIp
};
