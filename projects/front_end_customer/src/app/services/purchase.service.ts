import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/url.constants';
import { Order, OrderItem, PurchasePagination } from '../models/order.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private _api_url = API_URL;
  private _order = new BehaviorSubject<Order[]>([]);
  private _orderitem = new BehaviorSubject<OrderItem[]>([]);
  private _products = new BehaviorSubject<Product[]>([]);
  private _pagination = new BehaviorSubject<PurchasePagination | null>(null);

  constructor(private _httpClient: HttpClient) { }

  /**
    * Get cart item
    */
  refreshListRatingItem(id: number): Observable<{order: Order[], orderItem: OrderItem[], productItem: Product[]}> {
    return this._httpClient.get<{order: Order[], orderItem: OrderItem[], productItem: Product[]}>(`${this._api_url}/api/rate/rating/${id}`).pipe(
      tap((response): void => {
        this._order.next(response.order);
        this._orderitem.next(response.orderItem);
        this._products.next(response.productItem);
      })
    );
  }

  /**
    * Get rating
    */
  getRating(id){
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<any>(`${this._api_url}/api/rate/rating-product/${id}`,options);
  }

  /**
     * Add to order
     */
  postRatingProduct(data): Observable<any>
  {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/rate/rating`, data, options);
  }
 
}
