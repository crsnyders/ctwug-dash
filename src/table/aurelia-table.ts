import {customElement, bindable, BindingEngine, inject,computedFrom} from "aurelia-framework";
import * as _ from 'lodash';
import naturalSort from 'javascript-natural-sort';


@customElement('aurelia-table')
@inject(BindingEngine)
@bindable({name:'tableConfig',changeHandler:'tableConfigChanged'})
export class AureliaTable {

  columns = [{
    data: null,
    display: null,
    formatter: null,
    canSearch: false,
    sortFunction: undefined,
    filterFunction:undefined
  }];

  tableConfig = <any>{
    totalItems:0,
    pageSizes: [10, 20, 30],
    pageSize: 10,
    currentPage: 0,
    filterList: [],
    filterValue: '',
    rowDelagate: x => {},
  };
  loading = false;
    formatted: Array<any> = [];
  constructor(private bindingEngine: BindingEngine, private fetchMethod: Function) {

    naturalSort.insensitive =true;
      let filterValueSubscription = bindingEngine.propertyObserver(this.tableConfig, 'filterValue')
        .subscribe((newValue, oldValue) => {
          this.tableConfig.currentPage = 0;

        });
  }
  tableConfigChanged(newValue, oldValue){
    _.extend(oldValue, newValue);
    this.tableConfig = oldValue;
    this.tableConfig.data = ((<any>this.tableConfig.rawdata) === 'Promise') ? (<any>this.tableConfig.rawdata).then(x=> {return x}) : this.tableConfig.rawdata;
  }

  setFetchMethod(fetchMethod){
    this.fetchMethod = fetchMethod;
  }

  fetch() {
    if(this.fetchMethod !== undefined){
      this.fetchMethod();
    }else{
    }
  }

  @computedFrom("tableConfig.rawdata",'tableConfig.currentPage','tableConfig.filterValue','tableConfig.pageSize','tableConfig.orderByDir')
  get rowData(){
    if(!this.tableConfig.serverSide){
      this.applyFilter()
      this.applySort();
      return this.applyPaging();
    }else{
      return this.tableConfig.data;
    }

  }

  applyFilter(){
    if(!_.isEmpty(this.tableConfig.filterList) && !_.isEmpty(this.tableConfig.rawdata)){
    this.tableConfig.data = _.filter(this.tableConfig.rawdata,
            x=>{var value = _.some(_.valuesIn(_.pick(x,this.tableConfig.filterList)),y=>{return _.toLower(_.toString(y)).indexOf(_.toLower(this.tableConfig.filterValue))!=-1});
                return value});
  }else{
    this.tableConfig.data = this.tableConfig.rawdata;
  }
  }

  applySort(){
    if(this.tableConfig.orderBy && !_.isEmpty(this.tableConfig.data)){
    this.tableConfig.data = _.get(this.tableConfig,'data',[]).sort(((x,y)=>{
                  var xx = _.get(x,this.tableConfig.orderBy);
                  var yy = _.get(y,this.tableConfig.orderBy);

                  var column = _.head(_.filter(<Array<Column>>this.tableConfig.columns,x=>{return x.data == this.tableConfig.orderBy}))
                  var customSort = _.get(column,'sortFunction',(x,y,xx,yy)=>{});
                  if(customSort){
                  return customSort(x,y,xx,yy);
                }else{
                  return naturalSort(xx,yy);
                }
          }))
    }

    if(this.tableConfig.orderByDir =='desc'){
      this.tableConfig.data = _.get<Array<any>>(this.tableConfig,'data').reverse();
    }
  }

  applyPaging(){
    var startIndex = this.onFirstPage ? 0 :this.firstItemNumber-1;
    return _.slice(_.get(this.tableConfig,'data',[]), startIndex,startIndex+this.tableConfig.pageSize)
  }

  applyFormatter(row, header) {
    if (header.formatter != null) {
      return header.formatter(row[header.data], row);
    }
    return _.get(row,header.data,'');
  }


  attached(info) {
    var columnDefaults = {
      canSearch: true,
      formatter: undefined
    };
    this.tableConfig.filterList = _.chain(this.tableConfig.columns).filter(column => {
      if (column.canSearch || column.canSearch === undefined) return column.data
    }).map('data').value();
  }

  loadData(data, totalItems){
    this.tableConfig.rawdata = data;
    this.tableConfig.totalItems = totalItems;
  }
  toggelLoading() {
    this.loading = !this.loading;
  }

