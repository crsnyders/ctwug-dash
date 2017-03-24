
import {inject} from 'aurelia-framework';
import {HttpClient as XHRClient} from 'aurelia-http-client';
import {Notification} from 'aurelia-notification';
import $ from  "jquery";
import _ from "lodash";

@inject(XHRClient, Notification)
export class Torrent {
  constructor(xhr, notification) {
    this.xhr = xhr;
    this.page=0;
    this.model = {};
    this.notification= notification;
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
    this.xhr.createRequest('/rest/torrent/search')
    .withContent({searchString: this.searchString,page:this.page})
    .asPost()
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = _.get(x,'content.torrents',[]);this.pages = _.get(x,'content.pages');})
  }

  fetchRSS(){
    this.pages=undefined;
    this.page=undefined;
    this.xhr.createRequest('/rest/torrent/rss')
    .asGet()
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = _.get(x,'content');})
  }

  download(torrent){
    var link = torrent.link;
    this.xhr.createRequest('/rest/torrent/download')
    .withContent({url: link})
    .asPost()
    .send()
    .catch(x =>{
      this.notification.error(torrent.title +" not downloaded successfully")
    })
    .then(x=>{
      this.notification.success(x.content +" downloaded successfully")
    })
  }

}
