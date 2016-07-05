import {DialogController} from 'aurelia-dialog';

export class AddTorrentDialog {
  static inject = [DialogController];
  constructor(controller){
    this.controller = controller;
    this.model= {};
  }
  fileSelected(fileevent) {
    let reader = new FileReader();

    let file = fileevent.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
        this.model.file = reader.result;
    };
}
}
