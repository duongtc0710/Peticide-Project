export interface Order{
    id_customer:  number;
    id_agency: number;
    id_voucher: number;
    address: string;
    total_payment: number;
    status: number;
    id_paymentmethod: number;
    date: Date;
}

export interface OrderItem{
    id_item: number;
    id_order: number;
    id_product: number;
    quantity: number;
    total: number;
}

export class OrderPagination
{
    length: number = 0;
    size: number = 0;
    page: number = 0;
    lastPage: number = 0;
    startIndex: number = 0;
    endIndex: number = 0;
}

export class PurchasePagination
{
    length: number = 0;
    size: number = 0;
    page: number = 0;
    lastPage: number = 0;
    startIndex: number = 0;
    endIndex: number = 0;
}