import {customElement,bindable,BindingEngine,inject,useView } from "aurelia-framework";
import  o from 'crsnyders/o.js';
import _ from 'lodash';
import {AureliaTable} from './aurelia-table';
import {OdataAuth} from "odata-auth";

@customElement('odata-table')
@inject(BindingEngine,OdataAuth)
@bindable({name:'tableConfig',changeHandler:'tableConfigCanged'})
@useView('./aurelia-table.html')
export class OdataTable extends AureliaTable {

  constructor(bindingEngine,odataAuth) {
    super(bindingEngine);
    super.setFetchMethod(this.odataFetch);
    this.odataAuth = odataAuth;
  }

  attached(info) {
    super.attached(info)
    var authToken = this.odataAuth.getAuthToken();
    o().config({
         endpoint:this.tableConfig.baseUrl,
         start:this.toggelLoading(),
         end:this.toggelLoading(),
         headers:[{name: 'Authorization', value: 'Bearer '+authToken},{name: 'If-Match', value: '*'}]
       });
    this.fetch();
  }

  odataFetch() {
    if(this.tableConfig.baseUrl != null ){
      var odataQuery = o(this.tableConfig.resourceExtention).inlineCount("true");
      if(this.tableConfig.orderBy !== undefined){
          odataQuery.orderBy(`${this.tableConfig.orderBy} ${this.tableConfig.orderByDir}`)
      }

      if((this.tableConfig.filterValue !='' && this.tableConfig.filterValue !== undefined) && (this.tableConfig.filterList.length !=0)){
        odataQuery.search(this.tableConfig.filterList,this.tableConfig.filterValue);
      }

      if(this.tableConfig.odataOptions){
      odataQuery = this.buildQuery(odataQuery,this.tableConfig.odataOptions);
      }

      odataQuery.skip((this.firstItemNumber !=0)? this.firstItemNumber -1 :0);
      odataQuery.top(this.pageSize);


      odataQuery.get().then(x=>{
        this.tableConfig.data = x.data;
        this.tableConfig.totalItems = x.inlinecount}).catch(x=>{console.log(x);})
    }
  }

buildQuery(odataQuery,odataOptions){
  if(!_.isArray(odataOptions)){
    this.tableConfig.odataOptions =[odataOptions];
  }
  for(var i=0;i<this.tableConfig.odataOptions.length;i++){
    var option = this.tableConfig.odataOptions[i];
    switch(option.operation){
      case "expand":
          odataQuery.expand(option.field);
        break;
      case "filter":
      odataQuery.filter(option.value)
      break
    }
  }

  return odataQuery;
}

}
