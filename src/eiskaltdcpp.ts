import {inject, computedFrom} from 'aurelia-framework';
import {HttpService} from './services/http-service';
import * as _ from 'lodash';
import * as $ from "jquery";
import "jstree";

@inject(HttpService)
export class Eiskaltdcpp {
url: string = '/rest/dc/';
fileListMap = new Map();
searchString: string;
results: Array<any>;
opened: Array<any>;
resultConfig: any;
resultTable: any;
queuList: Array<any>;
fileLists: Array<string>;

  constructor(private client: HttpService) {



    setInterval(x => {
      this.getSearchResults();
      this.getQueueList();
    }, 10000)

    this.resultConfig = {
      columns: [
        {
          data: 'Type'
        }, {
          data: 'Filename'
        }, {
          data: 'Path'
        }, {
          data: 'Size',
          sortFunction: function(x, y) {
            return _.parseInt(_.get<string>(x, 'Real Size')) > _.parseInt(_.get<string>(y, 'Real Size'))
          }
        }, {
          data: 'Nick'
        }, {
          data: 'Real Size'
        }, {
          data: 'TTH'
        }
      ],
      dblClickFunction: x => {
        this.download(x);
      }
    };
  }
  attached() {}
  doQuery(path, query?) {
    console.log(path);
    return this.client.fetch<any>(this.url + path, <RequestInit>{method: 'POST',body:this.client.json(query)});

  }



  placeDiv(element, x_pos, y_pos) {
    element.style.position = "absolute";
    element.style.left = x_pos + 'px';
    element.style.top = y_pos + 'px';
  }

  search() {
    this.doQuery('search/send', {'searchstring': this.searchString}).then(x => {
      console.log(x);
    });
  }
  clear() {
    this.doQuery('search/clear').then(x => {
      console.log(x);
    });
  }

  getId() {
    return Math.round(Math.random() * Math.pow(2, 16));
  }

  getSearchResults() {
    this.doQuery('search/getresults').then(x => {
      this.results = _.get(x, 'result', []); //_.groupBy(x.result, 'TTH');
      if (this.results == null) {
        this.results = [];
      }
      this.resultTable.loadData(this.results, _.get(this.results, 'length'));
    });
  }

  getQueueList() {
    this.doQuery('queue/list').then(x => {
      this.queuList = _.values(x.result);
    });
  }

  getFileLists() {
    this.doQuery('list/local').then(x => {
      this.fileLists = x.result.split(',');
      console.log(this.fileLists)
      for (let fileList of this.fileLists) {
        if (fileList != "" && !this.fileListMap.has(fileList)) {
          this.fileListMap.set(fileList, {});
        }
      }

    });

    this.doQuery('list/listopened').then(x => {
      this.opened = x.result.split(',');
      for (let fileList of this.opened) {
        if (fileList != "" && this.fileListMap.has(fileList)) {
          let filelistOptions = this.fileListMap.get(fileList);
          filelistOptions.opened = true;
          this.fileListMap.set(fileList, filelistOptions);
        }
      }
    });
  }

  toggleOpen(filelist) {
    if (this.fileListMap.get(filelist).opened) {
      this.doQuery('list/close', {"filelist": filelist}).then(x => {
        this.opened = x.result;
        console.log(this.opened)
      });
    } else {
      this.doQuery('list/open', {'filelist': filelist}).then(x => {
        this.opened = x.result;
        console.log(this.opened)
      });
    }

  }

  getFileList(nick) {
    this.doQuery('list/download', {'nick': nick}).then(x => {
      console.log(x);
    });
  }
  openFileList(fileList, directory) {
    console.log(fileList, directory);
    this.setupJSTree(fileList);
  }
  readDirFromFileList(fileList, directory) {
    return new Promise<Array<any>>((resolve, reject) => {
      if (!directory) {
        directory = '';
      }
      this.doQuery('list/lsdir', {
        'filelist': fileList,
        'directory': directory
      }).then(x => {
        let items:Array<any> = []
        for (var key in x.result) {
          if (x.result.hasOwnProperty(key)) {
            let item = x.result[key];
            items.push({

              "text": key,
              "state": {
                'opened': false,
                'selected': false
              },
              "children": !item.hasOwnProperty('TTH'),
              "fileList": fileList,
              "type": item.hasOwnProperty('TTH') ? "file": "folder",
              "data": item
            })
          }
        }
        console.log(items);
        resolve(items);
      }).catch(x => {
        reject(x);
      });
    })

  }

