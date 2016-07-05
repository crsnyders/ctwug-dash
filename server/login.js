var config = require('./config.js')
var request = require('request');
var Promise = require('promise');
var jar = request.jar();

var sessionJar ={};
var ttlogin = function(){
  var promise = new Promise(function (resolve, reject) {
    var response = request.post({uri:'http://torrents.ctwug.za.net/account-login.php', jar:jar ,form:config.login})
    response.on('response', function(response) {
          resolve(jar);
      })
      .on('error',function(){
        reject(err);
      })
  });
return promise
}

module.exports ={TTLogin : ttlogin};
