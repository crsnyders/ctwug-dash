import {DialogController} from 'aurelia-dialog';

export class DownloadDialog {
  static inject = [DialogController];
  constructor(controller){
    this.controller = controller;
    this.model= {};
  }
  fileSelected(model) {
    this.file =model.file;
    this.status = model.status;
}
}
