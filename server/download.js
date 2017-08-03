var request = require('request');
var fs = require('fs');
var Promise = require('promise');

var download = function(url, jar,path) {
  console.log('Downloading file '+path+' from url '+url);
  var promise = new Promise(function (resolve, reject){
    if(url.indexOf("passkey") !=-1){
      console.log('url contains passkey,  not using jar')
      jar =null;
    }
    var r = request({uri:url,jar:jar});
    r.on('response',  function (res) {
      try{
      var filename = res.headers['content-disposition'].replace(/attachment; filename=/g,'');
      console.log('starting file writing',path+filename);
      res.pipe(fs.createWriteStream(path+filename));
      res.on('end', function() {
        console.log('ending file writing',path+filename);
        resolve("File "+filename+" downloaded");
      });
      res.on('error',function(err){
        reject(err)
      })
    }catch(exception){
	console.log(exception);
      reject("Could not get filename", exception)
    }
  }
  );
    r.on('error',function(err){
      reject(err)
    })
  })
return promise;
}


module.exports = {download : download};
