var config = require('./config.js')
var restify = require('restify');
var ttlogin = require('./login.js')
var search = require('./search.js')
var rssList = require('./rss.js')
var Eiskaltdcpp =require('./eiskaltdcpp.js')
var TransmissionBridge =require('./transmissionBridge.js')
var downloader = require('./download.js')
var sessionJar = {};

var eiskaltdcpp = new Eiskaltdcpp(config.eiskaltdcpp)
var transmissionBridge = new TransmissionBridge(config.transmission);
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.gzipResponse());


server.get('/torrent/rss', function (req, res, next) {
  rssList.rss().then(function (result) {
    res.send(result)
  }).catch(function(error){
    res.send(500,error)
  });
  next();
});
server.post('/torrent/search', function (req, res, next){
ttlogin.TTLogin().then(function(jar){
  sessionJar = jar;
    search.search(req.params.searchString,sessionJar,req.params.page).then(function(result){
      res.send(result)
    }).catch(function(error){
      res.send(500,error)
    });
  }).catch(function(error){
    res.send(500,error)
  });
  next();
});
server.post('/torrent/download/', function (req, res, next){
    downloader.download(req.params.url,sessionJar,config.rest.defaultDownloadFolder).then(function(result){
      res.send(result)
    }).catch(function(error){
      res.send(500,error)
    });
  next();
});

//dc
server.post(/^\/dc\/(.+?)\/(.+)/ ,function(req, res, next){
  return eiskaltdcpp.methods(req.params[0],req.params[1],req.params).then(function(result){
    res.send(result);
  }).catch(function(error){
    res.send(500,error)
  });
  next();
})
//transmission
server.post(/^\/transmission\/(.+?)\/(.+)/ ,function(req, res, next){
  return transmissionBridge.methods(req.params[0],req.params[1],req.params).then(function(result){
    res.send(result);
  }).catch(function(error){
    res.send(500,error)
  });
  next();
})





//server.get('/download/:id',rssDownload)

server.listen(config.rest.port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
