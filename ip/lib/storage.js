'use strict';

var firebase = require('firebase-admin');
var Promise = require('promise');

var serviceAccount = require('../../hagarasp-firebase-adminsdk-6bylk-06c217afd2.json');

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

function storeIp(ip) {
  return new Promise(function (resolve, reject) {
    getLastIp()
      .then(function (lastIp) {
        if (lastIp !== ip || lastIp === null) {
          pushIp(ip)
            .then(function () {
              console.log('Stored new IP', ip);
              resolve();
            })
            .catch(function (ex) {
              reject(ex);
            });
        } else {
          console.log('Current IP is same as the last stored one', ip);
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
