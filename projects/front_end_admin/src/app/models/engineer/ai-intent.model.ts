export interface AIintents {
  id_intent: number;
  id_disease: number;
  key: string;
}

export interface AIintentsPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
