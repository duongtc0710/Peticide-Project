import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: [
  ]
})
export class SignInComponent implements OnInit {

  username: string = '';
  password: string = '';
  response = {};

  constructor(public _authService: AuthService,
    private _toastr: ToastrService, 
    private socialAuthService: SocialAuthService,
    private _router: Router) { }

  ngOnInit(): void {
  }

   /**
    * on submit to sing in
    */  
  submit() {
    var data = new FormData();
    data.append('username', this.username);
    data.append('password', this.password);
    if(this.username === '' || this.password === ''){//if usernam or password === null
      this._toastr.warning("Tên tài khoản hoặc mật khẩu không được trống");
    } else {
      this._authService.login(data).subscribe((response) => {
        this.response = response as boolean;
        this._toastr.success('Đăng nhập thành công');
        this.storeUserData(response);
        this._router.navigate(['/home']);
        this.resetForm();
      },
      error => {
        this._toastr.error("Sai tên tài khoản hoặc mật khẩu");
      });
    }
  }

  /**
    * reset form
    */  
  resetForm(){
    this.username = '';
    this.password = '';
  }

  /**
    * function to get user in localStorage
    */ 
  storeUserData(data) {
    localStorage.setItem("access_token", data["access_token"]);
    localStorage.setItem("user.id_acc", JSON.stringify(data["acc_data"]));
    localStorage.setItem("user.sub_acc", JSON.stringify(data["sub_data"]));
  }

  /**
    * sign in with google
    */
  signInGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
    });
  }
}
