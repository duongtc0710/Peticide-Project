import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { AIintents, AIintentsPagination } from 'src/app/models/engineer/ai-intent.model';

@Injectable({
  providedIn: 'root'
})
export class AiIntentsService {
  private _api_url = API_URL;
  private _aiintents = new BehaviorSubject<AIintents[]>([]);
  private _pagination = new BehaviorSubject<AIintentsPagination | null>(null);
  constructor(private _httpClient: HttpClient) { }

  /**
    * Get categories
    */
  refreshListIntents(page: number = 1): Observable<{ pagination: AIintentsPagination, data: AIintents[]}> {
    return this._httpClient.get<{pagination: AIintentsPagination, data: AIintents[]}>(`${this._api_url}/api/dis/disease`, {
        params: {
          page: `${page}`
        },
        headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
  }).pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._aiintents.next(response.data);
          console.log(response);
      })
    );  
  }

  refreshListKey(page: number = 1, idDisease):Observable<{ pagination: AIintentsPagination, data: AIintents[]}>{
    return this._httpClient.get<{pagination: AIintentsPagination, data: AIintents[]}>(
      `${this._api_url + '/api/bot/get-intent-by-id_disease'}/${idDisease}`,
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
        this._aiintents.next(response.data);
        console.log(response);
      })
    );
  }

  /**
     * Create disease
     */
   createIntent(aiintents: AIintents): Observable<AIintents[]> {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
       headers: headers
    };
    return this._httpClient.post<AIintents[]>(`${this._api_url}/api/bot/intent`, aiintents, options);
  }

  trainData(){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<any>(`${this._api_url}/api/bot/intent-training`, options);
  }

  searchIntent(query: string): Observable<{pagination: AIintentsPagination, data: AIintents[]}>
  {
    return this._httpClient.get<{pagination: AIintentsPagination, data: AIintents[]}>(`${this._api_url}/api/bot/intent/search/`, {
          params: {
              search: query
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
      }).pipe(
          tap((response) => {
            this._pagination.next(response.pagination);
            this._aiintents.next(response.data)
      })
    );
  }

  /**
   * Update disease
   */
   updateIntent(aiintents: AIintents): Observable<AIintents> {
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

var options =  {
    headers: headers
};
    return this._httpClient.put<AIintents>(`${this._api_url}/api/bot/intent`, aiintents, options);
  }

  /**
   * Delete the disease
   *
   * @param id    
   */
  deleteIntent(id: number): Observable<number> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.delete<number>(`${`${this._api_url}/api/bot/intent`}/${id}`, options);
  }
  
}
