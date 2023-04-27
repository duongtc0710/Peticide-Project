export interface Agency {
  id_agency: number;
  id_acc: number;
  fullname: string;
  rate: number;
}

export interface AgencyPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
