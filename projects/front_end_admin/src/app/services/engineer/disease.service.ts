import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { Disease, DiseasePagination } from 'src/app/models/engineer/disease.model';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {

  // Private
  private _api_url = API_URL;
  private _diseases = new BehaviorSubject<Disease[]>([]);
  private _pagination = new BehaviorSubject<DiseasePagination | null>(null);

  constructor(private _httpClient: HttpClient) { }

  /**
    * Get list disease
    */
  refreshListDisease(page: number = 1): Observable<{pagination: DiseasePagination, data: Disease[]}> {
    return this._httpClient.get<{pagination: DiseasePagination, data: Disease[]}>(`${this._api_url}/api/dis/disease`, {
        params: {
          page: `${page}`
        },
        headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
  }).pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._diseases.next(response.data);
      })
    );  
  }

  /**
     * Search products with given query
     *
     * @param query
     */
  searchDiseases(query: string): Observable<{pagination: DiseasePagination, data: Disease[]}>
  {
    return this._httpClient.get<{pagination: DiseasePagination, data: Disease[]}>(`${this._api_url}/api/dis/disease/search/`, {
          params: {
              search: query
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
      }).pipe(
          tap((response) => {
            this._pagination.next(response.pagination);
            this._diseases.next(response.data)
      })
    );
  }


  /**
     * Create disease
     */
  createDisease(disease: Disease): Observable<Disease[]> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<Disease[]>(`${this._api_url}/api/dis/disease`, disease, options);
  }

  /**
   * Delete the disease
   *
   * @param id    
   */
  deleteDisease(id: number): Observable<number> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.delete<number>(`${`${this._api_url}/api/dis/disease`}/${id}`, options);
  }

  /**
   * Update disease
   */
  updateDisease(disease: Disease): Observable<Disease> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.put<Disease>(`${this._api_url}/api/dis/disease`, disease, options);
  }
}
