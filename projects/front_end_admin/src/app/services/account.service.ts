import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account, AccountPagination, FileView, Sub_account } from 'src/app/models/account.model';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgencyPagination } from '../models/agency.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // Private
  private _api_url = API_URL;
  private _accounts = new BehaviorSubject<Account[]>([]);
  private _pagination = new BehaviorSubject<AgencyPagination | null>(null);

  constructor(private _httpClient: HttpClient) { }

  /**
    * Get account
    */
  refreshListAccount(): Observable<{account: Account[], admin: Sub_account[], engineer: Sub_account[], agency: Sub_account[], customer: Sub_account}> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get<{account: Account[], admin: Sub_account[], engineer: Sub_account[], agency: Sub_account[], customer: Sub_account}>(`${this._api_url}/api/acc/acc/`, options).pipe(
      tap((response) => {
        this._accounts.next(response.account);
      })
    );
  }

  /**
    * Get account
    */
  searchAccount(query: string): Observable<{pagination: AccountPagination, data: Account[]}> 
  {
    return this._httpClient.get<{pagination: AccountPagination, data: Account[]}>(`${this._api_url}/api/acc/filter/`, {
        params: {
          search: query,
        },
        headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
          }).pipe(
            tap((response) => {
              this._pagination.next(response.pagination);
              this._accounts.next(response.data)
          })
    );
  }

  /**
    * Create account
    */
  createAccount({ account, sub_account }: { account: Account; sub_account: Sub_account; }): Observable<Account> 
  {   
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    console.log(sub_account)   
    return this._httpClient.post<Account>(`${this._api_url}/api/acc/acc/`, {
      acc_data: account,
      sub_data: sub_account
    }, options);
  }

  /**
    * Update status of accounts
    */
  updateStatusOfAccount(account: Account): Observable<Account> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.put<Account>(`${this._api_url}/api/acc/statusacc/`, account, options);
  }

  /**
    * Update the image
    *
    * @param file
    */
  uploadFile(fileToUpload: File)
  {      
    const formData: FormData = new FormData();
    
    formData.append('file', fileToUpload);

    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<FileView>(`${this._api_url}/upload`, formData, options)
  }

  updateAccount(account: Account, sub_account: Sub_account): Observable<Account> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };

    return this._httpClient.put<Account>(`${this._api_url}/api/acc/change-info/`, {'acc_data':account, 'sub_data':sub_account}, options);
  }

  changePassword(data){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };

    return this._httpClient.put<any>(`${this._api_url}/api/acc/change-password/`,data,  options);
  }

  getCustomerInfor(idCustomer){
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.get(`${this._api_url + "/api/acc/customer/info"}/${idCustomer}`, options)
  }
}

