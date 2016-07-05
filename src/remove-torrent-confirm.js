import {DialogController} from 'aurelia-dialog';

export class RemoveTorrentConfirm {
  static inject = [DialogController];
  constructor(controller){
    this.controller = controller;
  }
  activate(torrents){
    this.torrents = torrents;
  }
}
