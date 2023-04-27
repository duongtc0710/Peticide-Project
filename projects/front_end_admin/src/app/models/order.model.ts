export interface Order {
  id_customer: number;
  id_voucher: number;
  address: string;
  total_payment: number;
  status: number;
  id_paymentmethod: number;
  date: Date;
}

export interface OrderPagination {
  length: number;
  size: number;
  page: number;
  lastPage: number;
  startIndex: number;
  endIndex: number;
}
