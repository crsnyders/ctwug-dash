
import {inject} from 'aurelia-framework';
import {HttpClient as XHRClient} from 'aurelia-http-client';
import {DialogService} from 'aurelia-dialog';
import {DownloadDialog} from './download-dialog';

@inject(XHRClient,DialogService)
export class Torrent {
  constructor(xhr,dialogService) {
    this.xhr = xhr;
    this.dialogService = dialogService;
    this.page=0;
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
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = x.content.torrents;this.pages = x.content.pages;})
  }

  fetchRSS(){
    this.pages=undefined;
    this.page=undefined;
    this.xhr.createRequest('/rest/torrent/rss')
    .asGet()
    .send().catch(x =>{console.log(x);}).then(x=>{this.torrents = x.content;})
  }

  download(torrent){
    var link = torrent.link;
    this.xhr.createRequest('/rest/torrent/download')
    .withContent({url: link})
    .asPost()
    .send().catch(x =>{this,makePopup(file,"danger")}).then(x=>{this.makePopup(x.content,"success")})
  }

  makePopup(file,status){
    this.dialogService.open({ viewModel: DownloadDialog, model:{file:file,status:status}});
    setTimeout(x =>{this.dialogService.close()},1000);
  }
}
