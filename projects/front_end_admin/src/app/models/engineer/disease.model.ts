export interface Disease {
  name_disease: string;
  symptom: string;
  solution: string;
}

export interface DiseasePagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
