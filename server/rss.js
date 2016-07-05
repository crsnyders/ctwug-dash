var feed = require('feed-read-parser');
var Promise = require('promise');
var config = require('./config.js')


function rss(){
  var promise =  new Promise(function (resolve, reject) {
  feed(config.rss.url,function(err,torrents){
        if(err){
          reject(err);
        }else {
          resolve(torrents);
        }
      })
    })
    return promise;
}

module.exports = {rss :rss};
