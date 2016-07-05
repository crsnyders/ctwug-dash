
import {inject} from 'aurelia-framework';
import {HttpClient as XHRClient} from 'aurelia-http-client';

@inject(XHRClient)
export class Torrent {
  constructor(xhr) {
    this.xhr = xhr;
    this.page=1;
  }

next(){
  this.page += 1
  this.changePage(this.page)
}
previous(){
  this.page -= 1
  this.changePage(this.page)
}
  changePage(page){
    this.page = page;
    this.search();
  }

  search(){
    this.pages=undefined;
    this.xhr.createRequest('http://127.0.0.1:8080/rest/torrent/search')
    .withContent({searchString: this.searchString,page:this.page})
    .asPost()
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = x.content.torrents;this.pages = x.content.pages;})
  }

  fetchRSS(){
    this.pages=undefined;
    this.page=undefined;
    this.xhr.createRequest('http://127.0.0.1:8080/rest/torrent/rss')
    .asGet()
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = x.content;})
  }

  download(torrent){
    var link = torrent.link;
    var indexOfPassKey = link.indexOf('&passkey=');
    if(indexOfPassKey != -1){
    link = link.substring(0,indexOfPassKey)
    }

    this.xhr.createRequest('http://127.0.0.1:8080/rest/torrent/download')
    .withContent({url: link})
    .asPost()
    .send().catch(x =>{console.log(x);}).then(x=>{console.log(x.content);})
  }
}
