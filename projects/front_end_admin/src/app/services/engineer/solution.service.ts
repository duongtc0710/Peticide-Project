import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { Solution, SolutionPagination } from 'src/app/models/engineer/solution.model';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

   // Private
  private _api_url = API_URL;
  private _solution = new BehaviorSubject<Solution[]>([]);
  private _pagination = new BehaviorSubject<SolutionPagination | null>(null);
  
  constructor(private _httpClient: HttpClient) { }

 /**
    * Get categories
    */
  refreshListSolution(page: number = 1): Observable<{ pagination: SolutionPagination, data: Solution[]}> {
    return this._httpClient.get<{pagination: SolutionPagination, data: Solution[]}>(`${this._api_url}/api/dis/solution`, {
        params: {
          page: `${page}`
        },
        headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
  }).pipe(
        tap((response) => {
          this._pagination.next(response.pagination);
          this._solution.next(response.data);
      })
    );  
  }

  /**
     * Create product
     */
  createSolution(solution: Solution): Observable<Solution> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
      return this._httpClient.post<Solution>(`${this._api_url}/api/dis/solution`, solution, options);
  }
}
