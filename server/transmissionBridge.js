var Transmission = require('transmission');
var util = require('util');
var Promise = require('promise');
var events = require('events');
var config = require('./config.js')

var TransmissionBridge = module.exports = function() {
  events.EventEmitter.call(this);
  this.transmission = new Transmission(config.transmission);
};
util.inherits(TransmissionBridge, events.EventEmitter);

/*setTypes: {
  'bandwidthPriority': true,
  'downloadLimit': true,
  'downloadLimited': true,
  'files-wanted': true,
  'files-unwanted': true,
  'honorsSessionLimits': true,
  'ids': true,
  'location': true,
  'peer-limit': true,
  'priority-high': true,
  'priority-low': true,
  'priority-normal': true,
  'seedRatioLimit': true,
  'seedRatioMode': true,
  'uploadLimit': true,
  'uploadLimited': true
}*/
TransmissionBridge.prototype.set = function(ids, options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.set(ids, options, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};
/*addTypes: {
  'download-dir': true,
  'filename': true,
  'metainfo': true,
  'paused': true,
  'peer-limit': true,
  'files-wanted': true,
  'files-unwanted': true,
  'priority-high': true,
  'priority-low': true,
  'priority-normal': true
},*/
TransmissionBridge.prototype.add = function(path, options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.add(ath, options, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.addFile = function(filePath, options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.addFile(filePath, options, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.addBase64 = function(fileb64,options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.addBase64(fileb64,options, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.addUrl = function(url,options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.set(url,options, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.addTorrentDataSrc = function(args, options) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.addTorrentDataSrc(args, options, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.remove = function(ids, del) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.remove(ids, del, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.move = function(ids, location, move) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.move(ids, location, move, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.rename = function(ids, locapathtion, name) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.rename(ids, locapathtion, name, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.get = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.get(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.peers = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.peers(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.files = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.files(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.fast = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.sefastt(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.stop = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.stop(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.stopAll = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.stopAll(function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.start = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.start(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.startAll = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.startAll(function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.startNow = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.startNow(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.verify = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.verify(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.reannounce = function(ids) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.reannounce(ids, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.all = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.all(function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
TransmissionBridge.prototype.active = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.active(function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
};
/*setTypes: {
  'start-added-torrents': true,
  'alt-speed-down': true,
  'alt-speed-enabled': true,
  'alt-speed-time-begin': true,
  'alt-speed-time-enabled': true,
  'alt-speed-time-end': true,
  'alt-speed-time-day': true,
  'alt-speed-up': true,
  'blocklist-enabled': true,
  'dht-enabled': true,
  'encryption': true,
  'download-dir': true,
  'peer-limit-global': true,
  'peer-limit-per-torrent': true,
  'pex-enabled': true,
  'peer-port': true,
  'peer-port-random-on-start': true,
  'port-forwarding-enabled': true,
  'seedRatioLimit': true,
  'seedRatioLimited': true,
  'speed-limit-down': true,
  'speed-limit-down-enabled': true,
  'speed-limit-up': true,
  'speed-limit-up-enabled': true
}*/
TransmissionBridge.prototype.session = function(data) {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.session(data, function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }

    })
  });
};
TransmissionBridge.prototype.sessionStats = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.transmission.sessionStats(function(err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }

    })
  });
};

TransmissionBridge.prototype.methods = function(method, action, params) {
  switch (method) {
    case 'torrents':
      {
        switch (action) {
          case 'stop':
            return this.stop(params['ids'])
          case 'stopAll':
            return this.stopAll()
          case 'start':
            return this.start(params['ids'])
          case 'startAll':
            return this.startAll()
          case 'startNow':
            return this.startNow(params['ids'])
          case 'verify':
            return this.verify(params['ids'])
          case 'reannounce':
            return this.reannounce(params['ids'])
          case 'set':
            return this.set(params['ids'], params['options'])

          case 'add':
            return this.add(params['path'], params['options'])
          case 'addFile':
            return this.addFile(params['file'], params['options'])
          case 'addBase64':
            return this.addBase64(params['fileb64'], params['options'])
          case 'addUrl':
            return this.addUrl(params['url'], params['options'])
          case 'addTorrentDataSrc':
            return this.addTorrentDataSrc(params['args'], params['options'])

          case 'rename':
            return this.rename(params['ids'], params['path'], params['name'])
          case 'remove':
            return this.remove(params['ids'], params['del'])
          case 'move':
            return this.rename(params['ids'], params['location'], params['move'])
          case 'get':
            return this.get(params['ids'])
          case 'peers':
            return this.peers(params['ids'])
          case 'files':
            return this.files(params['ids'])
          case 'fast':
            return this.fast(params['ids'])
          case 'all':
            return this.all()
          case 'activ':
            return this.active()
        }
      }
    case 'session':
      {
        switch (action) {
          case 'stats':
            return this.sessionStats();
          case 'get':
            return this.session();
          case 'set':
            return this.session(params['options']);
        }
      }
  }
};
