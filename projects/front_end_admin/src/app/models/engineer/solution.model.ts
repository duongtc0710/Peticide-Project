export interface Solution {
  id_disease: number;
  id_product: number;
  description: string;
}

export interface SolutionPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
