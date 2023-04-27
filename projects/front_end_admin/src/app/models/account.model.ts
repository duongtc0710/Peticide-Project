export interface Account {
  id_acc: number;
  id_role: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  is_active: boolean;
  date_joined: Date;
}

export interface Sub_account {
  id_acc: number;
  id_admin: number;
  id_engineer: number;
  id_agency: number;
  id_customer: number;
  fullname: string;
  birthday: Date;
  gender: number;
  rate: number;
}

export interface FileView {
  file: File;
}

export interface AccountPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
