var ttlogin = require('./login.js')
var search = require('./search.js')
var config = require('./config.js')
var Eiskaltdcpp =require('./eiskaltdcpp.js')
var TransmissionBridge = require('./transmissionBridge.js');
var Transmission = require('transmission');
ttlogin.TTLogin().then(function(jar){
    search.search('hell on wheels',jar).then(function(result){
      console.log(result);
      for (var link in result.pages) {
        console.log(result.pages[link]);
        }
    }).catch(function(err){
      console.log(err);
    })
  });

  //var eiskaltdcpp = new Eiskaltdcpp(config.eiskaltdcpp)
  //eiskaltdcpp.queueList().catch(function(error){console.log("error",error);}).then(function(response){console.log("success",response);})
  //var transmissionBridge = new TransmissionBridge(config.transmission);
  //transmissionBridge.all().then(function(result){console.log(result);}).catch(function(error){console.error(error);})
