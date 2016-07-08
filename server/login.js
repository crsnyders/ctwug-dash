var config = require('./config.js')
var request = require('request');
var Promise = require('promise');
var jar = request.jar();
var urlBase = 'http://torrents.ctwug.za.net/account-login.php';
//var urlBase = 'http://127.0.0.1:8080/torrents/account-login.php';
var sessionJar ={};
var ttlogin = function(){
  var promise = new Promise(function (resolve, reject) {
    var response = request.post({uri:urlBase, jar:jar ,form:config.login})
    response.on('response', function(response) {
          resolve(jar);
      })
      .on('error',function(err){
        reject(err);
      })
  });
return promise
}

module.exports ={TTLogin : ttlogin};
