import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login/login.model';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // new login
  formDataIdentify: Login = new Login();
  formData: Login = new Login();
  
  // url api
  url: string='http://127.0.0.1:8000';

  constructor(private http: HttpClient, private router: Router) { }

  checkToken() {
    if (localStorage.getItem('token') != null) {
      var values = JSON.parse(localStorage.getItem('token') || '{}');
      if (!values) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  postIdentityAccount() {
    return this.http.post(this.url + "/api/acc/login/", this.formDataIdentify); 
  }
}
