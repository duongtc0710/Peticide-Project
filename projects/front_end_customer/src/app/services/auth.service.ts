import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { API_URL } from "../config/url.constants";
import { Account, Sub_account } from "../models/account.model";
import { FileView } from "../models/auth.model";


@Injectable({
    providedIn: 'root'
})

export class AuthService {

    cartSubject = new Subject<any>();

    // Private
    private _api_url = API_URL;
    constructor(private _httpClient: HttpClient) { }

    set idUser(iduser: any){
        localStorage.setItem('user.id_acc', iduser);
    }

    get idUser():any{
        return localStorage.getItem('user.id_acc') ?? '';
    }

    /* *
        * Update the image
        *
        */
    uploadFile(fileToUpload: File)
    {      
        const formData: FormData = new FormData();
        
        formData.append('file', fileToUpload);

        return this._httpClient.post<FileView>(`${this._api_url}/upload`, formData)
    }

    /**
        * Get files of pro by id
        */
    createAccount(data: any)
    {
        return this._httpClient.post<any>(`${this._api_url}/api/acc/customer/`, data);
    }

    /**
        * Get files of pro by id
        */
    login(data: FormData)
    {
        return this._httpClient.post<FormData>(`${this._api_url}/api/acc/login/`, data)
        .pipe(switchMap((response: any) => {
            this.idUser = response.idUser;
            return of(response);
        }));
    }

    /***
        * forgot Password
        */    
    forgotPassword(email){
        return this._httpClient.post<any>(`${this._api_url}/api/acc/forget-password/`, email);
    }

     /***
        * confirm code
        */  
    confirmCode(code){
        return this._httpClient.post<any>(`${this._api_url}/api/acc/reset-password/`, code);
    }

    /***
        * confirm Password
        */  
    resetPassword(data){
        return this._httpClient.put<any>(`${this._api_url}/api/acc/reset-password/`, data);
    }

    /***
        * confirm Password
        */  
    changePassword(data){

        var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };

        return this._httpClient.put<any>(`${this._api_url}/api/acc/change-password/`, data, options);
    }

    
    /***
        * update account
        */  
    updateAccount(account: Account, sub_account: Sub_account): Observable<Account> 
    {
        var headers = new HttpHeaders()
                .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
            
            var options =  {
                headers: headers
            };
  
        return this._httpClient.put<Account>(`${this._api_url}/api/acc/change-info/`, {'acc_data':account, 'sub_data':sub_account}, options);
    }

    /***
        * Get infomation of agency
        */ 
    getInforAgency(id){
        var headers = new HttpHeaders()
        .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
    
        var options =  {
            headers: headers
        };
        return this._httpClient.get<any>(`${this._api_url}/api/acc/agency/info/${id}`, options);
    }
}