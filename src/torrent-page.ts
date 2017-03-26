
import {inject} from 'aurelia-framework';
import {HttpService} from './services/http-service';
import {Notification} from 'aurelia-notification';
import $ from  "jquery";
import * as _ from "lodash";

import "humane-js/themes/libnotify.css";

@inject(HttpService, Notification)
export class TorrentPage {
  pages: any=0;
  page: number = 0;
  model: any = {};
  searchString: string;
  torrents: Array<Torrent>=[];
  constructor(private client: HttpService, private notification: Notification) {
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
    this.client.fetch<any>('/rest/torrent/search',{body:this.client.json({searchString: this.searchString,page:this.page}),method: 'POST'})
    .catch(x =>{console.log(x);})
    .then(x=>{this.torrents = _.get(x,'torrents',[]);this.pages = _.get(x,'pages');})
  }

  fetchRSS(){
    this.pages=undefined;
    this.page=0;
    this.client.fetch<Array<any>>('/rest/torrent/rss')
    .catch(x =>{console.log(x);})
    .then(x=>{this.torrents = <Array<any>>x;})
  }

  download(torrent){
    var link = torrent.link;
    this.client.fetch<any>('/rest/torrent/download',{body:this.client.json({url: link}),method:'POST'})
    .catch(x =>{
      this.notification.error(torrent.title +" not downloaded successfully")
    })
    .then(x=>{
      console.log(x +" downloaded successfully");
      this.notification.success(x +" downloaded successfully")
    })
  }

}
