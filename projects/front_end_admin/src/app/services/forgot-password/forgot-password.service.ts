import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/config/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  
  private _api_url = API_URL;
  constructor(private _httpClient: HttpClient) { }

  /***
  * forgot Password
  */    
  forgotPassword(email){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<any>(`${this._api_url}/api/acc/forget-password/`, email, options);
  }

  /***
      * confirm code
      */  
  confirmCode(code){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<any>(`${this._api_url}/api/acc/reset-password/`, code, options);
  }

  /***
      * confirm Password
      */  
  resetPassword(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.put<any>(`${this._api_url}/api/acc/reset-password/`, data, options);
  }

}
