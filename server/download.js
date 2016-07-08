var request = require('request');
var fs = require('fs');
var Promise = require('promise');
var regexp = /filename=(.*)/gi;

var download = function(url, jar,path) {
  console.log('Downloading file '+path+' from url '+url);
  var promise = new Promise(function (resolve, reject){
    if(url.indexOf("passkey") !=-1){
      jar =null;
    }
    var r = request({uri:url,jar:jar});
    r.on('response',  function (res) {
      var filename = regexp.exec( res.headers['content-disposition'])[1];
      console.log('starting file writing',path+filename);
      res.pipe(fs.createWriteStream(path+filename));
      res.on('end', function() {
        console.log('ending file writing',path+filename);
        resolve("File "+filename+" downloaded");
      });
      res.on('error',function(err){
        reject(err)
      })
    });
    r.on('error',function(err){
      reject(err)
    })
  })
return promise;
}


module.exports = {download : download};
