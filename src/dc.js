
//var response =request.post('http://127.0.0.1:3121',{"jsonrpc" : "2.0", "method" : "show.version", "id" : 43388 }).on('response', rsponsePrint)
//magnet:? xl = [Size in Bytes] & dn = [file name (URL encoded)] & xt = urn: tree: tiger: [ TTH hash (Base32) ]
var request = require('request');

var id = Math.round(Math.random()*Math.pow(2, 16));
var separator =',';
var enc = 'UTF-8';
var huburl = 'dchub.ctwug.za.net';
var nick = 'Mamemos';
var searchstring = 'masterchef';

function makeMagnet(xt,xl,dn){
  dn = encodeURIComponent(dn);
  return `magnet:?xt=urn:tree:tiger:${xt}&xl=${xl}&dn=${dn}`;
}
var magnet  = makeMagnet('XKATOHBWOE3O7NTPGYVAN76PHWQFKFK2VHDAK4Q','1522627568','The.33.2015.HDRip.XviD.AC3-EVO.avi')
var directory = '/home/media/Downloads'

var searchsend =			{jsonrpc : "2.0",'id':id,method:'search.send',params:{'searchstring':searchstring,'huburl':huburl}}
var searchgetresults ={jsonrpc : "2.0",'id':id,method:'search.getresults',params:{'huburl':huburl}}
var magnetadd = 			{jsonrpc : "2.0",'id':id,method:'magnet.add',params:{'magnet':magnet,'directory':directory}}
var qlist = 					{jsonrpc : "2.0",'id':id,method:'queue.list'}
var qlisttargets = 		{jsonrpc : "2.0",'id':id,method:'queue.listtargets'}
var queueclear = 			{jsonrpc : "2.0",'id':id,method:'queue.clear'}
var qremove = 				{jsonrpc : "2.0",'id':id,method:'queue.remove',params:{'target':'/home/media/test'}}
var searchclear =			{jsonrpc : "2.0",'id':id,method:'search.clear',params:{'huburl':huburl}}
var queuegetiteminfo = {jsonrpc : "2.0",'id':id,method:'queue.getiteminfo',params:{'target':'/home/media/Parks and Recreation - S07E10 - HDTV x264-LOL.mp4'}}
var hubgetchat = 			{jsonrpc : "2.0",'id':id,method:'hub.getchat',params:{'huburl':huburl,'separator':separator}}

var resp =request(
    { method: 'POST',
     uri: 'http://127.0.0.1:3121',
     json :searchgetresults
  }
  , function (error, response, body) {
        console.log(body.result)
    }
  )
