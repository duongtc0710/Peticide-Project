import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Agency, AgencyPagination } from '../models/agency.model';
import { API_URL } from '../config/url.constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  private _api_url = API_URL;
  private _agencys = new BehaviorSubject<Agency[]>([]);
  private _pagination = new BehaviorSubject<AgencyPagination | null>(null);
  
  
  constructor(private _httpClient: HttpClient) { }

  refreshListAgency(page: number = 1): Observable<{pagination: AgencyPagination, data: Agency[]}> 
  {
       return this._httpClient.get<{pagination: AgencyPagination, data: Agency[]}>(`${this._api_url}/api/acc/agency/`,{
           params: {
               page: '' + page
           },
           headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
       }).pipe(
           tap((response) => {
               this._pagination.next(response.pagination);
               this._agencys.next(response.data);
               console.log(response);
           })
       );
  }

  /**
     * Search products with given query
     *
     * @param query
     */
   searchAgencys(query: string): Observable<{pagination: AgencyPagination, data: Agency[]}>
   {
     return this._httpClient.get<{pagination: AgencyPagination, data: Agency[]}>(`${this._api_url}/api/acc/agency/filter/`, {
           params: {
               search: query
           },
           headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._agencys.next(response.data)
            })
       );
   }

   /**
     * Create product
     */
  createAgency(agency: Agency): Observable<Agency> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
      return this._httpClient.post<Agency>(`${this._api_url}/api/acc/agency/`, agency, options);
  }
}
