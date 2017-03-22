import {inject} from 'aurelia-framework';
import {HttpClient as XHRClient} from 'aurelia-http-client';
import _ from 'lodash';

@inject(XHRClient)
export class Eiskaltdcpp {

  constructor(xhr) {
    this.url = '/rest/dc/';
    this.xhr = xhr;
    this.fileListMap = new Map();


    setInterval(x=> {
              this.getSearchResults();
              this.getQueueList();
          }, 10000)

    this.resultConfig = {
      columns: [{
        data: 'Type'
      },{
        data: 'Filename'
      },{
        data: 'Path'
      },{
        data: 'Size',
        sortFunction : function(x,y){return _.parseInt(_.get(x,'Real Size')) > _.parseInt(_.get(y,'Real Size'))}
      },{
        data: 'Nick'
      },{
        data: 'Real Size'
      },{
        data: 'TTH'
      }],
      dblClickFunction : x=>{this.download(x);},
      contextmenu : x=>{this.options(x)}
    };
  }

  doQuery(path,query){
    console.log(path);
    return this.xhr.createRequest(this.url+path)
                  .withContent(query)
                  .asPost()
                  .send();
  }

  options(event){
    this.placeDiv($(this.contexMenue)[0],event.pageX,event.pageY)
    $(this.contexMenue).collapse('show');
  }

  placeDiv(element, x_pos, y_pos) {
  element.style.position = "absolute";
  element.style.left = x_pos+'px';
  element.style.top = y_pos+'px';
}
  clickListener(event){
    $(this.contexMenue).collapse('hide');
  }
  search(){
      this.doQuery('search/send',{'searchstring':this.searchString}).then(x=>{console.log(x.content);});
  }
  clear(){
    this.doQuery('search/clear').then(x=>{console.log(x.content);});
  }

  getId(){
    return Math.round(Math.random()*Math.pow(2, 16));
  }

  getSearchResults(){
    this.doQuery('search/getresults').then(x=>{
        this.results = _.get(x.content,'result',[]);//_.groupBy(x.content.result, 'TTH');
        if(this.results == null){
          this.results = [];
        }
    this.resultTable.loadData(this.results, _.get(this.results,'length'));
  });
  }


  getQueueList(){
    this.doQuery('queue/list').then(x=>{this.queuList = _.values(x.content.result);});
  }

  getFileLists(){
    this.doQuery('list/local').then(x=>{this.fileLists = x.content.result.split(',');
      console.log(this.fileLists)
    });

    this.doQuery('list/listopened').then(x=>{this.opened = x.content.result.split(',');
      console.log(this.opened)
    });
  }

  toggleOpen(filelist){
    this.doQuery('list/open').then(x=>{this.opened = x.content.result.split(',');
      console.log(this.opened)
    });
    this.doQuery('list/close').then(x=>{this.opened = x.content.result.split(',');
      console.log(this.opened)
    });
  }

  getFileList(nick){
    this.doQuery('list/download',{'nick':nick}).then(x=>{console.log(x.content);});
  }

  openFileList(fileList, directory){
    if(!directory){
      directory = '';
    }
    this.doQuery('list/lsdir',{'filelist':fileList,'directory':directory}).then(x=>{console.log(x.content);});
  }


  download(item){
    console.log('Download',item);
    $(this.contexMenue).collapse('hide');
    this.addMagnet(item.TTH,item['Real Size'],item.Filename)
  }
  addMagnet(tth,realsize,filename){
    var magnet  = this.makeMagnet(tth,realsize,filename)
    this.doQuery('magnet/add',{'magnet':magnet}).then(x=>{console.log(x.content);});
  }
  makeMagnet(xt,xl,dn){
    dn = encodeURIComponent(dn);
    return `magnet:?xt=urn:tree:tiger:${xt}&xl=${xl}&dn=${dn}`;
  }
}
