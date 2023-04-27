import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from 'src/app/config/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Private
  private _api_url = API_URL;
  constructor(private _httpClient: HttpClient) { }

  /***
    * create room chat
    */ 
  createRoom(data){
    
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/chat/room/`,data, options);
  }

  /***
    * create chat
    */ 
  createChat(data){  

    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.post<any>(`${this._api_url}/api/chat/chatting/`,data, options);
  }

  /***
    * get chat
    */ 
  getChat(id: number){
    
    var headers = new HttpHeaders()
    .set('Authorization', 'Token ' + localStorage.getItem('access_token'));

    var options =  {
        headers: headers
    };

    return this._httpClient.get<any>(`${this._api_url}/api/chat/chatting/${id}`, options);
  }
}
