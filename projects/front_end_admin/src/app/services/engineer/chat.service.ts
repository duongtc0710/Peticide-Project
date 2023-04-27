import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _api_url = API_URL;
  constructor(private _httpClient: HttpClient) { }

  getRoomHandlerList(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<any>(this._api_url+"/api/chat/get-room-by-handler/"+ data, options)
  }

  getRoomList(){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<any>(`${this._api_url}/api/chat/get-room-list/`, options);
  }

  putRoom(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    console.log(data)
    return this._httpClient.put<any>(`${this._api_url}/api/chat/room/`, data, options);
  }

  getMessage(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<any>(this._api_url+"/api/chat/chatting/"+ data, options)
  }

  createChat(data){    
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<any>(`${this._api_url}/api/chat/chatting/`, data, options);
  }
}
