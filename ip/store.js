'use strict';

var firebase = require('firebase-admin');
var Promise = require('promise');

var serviceAccount = require('../hagarasp-firebase-adminsdk-6bylk-06c217afd2.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://hagarasp.firebaseio.com'
});

var db = firebase.database();
var ipsRef = db.ref("ips");

function storeIp(ip) {
  return new Promise(function (resolve) {
    ipsRef.push({
      ip: ip,
      createDate: firebase.database.ServerValue.TIMESTAMP
    });

    resolve();
  });
}

function getLastIp() {
  return new Promise(function (resolve) {
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
      });
  });
}

function detectIp() {
  return '10.0.0.0';
}

function storeCurrentIp() {
  var currentIp = detectIp();

  return new Promise(function (resolve) {
    getLastIp()
      .then(function (ip) {
        if (ip !== currentIp || ip === null) {
          storeIp(currentIp)
            .then(function () {
              console.log('Stored new IP', currentIp);
              resolve();
            });
        } else {
          console.log('Current IP is same as the last stored one', currentIp);
          resolve();
        }
      });
  });
}

storeCurrentIp()
  .then(function () {
    process.exit();
  });
