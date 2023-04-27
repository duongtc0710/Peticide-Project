export interface Voucher {
  id_voucher: number;
  code: string;
  discount: number;
  description: string;
  exprirydate: Date;
}

export interface VoucherPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
