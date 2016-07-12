import {inject,computedFrom} from 'aurelia-framework';
import _ from 'lodash';
import {HttpClient as XHRClient} from 'aurelia-http-client';
import {DialogService} from 'aurelia-dialog';
import {RemoveTorrentConfirm} from './remove-torrent-confirm';
import {AddTorrentDialog} from './add-torrent-dialog';
import $ from "jquery";


@inject(XHRClient,DialogService)
export class TransmissionRemote {

constructor(xhr,dialogService) {
  this.url = '/rest/transmission/';
  this.xhr = xhr;

  this.dialogService = dialogService;
  this.filterValue = -1;
  this.selectedIds =  [];
  this.model = {};
  setInterval(x=> {
            this.refreshList();
        }, 5000)
}

doQuery(path,query){
  return this.xhr.createRequest(this.url+path)
                .withContent(query)
                .asPost()
                .send();
}

  activate(){
    this.refreshList();
  }
  refreshList(){
    this.doQuery('torrents/all').then((y)=>{console.log(y);this.torrents = y.content.torrents});
  }
@computedFrom('torrents','filterValue','search')
  get torrentList(){
    return _.filter(this.torrents, torrent=> {return (torrent.status == this.filterValue) || (this.filterValue ==-1)}).filter(torrent=>{return _.toUpper(torrent.name).indexOf(_.toUpper(this.search)) !=-1 })
  }
  getStatusType(torrent){
    if(torrent.error != 0){
      return 'progress-bar-danger'
    }else if (torrent.metadataPercentComplete !=1) {
      return 'progress-bar-warning';
    }else if (torrent.percentDone ==1) {
      return 'progress-bar-success';
    }else {
      return 'progress-bar-info';
    }
  }

  getPercentage(torrent){
    return ((torrent.totalSize - torrent.leftUntilDone)/torrent.sizeWhenDone)*100
  }

  rowSelect(id){
    if(_.indexOf(this.selectedIds, id) != -1){
      this.selectedIds = _.remove(this.selectedIds, x=>{return x !=id;});
    }else{
      this.selectedIds.push(id);
    }
  }

  @computedFrom('transmission.status')
  get statusKeys(){
     return  ['STOPPED', 'CHECK_WAIT', 'CHECK', 'DOWNLOAD_WAIT', 'DOWNLOAD', 'SEED_WAIT', 'SEED', 'ISOLATED']//_.keys(this.transmission.status)
  }


add(){
  console.log("add new torrent");
  this.dialogService.open({ viewModel: AddTorrentDialog}).then(response => {
      if (!response.wasCancelled) {
        if (_.get(response,'output.file')) {
          var contents = _.get(response,'output.file');
					var key = "base64,"
					var index = contents.indexOf (key);
					if (index > -1) {
						var metainfo = contents.substring (index + key.length);
            this.doQuery('torrent/addBase64',{fileb64:metainfo}).then((x)=>{console.log(x);this.refreshList()});
						};

        }
      }
    });
}

remove(){
  this.model.torrents = _.filter(this.torrents,x=>{return _.indexOf(this.selectedIds,x.id) != -1})
  $('#removeTorrent').modal("show")
}

removeTorrents(){
  console.log("remove torrent");
  this.doQuery('torrents/remove',{ids:this.selectedIds,del:_.get(this.model,'removeData',false)}).then((y)=>{console.log(y);this.selectedIds =[];this.refreshList();})
  this.removeDismiss();
}

removeDismiss(){
  this.model = {};
  $('#removeTorrent').modal("hide")
}
isSelected(id){
  return _.indexOf(this.selectedIds,id) != -1;
}

  start(all){
    var idArray =[];
    if(all){
        idArray = _.map(this.torrents, x=>{return x.id});
    }else{
      idArray =this.selectedIds;
    }
    if(!_.isEmpty(idArray)){
      this.doQuery('torrents/start',{ids:this.selectedIds}).then((x)=>{console.log(x);})
    }
  }

  pause(all){
    var idArray =[];
      if(all){
          idArray = _.map(this.torrents, x=>{return x.id});
      }else{
        idArray =this.selectedIds;
      }
      if(!_.isEmpty(idArray)){
        this.doQuery('torrents/stop',{ids:this.selectedIds}).then((x)=>{console.log(x);})
      }

    }
}
