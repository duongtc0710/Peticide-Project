import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../config/url.constants';
import { Analytics } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  
  private _api_url = API_URL;
  ab={}

  constructor(private _httpClient: HttpClient) { }

  refreshListAnalytics()
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<string>(this._api_url + '/api/statistical/statis', options)
  }

  refreshListAnalyticsForAgency(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<string>(this._api_url + '/api/statistical/agency', data, options);
  }
}
