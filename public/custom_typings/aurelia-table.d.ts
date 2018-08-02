interface TableConfig{
  columns: Array<Column>,
  baseUrl?: string,
  rawdata: Array<any>,
  orderBy: any,
  orderByDir: 'asc'| 'desc',
  serverSide? :boolean,
  totalItems:number,
  pageSizes?: Array<number>,
  pageSize: number,
  currentPage?: number,
  filterList: Array<any>,
  filterValue?: string,
  rowDelagate?: () => {};
  dblClickFunction?: ()=>{};
  contextmenu? : ()=>{};
  data?: Array<any>;
}

interface Column{
  data: string;
  name: string;
  canSearch: boolean;
  sortFunction: (x,y,xx,yy)=>{}
}
