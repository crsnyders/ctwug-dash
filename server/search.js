var config = require('./config.js')
var htmlToJson  = require('html-to-json');
var _ = require("lodash")
var request = require('request');
var Promise = require('promise');
var findPage = "page=";
var findName = "name=";
Array.prototype.unique = function()
{
        var n = {},r=[];
        for(var i = 0; i < this.length; i++)
        {
                if (!n[this[i]])
                {
                        n[this[i]] = true;
                        r.push(this[i]);
                }
        }
        return r;
}
var tableFilterOptions = {
  'torrents': ['.t-row', function($item) {
    var trow = $item.find('td').map(function(x, y) {
      if (x == 0) {
        return y.children[0].children[0].attribs['alt']
      } else if (x == 1) {
        return y.children[2].attribs['title']
      } else if (x == 2) {
        return y.children[0].attribs['href']
      } else if (x == 3) {
        return y.children[0].children[0].data
      } else if (x == 5) {
        return y.children[0].data
      } else if (x == 6) {
        return y.children[0].children[0].children[0].data
      } else if (x == 7) {
        return y.children[0].children[0].children[0].data
      } else if (x == 8) {
        return y.children[0].children[0].children[0].data
      } else if (x == 12) {
        return y.children[0].data
      }

    })
    delete trow.options;
    delete trow._root;
    delete trow.prevObject;
    delete trow.length;
    return trow
  }],
  'pages':['p',function($items){
    var links = []
    for(index in $items[0].children){
      var item = $items[0].children[index];
      if(item.name ='a' && item.attribs != undefined && item.attribs.href != undefined){
        var href = item.attribs.href;
        var indexOfPage = href.indexOf(findPage)
        links.push(href.substring(indexOfPage+ findPage.length));
      }
    }
    return links.unique();
  }]
};

function tableResultClean (result) {
  for (var i = 0; i < result.torrents.length; i++) {
    var torrent = result.torrents[i];

    torrent.type = torrent['0'];
    torrent.title = torrent['1'];
    torrent.link = 'http://torrents.ctwug.za.net/'+torrent['2'];
    torrent.uploader = torrent['3'];
    torrent.size = torrent['4'];
    torrent.seeds = torrent['5'];
    torrent.leech = torrent['6'];
    torrent.completed = torrent['7'];
    torrent.added = torrent['8'];
    torrent.name = decodeURIComponent(torrent.link.substring(torrent.link.indexOf(findName)+findName.length))
    torrent.content= "Category: "+torrent.type+" Size: "+torrent.size+" Added: "+torrent.added+" Seeders: "+torrent.seeds+" Leechers: "+torrent.leech+" Completed: "+torrent.completed;

    delete torrent['0'];
    delete torrent['1'];
    delete torrent['2'];
    delete torrent['3'];
    delete torrent['4'];
    delete torrent['5'];
    delete torrent['6'];
    delete torrent['7'];
    delete torrent['8'];
  }
  var pages=[]
  var currentPages = result.pages[0];
  if(currentPages.length >0){
    for (var i = parseInt(currentPages[0]); i < parseInt(currentPages[currentPages.length-1]); i++) {
      pages.push(i)
    }
  }else{
    pages = [0];
  }
  result.pages = pages;
  return result;
}
function search(searchString,jar, page){
  page = _.isNumber(page) ? page : 1;
  var options = {
          uri : "http://torrents.ctwug.za.net/torrents-search.php?search="+encodeURIComponent(searchString)+"&page="+page+"&cat=0&incldead=0&freeleech=0&lang=0",
          jar : jar,
          method : 'GET'
        };
  return runSearch(options);
}
function searchUrl(searchURL,jar){
  var options = {
          uri : searchURL,
          jar : jar,
          method : 'GET'
        };
  return runSearch(options);
}
function searchHtml(){
  page = _.isNumber(page) ? page : 1;
  var options = {
          uri : "http://torrents.ctwug.za.net/torrents-search.php?search="+encodeURIComponent(searchString)+"&page="+page+"&cat=0&incldead=0&freeleech=0&lang=0",
          jar : jar,
          method : 'GET'
        };
        return runSearchHtml(options);
}
function runSearchHtml(options){

  var promise  = new Promise(function(resolve,reject){
    request(options,function (error, response, body){
            var prom = runSearchOnString(body)
            prom.then(function(result){
              resolve(result);
            })
            .catch(function(error){
              reject(error);
            });
          });
  });
  return promise;
}

function runSearchOnString(body){
  var promise = htmlToJson.parse(body, tableFilterOptions);
  promise.then(tableResultClean);
  return promise
}
function runSearch(options){
  var promise = htmlToJson.request(options, tableFilterOptions);
  promise.then(tableResultClean);
  return promise
}

module.exports = {search: search,searchUrl:searchUrl,searchHtml:searchHtml};
