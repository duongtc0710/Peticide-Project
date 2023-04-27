export interface Product {
  id_product: number;
  name_product: string;
  price: number;
  brand: string;
  quantity: number;
  expirydate: Date;
  description: string;
  id_agency: number;
  category: string;
  status: number;
  image_defaul: string;
  image1: string;
  image2: string;
}

export interface ProductPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}

export interface CateOfPro {
  id_cateofpro: number;
  id_product: number;
  id_category: number;
}

export interface ImageOfProduct {
  id_proimg: number;
  id_product: number;
  file: File;
}
