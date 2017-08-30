var http = require('http');
var util = require('util');
var Promise = require('promise');
var events = require('events');


var Eiskaltdcpp = module.exports = function(options) {
  events.EventEmitter.call(this);
  this.options = options || {};
  this.url = this.options.url;
  this.host = this.options.host || 'localhost';
  this.port = this.options.port || 3121;
  this.key = null;
};
util.inherits(Eiskaltdcpp, events.EventEmitter);

Eiskaltdcpp.prototype.getId = function () {
  return Math.round(Math.random()*Math.pow(2, 16));
};
Eiskaltdcpp.prototype.makeMagnet = function (xt,xl,dn) {
  dn = encodeURIComponent(dn);
  return 'magnet:?xt=urn:tree:tiger:'+xt+'&xl='+xl+'&dn='+dn;
};

Eiskaltdcpp.prototype.searchSend = function (searchstring, huburl) {
var method = 'search.send';
var params = {'searchstring':searchstring,'huburl':huburl || this.options.huburl};
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.searchClear = function (huburl) {
var method = 'search.clear';
var params = {'huburl':huburl || this.options.huburl}
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.searchGetResults = function (huburl) {
var method = 'search.getresults';
var params = {'huburl':huburl || this.options.huburl}
var 			rspFields = ['CID','Connection','Exact Size','File Order','Filename','Free Slots','Hub','Hub URL','Icon','IP','Nick','Path','Real Size','Shared','Size','Slots','Slots Order','TTH','Type']
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.magnetAdd = function (magnet,directory) {
var method = 'magnet.add';
var params = {'magnet':magnet,'directory':directory || this.options.directory}
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.queueList = function () {
  var method = 'queue.list';
  var respFields = ['Added','Downloaded','Downloaded Sort','Errors','Exact Size','Filename','Path','Priority','Size','Size Sort','Status','Target','TTH','Users']
  return this.doQuery(method)
};

Eiskaltdcpp.prototype.daemonStop = function () {
  var method = 'daemon.stop';
  return this.doQuery(method)
};

Eiskaltdcpp.prototype.hubAdd = function (huburl,enc) {
var method = 'hub.add';
var params = {'huburl':huburl,'enc':enc|| this.options.enc}
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.hubDel = function (huburl) {
var method = 'hub.del';
var params = {'huburl':huburl}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubSay = function (message,huburl) {
var method = 'hub.say';
var params = {'huburl':huburl || this.options.huburl,'message':message}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubPm = function (nick,message,huburl) {
var method = 'hub.pm';
var params = {'huburl':huburl || this.options.huburl,'nick':nick,'message':message}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubGetChat = function (huburl,separator) {
var method = 'hub.getchat';
var params = {'huburl':huburl || this.options.huburl,'separator':separator || this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubList = function (separator) {
var method = 'hub.list';
var params = {'separator':separator || this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubListFullDesc = function (separator) {
var method = 'hub.listfulldesc';
var params = {'separator':separator || this.options.separator}
var 		respFields=['totalshare','connected','users','description','hubname']
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubGetUsers = function (huburl,separator) {
var method = 'hub.getusers';
var params = {'huburl':huburl,'separator':separator|| this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.hubGetUserInfo = function (nick,huburl) {
var method = 'hub.getuserinfo';
var params = {'huburl':huburl|| this.options.huburl,'nick':nick}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.shareAdd = function (directory,virtname) {
var method = 'share.add';
var params = {'directory':directory,'virtname':virtname}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.shareRename = function (directory,virtname) {
var method = 'share.rename';
var params = {'directory':directory,'virtname':virtname}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.shareDel = function (directory) {
var method = 'share.del';
var params = {'directory':directory}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.shareList = function (separator) {
var method = 'share.list';
var params = {'separator':separator || this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.shareRefresh = function () {
var method = 'share.refresh';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.listDownload = function (nick, huburl) {
var method = 'list.download';
var params = {'huburl':huburl || this.options.huburl,'nick':nick}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.showVersion = function () {
var method = 'show.version';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.showRatio = function () {
var method ='show.ratio';
var 			respFields = ['ratio','up','down']
return this.doQuery(method)
};
Eiskaltdcpp.prototype.queueSetPriority = function (target, priority) {
var method = 'queue.setpriority';
var params = {'target':target,'priority':priority}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.queueMove = function (source, target) {
var method = 'queue.move';
var params = {'target':target,'source':source}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.queueRemove = function (target) {
var method = 'queue.remove';
var params = {'target':target}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.queueListTargets = function () {
var method = 'queue.listtargets';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.queueGetSources = function (target,separator) {
  var method = 'queue.getsources';
  var params = {'target':target,'separator':separator || this.options.separator}
  var 			respFields = ['online','sources']
  return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.queueMatchlists = function () {
var method = 'queue.matchlists'
return this.doQuery(method)
};
Eiskaltdcpp.prototype.queueClear = function () {
var method = 'queue.clear';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.hashStatus = function () {
  var method = 'hash.status';
  var 			respFields = ['bytesleft','currentfile','filesleft','status']
  return this.doQuery(method)
};
Eiskaltdcpp.prototype.hashPause = function () {
var method = 'hash.pause';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.systemDescribe = function () {
var method = 'system.describe';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.settingsGetSet = function (key, value) {
var method = 'settings.getset';
var params = {'key': key, 'value':value};
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.listLocal = function (separator) {
var method = 'list.local';
var params = {'separator':separator|| this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.listOpen = function (filelist) {
var method = 'list.open';
var params = {'filelist':filelist}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.listClose = function (filelist) {
var method = 'list.close';
var params = {'filelist':filelist}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.listListOpened = function (separator) {
var method = 'list.listopened';
var params = {'separator':separator || this.options.separator}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.listCloseAll = function () {
var method = 'list.closeall';
return this.doQuery(method)
};
Eiskaltdcpp.prototype.listLsDir = function (filelist,directory) {
  var method = 'list.lsdir';
  var params = {'filelist':filelist, 'directory':directory}
  var 			respFields =['Name','Size preformatted']
  return this.doQuery(method,params)
};
//optional downloadto
Eiskaltdcpp.prototype.listDownloadFile = function (target,filelist,downloadto) {
var method = 'list.downloadfile';
var params = {'target':target,'filelist':filelist,'downloadto':downloadto}
return this.doQuery(method,params)
};
//optional downloadto
Eiskaltdcpp.prototype.listDownloadDir = function (target,filelist,downloadto) {
var method = 'list.downloaddir';
var params = {'target':target,'filelist':filelist,'downloadto':downloadto}
return this.doQuery(method,params)
};
Eiskaltdcpp.prototype.queueGetItemInfo = function (target) {
var method = 'queue.getiteminfo';
var params = {'target':target}
return this.doQuery(method,params)
};

Eiskaltdcpp.prototype.doQuery = function(method,params) {
  var self = this;
  var queryJsonify = JSON.stringify({jsonrpc : "2.0",'id':this.getId(),method:method,params:params});
  var options = {
    host: this.host,
    path: this.url,
    port: this.port,
    method: 'POST',
    headers: {
      'Time': new Date(),
      'Host': this.host + ':' + this.port,
      'X-Requested-With': 'Node',
      'Content-Length': queryJsonify.length,
      'Content-Type': 'application/json'
    }
  };
  if (this.authHeader) {
    options.headers.Authorization = this.authHeader;
  }
  return new Promise(function(resolve, reject){
  function onResponse(response) {
    var page = [];
    function onData(chunk) {
      page.push(chunk);
    }
    function onEnd() {
      var json,
          error;

      if (response.statusCode <= 300) {
        page = page.join('');
        try {
          json = JSON.parse(page);
        } catch (err) {
          return reject(err);
        }
        resolve(json);
      } else {
        reject(json);
      }
    }
    response.setEncoding('utf8');
    response.on('data', onData);
    response.on('end', onEnd);
  }
  var res = http.request(options, onResponse);
  res.on('error', reject).end(queryJsonify, 'utf8');
  })
};
Eiskaltdcpp.prototype.methods = function(method, action, params){

  switch (method) {
   case 'search': {
     switch(action){
    case 'send':{
      return this.searchSend(params['searchstring'], params['huburl'])
    }
    case 'clear':{
      return this.searchClear(params['huburl'])
    }
    case 'getresults':{
      return this.searchGetResults(params['huburl'])
    }
  }
  }
  case 'hub': {
    switch(action){
    case 'add': {
      return this.hubAdd(params['huburl'], params['enc'])
    }
    case 'del': {
      return this.hubDel(params['huburl'])
    }
    case 'say': {
      return this.hubSay(params['message'], params['huburl'])
    }
    case 'pm': {
      return this.hubPm(params['nick'], params['message'], params['huburl'])
    }
    case 'getchat': {
      return this.hubGetChat(params['huburl'], params['separator'])
    }
    case 'list': {
      return this.hubList(params['separator'])
    }
    case 'listfulldesc': {
      return this.hubListFullDesc(params['separator'])
    }
    case 'getusers': {
      return this.hubGetUsers(params['huburl'], params['separator'])
    }
    case 'getuserinfo': {
      return this.hubGetUserInfo(params['nick'], params['huburl'])
    }
  }
  }

  case 'share': {
    switch(action){
    case 'add': {
      return this.shareAdd(params['directory'], params['virtname'])
    }
    case 'rename': {
      return this.shareRename(params['directory'], params['virtname'])
    }
    case 'del': {
      return this.shareRename(params['directory'])
    }
    case 'list': {
      return this.shareList(params['separator'])
    }
    case 'refresh': {
      return this.shareRefresh()
    }
  }
  }
  case 'queue': {
    switch(action){
    case 'list': {
      return this.queueList()
    }
    case 'setpriority': {
      return this.queueSetPriority(params['target'], params['priority'])
    }
    case 'move': {
      return this.queueMove(params['target'], params['priority'])
    }
    case 'remove': {
      return this.queueRemove(params['target'])
    }
    case 'listtargets': {
      return this.queueListTargets()
    }
    case 'getsources': {
      return this.queueGetSources(params['target'], params['separator'])
    }
    case 'matchlists': {
      return this.queueMatchLists()
    }
    case 'getiteminfo': {
      return this.queueGetItemInfo(params['target'])
    }
    case 'clear': {
      return this.queueClear()
    }
  }
  }
  case 'hash': {
    switch(action){
    case 'status':  {
      return this.hashStatus()
    }
    case 'pause':  {
      return this.hashPause()
    }
  }
  }
  case 'list': {
    switch(action){
    case 'download': {
      return this.listDownload(params['nick'], params['huburl'])
    }
    case 'local': {
      return this.listLocal(params['separator'])
    }
    case 'open': {
      return this.listOpen(params['filelist'])
    }
    case 'close': {
      return this.listClose(params['filelist'])
    }
    case 'listopened': {
      return this.listListOpened(params['filelist'])
    }
    case 'closeall': {
      return this.listCloseAll()
    }
    case 'lsdir': {
      return this.listLsDir(params['filelist'], params['directory'])
    }
    case 'downloadfile': {
      return this.listDownloadFile(params['target'],params['filelist'], params['downloadto'])
    }
    case 'downloaddir': {
      return this.listDownloadDir(params['target'],params['filelist'], params['downloadto'])
    }
  }
  }
  case 'show': {
    switch(action){
    case 'version': {
      return this.showVersion()
    }
    case 'ratio': {
      return this.showRatio()
    }
  }
  }
  case 'system': {
    switch(action){
    case 'describe': {
      return this.systemDescribe()
    }
  }
  }
  case 'settings': {
    switch(action){
    case 'getset': {
      return this.getset(params['key'],params['value'])
    }
  }
  }
  case 'magnet': {
    switch(action){
    case 'add': {
      return this.magnetAdd(params['magnet'], params['directory'])
    }
  }
  }
  case 'daemon': {
    switch(action){
    case 'stop': {
      return this.daemonStop()
    }
  }
  }
}

const settingTags =
[
    // Strings
    "Nick", "UploadSpeed", "Description", "DownloadDirectory", "EMail",
    "ExternalIp", "HublistServers", "HttpProxy",
    "LogDirectory", "LogFormatPostDownload","LogFormatPostFinishedDownload",
    "LogFormatPostUpload", "LogFormatMainChat", "LogFormatPrivateChat",
    "TempDownloadDirectory", "BindAddress", "SocksServer",
    "SocksUser", "SocksPassword", "ConfigVersion", "DefaultAwayMessage",
    "TimeStampsFormat", "CID", "LogFileMainChat", "LogFilePrivateChat",
    "LogFileStatus", "LogFileUpload", "LogFileDownload", "LogFileFinishedDownload",
    "LogFileSystem",
    "LogFormatSystem", "LogFormatStatus", "LogFileSpy", "LogFormatSpy", "TLSPrivateKeyFile",
    "TLSCertificateFile", "TLSTrustedCertificatesPath",
    "Language", "SkipListShare", "InternetIp", "BindIfaceName",
    "DHTKey", "DynDNSServer", "MimeHandler",
    "LogFileCmdDebug", "LogFormatCmdDebug",
    // Ints
    "IncomingConnections", "InPort", "Slots", "AutoFollow",
    "ShareHidden", "FilterMessages", "AutoSearch",
    "AutoSearchTime", "ReportFoundAlternates", "TimeStamps",
    "IgnoreHubPms", "IgnoreBotPms",
    "ListDuplicates", "BufferSize", "DownloadSlots", "MaxDownloadSpeed",
    "LogMainChat", "LogPrivateChat", "LogDownloads","LogFileFinishedDownload",
    "LogUploads", "MinUploadSpeed", "AutoAway",
    "SocksPort", "SocksResolve", "KeepLists", "AutoKick",
    "CompressTransfers", "SFVCheck",
    "MaxCompression", "NoAwayMsgToBots", "SkipZeroByte", "AdlsBreakOnFirst",
    "HubUserCommands", "AutoSearchAutoMatch","LogSystem",
    "LogFilelistTransfers",
    "SendUnknownCommands", "MaxHashSpeed",
    "GetUserCountry", "LogStatusMessages", "SearchPassiveAlways",
    "AddFinishedInstantly", "DontDLAlreadyShared",
    "UDPPort", "ShowLastLinesLog", "AdcDebug",
    "SearchHistory", "SetMinislotSize",
    "MaxFilelistSize", "HighestPrioSize", "HighPrioSize", "NormalPrioSize",
    "LowPrioSize", "LowestPrio", "AutoDropSpeed", "AutoDropInterval",
    "AutoDropElapsed", "AutoDropInactivity", "AutoDropMinSources",
    "AutoDropFilesize", "AutoDropAll", "AutoDropFilelists",
    "AutoDropDisconnect", "OutgoingConnections", "NoIpOverride", "NoUseTempDir",
    "ShareTempFiles", "SearchOnlyFreeSlots", "LastSearchType",
    "SocketInBuffer", "SocketOutBuffer",
    "AutoRefreshTime", "HashingStartDelay", "UseTLS", "AutoSearchLimit",
    "AutoKickNoFavs", "PromptPassword",
    "DontDlAlreadyQueued", "MaxCommandLength", "AllowUntrustedHubs",
    "AllowUntrustedClients", "TLSPort", "FastHash",
    "SegmentedDL", "FollowLinks", "SendBloom",
    "Coral", "SearchFilterShared", "FinishedDLOnlyFull",
    "SearchMerge", "HashBufferSize", "HashBufferPopulate",
    "HashBufferNoReserve", "HashBufferPrivate",
    "UseDHT", "DHTPort",
    "ReconnectDelay", "AutoDetectIncomingConnection",
    "BandwidthLimitStart", "BandwidthLimitEnd", "EnableThrottle","TimeDependentThrottle",
    "MaxDownloadSpeedAlternate", "MaxUploadSpeedAlternate",
    "MaxDownloadSpeedMain", "MaxUploadSpeedMain",
    "SlotsAlternateLimiting", "SlotsPrimaryLimiting", "KeepFinishedFiles",
    "ShowFreeSlotsDesc", "UseIP", "OverLapChunks", "CaseSensitiveFilelist",
    "IpFilter", "TextColor", "UseLua", "AllowNatt", "IpTOSValue", "SegmentSize",
    "BindIface", "MinimumSearchInterval", "EnableDynDNS", "AllowUploadOverMultiHubs",
    "UseADLOnlyOnOwnList", "AllowSimUploads", "CheckTargetsPathsOnStart", "NmdcDebug",
    "ShareSkipZeroByte", "RequireTLS", "LogSpy", "AppUnitBase",
    "LogCmdDebug",
    // Int64
    "TotalUpload", "TotalDownload"
];
}
