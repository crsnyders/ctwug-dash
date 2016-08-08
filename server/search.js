var config = require('./config.js')
var cheerio = require('cheerio');
var _ = require("lodash")
var request = require('request');
var Promise = require('promise');
var findPage = "page=";
var findName = "name=";
var urlBase = "http://torrents.ctwug.za.net/torrents-search.php?search=";
//var urlBase = "http://127.0.0.1:8080/torrents/torrents-search.php?search=";
Array.prototype.unique = function() {
  var n = {},
    r = [];
  for (var i = 0; i < this.length; i++) {
    if (!n[this[i]]) {
      n[this[i]] = true;
      r.push(this[i]);
    }
  }
  return r;
}

function search(searchString, jar, page) {
  page = _.isNumber(page) ? page : 0;
  var options = {
    uri: urlBase + encodeURIComponent(searchString) + "&page=" + page + "&cat=0&incldead=0&freeleech=0&lang=0",
    jar: jar,
    method: 'GET'
  };
  return runSearch(options);
}

function searchUrl(searchURL, jar) {
  var options = {
    uri: searchURL,
    jar: jar,
    method: 'GET'
  };
  return runSearch(options);
}

function runSearch(options) {
  var promise = new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (!error) {
        var $ = cheerio.load(body);
        var torrents = extractTorrentInfo($);
        var pages = extractPages()
        resolve({
          "torrents": torrents,
          "pages": pages
        });
      } else {
        reject(error);
      }
    });
  });
  return promise;
}

function extractPages($) {
  var findPage = "page=";
  var links = $('a');
  pages = []
  for (var i = 0; i < links.length; i++) {
    var link = $(links[i])
    if (link.attr('href').indexOf('page') != -1) {
      var href = link.attr('href');
      var indexOfPage = href.indexOf(findPage)
      pages.push(href.substring(indexOfPage + findPage.length));
    }
  }
  return pages.unique();
}


function extractTorrentInfo($) {
  var rows = $(".t-row");
  var torrents = [];
  for (var i = 0; i < rows.length; i++) {
    var row = $(rows[i]);
    var torrent = {};
    for (var j = 0; j < row.children().length; j++) {
      var child = $(row.children()[j]);
      var data = _.trim(child.children().text())
      if (_.isEmpty(data)) {}
      switch (j) {
        case 0:
          torrent.type = $("[alt]", child).first().attr('alt');
          break;
        case 1:
          torrent.title = $("[title]", child).first().attr('title');
          break;
        case 2:
          torrent.link = $('a', child).first().attr('href');
          break;
        case 3:
          torrent.uploader = child.text()
          break;
        case 5:
          torrent.size = child.text()
          break;
        case 6:
          torrent.seeds = child.text()
          break;
        case 7:
          torrent.leech = child.text()
          break;
        case 8:
          torrent.completed = child.text()
          break;
        case 12:
          torrent.added = child.text()
          break;
      }
    }
    torrent.name = decodeURIComponent(torrent.link.substring(torrent.link.indexOf(findName) + findName.length))
    torrent.content = "Category: " + torrent.type + " Size: " + torrent.size + " Added: " + torrent.added + " Seeders: " + torrent.seeds + " Leechers: " + torrent.leech + " Completed: " + torrent.completed;
    torrents.push(torrent);
  }
  return torrents;
}

module.exports = {
  search: search,
  searchUrl: searchUrl
};