  setupJSTree(fileList) {
    if ($('#jstree_demo_div').jstree()) {
      $('#jstree_demo_div').jstree().destroy();
    }
    $('#jstree_demo_div').jstree({
      'core': {
        'data': (obj, callback) => {
          var target = this.buildTarget(obj.id,obj.parents);

          console.log(obj, target);
          this.readDirFromFileList(fileList, obj.parent == null ? undefined : target + "\\")
            .then(items => {
            for (var i = 0; i < items.length; i++) {
              items[i].id =items[i].text;
            }
            console.log(items);
            callback.call(this, items)
          })

        }
      },
      "plugins": [
        "contextmenu",
        "dnd",
        "search",
        "state",
        "types",
        "wholerow"
      ],
      "contextmenu": {
        "items": ($node) =>{
          var tree = $("#tree").jstree(true);
          console.log($node,$node.data.hasOwnProperty('TTH'));
          return {
            "Download": {
              "separator_before": false,
              "separator_after": false,
              "label": "Download",
              "action": (obj)=> {
                  console.log("Download ", $node.id)
                  this.downloadTarget($node)
              }
            },
            "Download To": {
              "separator_before": false,
              "separator_after": false,
              "label": "Download To",
              "action": (obj) =>{
                console.log("Download to", $node)
                this.downloadTarget($node)
              }
            },
            "Find Alternatives": {
              "separator_before": false,
              "separator_after": false,
              "label": "Find Alternatives",
              "_disabled": !$node.data.hasOwnProperty('TTH'),
              "action": (obj) =>{
                console.log("Find Alternatives ", $node)

              }
            }
          };
        }
      },
      "types": {
        "default": {
          "valid_children": ["default", "file"]
        },
        "file": {
          "icon": "glyphicon glyphicon-file",
          "valid_children": []
        }
      }
    });
  }

  buildTarget(id, parents){
    for(var parent of parents){
      if(parent != '#')
      id= parent+'\\'+id;
    }
    return id;
  }
  download(item) {
    console.log('Download', item);
    this.addMagnet(item.TTH, item['Real Size'], item.Filename)
  }

  remove(target) {
    this.doQuery('queue/remove', {
      'target': target})
    .then(x => {
      console.log(x);
    });
  }

  setPriority(target, pri){
    if(pri){
      console.log(target,pri);
      this.doQuery('queue/setpriority', {
        'target': target,
        'priority':Number.parseInt(pri)
      })
      .then(x => {
        console.log(x);
      });
    }

  }
  downloadTarget(node){
    if(node.data.hasOwnProperty('TTH')){
      this.doQuery('list/downloadfile', {
        'target': this.buildTarget(node.id, node.parents),
        'filelist':node.original.fileList,
        'downloadTo':"/home/media/Downloads/"})
      .then(x => {
        console.log(x);
      });
    }else{
      this.doQuery('list/downloaddir', {
        'target': this.buildTarget(node.id, node.parents)+"\\",
        'filelist':node.original.fileList,
        'downloadTo':"/home/media/Downloads/"})
      .then(x => {
        console.log(x);
      });
    }
  }

  addMagnet(tth, realsize, filename) {
    var magnet = this.makeMagnet(tth, realsize, filename)
    this.doQuery('magnet/add', {'magnet': magnet}).then(x => {
      console.log(x);
    });
  }

  makeMagnet(xt, xl, dn) {
    dn = encodeURIComponent(dn);
    return `magnet:?xt=urn:tree:tiger:${xt}&xl=${xl}&dn=${dn}`;
  }
}
