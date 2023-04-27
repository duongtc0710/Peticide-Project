import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/url.constants';
import { Voucher, VoucherPagination } from '../models/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  private _api_url = API_URL;
  private _vouchers = new BehaviorSubject<Voucher[]>([]);
  private _pagination = new BehaviorSubject<VoucherPagination | null>(null);

  constructor(private _httpClient: HttpClient) { }

  refreshListVoucher(page: number = 1): Observable<{pagination: VoucherPagination, data: Voucher[]}> 
  {
    return this._httpClient.get<{pagination: VoucherPagination, data: Voucher[]}>(`${this._api_url}/api/vou/voucher`,{
      params: {
        page: '' + page
      },
      headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
    }).pipe(
      tap((response): void => {
        this._pagination.next(response.pagination);
        this._vouchers.next(response.data);
        })
    );
  }

  /**
     * Create voucher
     */
   createVoucher(voucher: Voucher): Observable<Voucher> 
   {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

var options =  {
    headers: headers
};
       return this._httpClient.post<Voucher>(`${this._api_url}/api/vou/voucher`, voucher, options);
   }

   deleteProduct(id: number): Observable<number> {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

var options =  {
    headers: headers
};
    return this._httpClient.delete<number>(`${`${this._api_url}/api/vou/voucher`}/${id}`, options);
  }
}
