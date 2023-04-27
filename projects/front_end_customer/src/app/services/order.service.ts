import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/url.constants';
import { Order, OrderItem, OrderPagination } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _api_url = API_URL;
  private _orderitem = new BehaviorSubject<OrderItem[]>([]);
  private _products = new BehaviorSubject<Product[]>([]);
  private _order = new BehaviorSubject<Order[]>([]);
  private _productItem = new BehaviorSubject<Product[]>([]);
  private _pagination = new BehaviorSubject<OrderPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  /**
    * Get order item
    */
  refreshListOrderItem(id: number): Observable<{order: Order[],order_item: OrderItem[], product_item: Product[]}> {

    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<{order: Order[], order_item: OrderItem[], product_item: Product[]}>(`${this._api_url}/api/pro/orderitem/${id}`, options).pipe(
      tap((response): void => { 
          this._order.next(response.order);
          this._orderitem.next(response.order_item);
          this._products.next(response.product_item);
      })
    );
  }

  /**
    * Get order 
    */
  refreshListOrder(): Observable<{pagination: OrderPagination, data: Order[]}> {

    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<{pagination: OrderPagination, data: Order[]}>(`${this._api_url}/api/order/order`, options).pipe(
      tap((response): void => {
        this._pagination.next(response.pagination);
        this._order.next(response.data);
      })
    );
  }

 /**
   * Get orders
   */
  refreshListOrders(id: number): Observable<Order[]> {

    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<Order[]>(`${this._api_url}/api/order/getbyid_customer/${id}`,options).pipe(
      tap((response): void => {
        this._order.next(response);
      })
    );
  }

 /**
   *  get order by id
   */
  getOrderById(id: number): Observable<{order: Order[], order_item: OrderItem[], product_item: Product[]}>
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<{order: Order[], order_item: OrderItem[], product_item: Product[]}>(`${this._api_url}/api/order/getbyid/${id}`, options).pipe(
      tap((response): void => {
        this._order.next(response.order);
        this._orderitem.next(response.order_item);
        this._productItem.next(response.product_item);
      })
    );
  }

  /**
     * Add to order
     */
  addOrderItem(orderItem: OrderItem): Observable<OrderItem>
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<OrderItem>(`${this._api_url}/api/order/order`, orderItem, options);
  }

  /**
     * Update to order
     */
  updateOrder(order: Order): Observable<Order>
  {

    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.put<Order>(`${this._api_url}/api/order/order`, order , options);
  }

  /**
     * Delete the order
     *
     * @param id    
     */
  deleteOrder(id: number): Observable<number> 
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.delete<number>(`${`${this._api_url}/api/order/order`}/${id}`, options);
  }

  /**
    * Get payment link
    */
  getPaymentLink(paymentDetails: any): Observable<any>
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/pay/payment`, paymentDetails, options);
  }

  /**
    * Query payment
    */
  queryPayment(query: any): Observable<any>
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/pay/query`, query, options);
  }

  /**
    * add vouher
    */
  addVoucher(data){
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/vou/voucherApp`, data, options);
  }
}
