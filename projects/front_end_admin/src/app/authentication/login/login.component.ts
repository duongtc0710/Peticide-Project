import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  passworHidden = '';
  show = false;
  result: boolean = false;

  constructor(public service: LoginService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.passworHidden = 'password';
  }

  // ShowPassword
  onShowPassword() {
    if (this.passworHidden === 'password') {
      this.passworHidden = 'text';
      this.show = true;
    } else {
      this.passworHidden = 'password';
      this.show = false;
    }
  }

  // button login
  onSubmit(){
    if(this.service.formData.username != null && this.service.formData.password != null){
      this.service.formDataIdentify.username = this.service.formData.username;
      this.service.formDataIdentify.password = this.service.formData.password;
      this.service.postIdentityAccount().subscribe(   //gọi hàm thêm sản phầm từ ProductDetailService
        res =>  { 
          this.result = res as boolean;
          if(this.result){
            if(res['acc_data'].id_role === 1 || res['acc_data'].id_role === 3){
              this.toastr.success('Đăng nhập thành công');
              this.storeUserData(res);
              this.router.navigate(['/dashboard']);
            } else {
              this.toastr.success('Đăng nhập thành công');
              this.storeUserData(res);
              this.router.navigate(['/disease']);
            }
          } else{
            this.toastr.error('Tài khoản hoặc mật khẩu của bạn không đúng!', 'Thử lại');
          }          
        },
        err => { console.log(err);
          this.toastr.error('Tài khoản hoặc mật khẩu của bạn không đúng!', 'Thử lại');
        }
      )  
    }
  }

  storeUserData(data) {
    localStorage.setItem("access_token", data["access_token"]);
    localStorage.setItem("userData", JSON.stringify(data["acc_data"]));
    localStorage.setItem("subdata", JSON.stringify(data["sub_data"]));
  }
}