  get isLoading() {
    return this.loading
  }

  setValue(object,path,value){
    _.set(object,path,value);
  }

  orderBy(columnName) {
    this.tableConfig.orderByDir = (this.tableConfig.orderByDir == 'asc') ? (this.tableConfig.orderBy != columnName) ?"asc":"desc" : "asc";
    this.tableConfig.orderBy = columnName;
  }



  //@computedFrom('tableConfig.totalItems','tableConfig.pageSize','tableConfig.data')
  get pages(): number {
    var numberOfItems = (_.isEmpty(this.tableConfig.filterValue)) ? this.tableConfig.totalItems : _.get(this.tableConfig,'data.length',0);
    return Math.ceil(numberOfItems / this.tableConfig.pageSize);
  }

@computedFrom('tableConfig.totalItems','tableConfig.pageSize','tableConfig.data')
  get pageList(){
    var pagelist =[]
    var pages  = this.pages;
    if(pages <=7){
      return pages;
    }
    if(this.currentPageNumber && this.currentPageNumber >= pages-3){
      return [0,'...',pages-5,pages-4,pages-3,pages-2,pages-1];
    }
    if(this.currentPageNumber && this.currentPageNumber <= 3){
      return [0,1,2,3,4,'...',pages-1];
    }
    if((this.currentPageNumber && this.currentPageNumber >=4 )|| (this.currentPageNumber && this.currentPageNumber <= pages-5)){
      return [0,'...',this.currentPageNumber-1,this.currentPageNumber,this.currentPageNumber+1,'...',pages-1];
    }
  }

  @computedFrom('pages','tableConfig.currentPage')
  get onLastPage() {
    return this.tableConfig.currentPage == this.pages - 1 || this.pages == 1;
  }

  @computedFrom('tableConfig.currentPage')
  get onFirstPage() {
    return this.tableConfig.currentPage == 0;
  }

  setPageNumber(pageNumber) {
    this.tableConfig.currentPage = pageNumber;
  }

  pageSizeChange(pageSize) {
    this.tableConfig.pageSize = pageSize;
  }
  nextPage() {
    if (!this.onLastPage && this.tableConfig.currentPage) {
      this.tableConfig.currentPage++;
    }
  }
  previousPage() {
    if (!this.onFirstPage && this.tableConfig.currentPage) {
      this.tableConfig.currentPage--;
    }
  }

  @computedFrom('tableConfig.currentPage')
  get currentPageNumber() {
    return this.tableConfig.currentPage;
  }

  @computedFrom('tableConfig.pageSizes')
  get pageSizes() {
    return this.tableConfig.pageSizes;
  }

  @computedFrom('tableConfig.pageSize')
  get pageSize() {
    return this.tableConfig.pageSize;
  }

  @computedFrom('tableConfig.data')
  get totalItems() {
    if (this.tableConfig.totalItems === undefined || this.tableConfig.totalItems == 0) {
      this.tableConfig.totalItems = (this.tableConfig.data != null) ? _.get<number>(this.tableConfig,'data.length') : 0;
    }
    return (_.isEmpty(this.tableConfig.filterValue)) ? this.tableConfig.totalItems : '('+_.get(this.tableConfig,'data.length') + ' filtered from '+_.get(this.tableConfig,'rawdata.length')+')';
  }

  @computedFrom('tableConfig.currentPage', 'tableConfig.pageSize','tableConfig.data','tableConfig.totalItems')
  get firstItemNumber() {
    if (this.tableConfig.data == null || _.get(this.tableConfig,'data.length') == 0) {
      return 0;
    }
    var firstItem = (_.get(this.tableConfig,'currentPage',0) * _.get(this.tableConfig,'pageSize',0)) + 1;
    if (firstItem > _.get(this.tableConfig,'totalItems')) {
      firstItem = 0;
    }
    return firstItem;
  }

  @computedFrom('tableConfig.totalItems','tableConfig.data','firstItemNumber','pageSize')
  get lastItemNumber() {
    var lastindex = (this.firstItemNumber + this.applyPaging().length) -1;

    if (lastindex > _.get(this.tableConfig,'totalItems')) {
      lastindex = this.tableConfig.totalItems;
    }
    lastindex = (lastindex == -1) ? 0 : lastindex;
    return lastindex;
  }

  doNothing() {}
}
