module.exports = config = [{
  method : "GET",
  path : "/dc/show/version",
  handler : function(req, res, next){
    eiskaltdcpp.showVersion().then(function(result){console.log(result);})
  }
},{}];
