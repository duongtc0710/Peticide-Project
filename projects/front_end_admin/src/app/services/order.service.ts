import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/url.constants';
import { Order, OrderPagination } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _api_url = API_URL;
  private _orders = new BehaviorSubject<Order[]>([]);
  private _pagination = new BehaviorSubject<OrderPagination | null>(null);

  constructor(private _httpClient: HttpClient) {}

  refreshListOrder(page: number = 1): Observable<{ pagination: OrderPagination; data: Order[] }> {
    return this._httpClient.get<{ pagination: OrderPagination; data: Order[] }>(
        `${this._api_url}/api/order/order`,
        {
          params: {
            page: '' + page,
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
        }
      )
      .pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._orders.next(response.data);
        })
      );
  }

  refreshListOrderByAgency(page: number = 1,idAgency): Observable<{ pagination: OrderPagination; data: Order[] }> {
    return this._httpClient.get<{ pagination: OrderPagination; data: Order[] }>(
        `${this._api_url + '/api/order/getbyid_agency'}/${idAgency}`,
        {
          params: {
            page: '' + page,
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
        }
      )
      .pipe(
        tap((response): void => {
          this._pagination.next(response.pagination);
          this._orders.next(response.data);
        })
      );
  }

  /**
     * Search products with given query
     * @param query
     */
  searchOrders(query: string): Observable<{pagination: OrderPagination, data: Order[]}>
  {
    return this._httpClient.get<{pagination: OrderPagination, data: Order[]}>(`${this._api_url}/api/order/order/search/`, {
          params: {
              search: query
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
       }).pipe(
           tap((response) => {
              this._pagination.next(response.pagination);
              this._orders.next(response.data)
           })
      );
  }

  /**
     * Search products with given query
     * @param query
     */
  filterOrdersByDate(data): Observable<{pagination: OrderPagination, data: Order[]}>
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<{pagination: OrderPagination, data: Order[]}>(`${this._api_url}/api/order/order/filter/`, data, options);
  }
 
  /**
     * update order
     * 
     */
  updateOrder(order: Order): Observable<Order> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.put<Order>(`${this._api_url}/api/order/edit-status-agency`, order, options);
  }
}
