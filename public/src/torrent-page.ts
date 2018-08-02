import { firestore } from 'firebase';

import {inject} from 'aurelia-framework';
import {HttpService} from './services/http-service';
import {Notification} from 'aurelia-notification';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as $ from  "jquery";
import * as _ from "lodash";
import { SearchResuts, TorrentResult } from '../custom_typings/model';

@inject(HttpService, Notification)
export class TorrentPage {
  pages: any=0;
  pageNumber: number = 0;
  model: any = {};
  searchString: string;
  torrents: Array<TorrentResult>;

  torrentSubscription: ()=> void;

  constructor(private client: HttpService, private notification: Notification) {
    firebase.firestore().collection('torrents').doc('results').onSnapshot((searchResultsSnapshot)=>{
      
      let searchResults = <SearchResuts>searchResultsSnapshot.data();
      this.torrents = searchResults.torrents;
      this.pageNumber = searchResults.currentPage;
    })
  }

next(){
  this.pageNumber += 1
  this.changePage(this.pageNumber)
}
previous(){
  this.pageNumber -= 1
  this.changePage(this.pageNumber)
}
  changePage(page){
    this.pageNumber = page;
    this.search();
  }

  search(){
    this.pages=undefined;
    firebase.firestore().collection('torrents').doc('query').update({
      searchString: this.searchString,
      pageNumber: this.pageNumber,

    })
  }

  fetchRSS(){
    this.pages=undefined;
    this.pageNumber=0;
    this.client.fetch<Array<any>>('/rest/torrent/rss')
    .catch(x =>{console.log(x);})
    .then(x=>{this.torrents = <Array<any>>x;})

    firebase.firestore().collection('torrents').doc('rss').update({
      status:'list'
    })
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

    firebase.firestore().collection('torrents/download/items').add({url: link})
  }

}
