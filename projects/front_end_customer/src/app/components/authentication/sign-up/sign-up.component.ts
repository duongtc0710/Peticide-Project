import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Account, Sub_account } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: [ './sign-up.css'
  ]
})
export class SignUpComponent implements OnInit {

  username: string = '';
  password: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  image: string = '';
  repassword: string = '';
  is_active: boolean = true;
  date_joined: string = "2021-10-30";
  fullname: string = '';
  birthday: string = "2021-10-13";
  gender: number = 0;
  checkResponse = "";
  isValidFormSubmitted = false;
  accountForm!: FormGroup;
  sub_accountForm!: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  phonePattern = "^((\\+91-?)|0)?[0-9]{9}$";
  data = {}
  public barLabel: string = "Kiểm tra mật khẩu mạnh:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public thresholds = [90, 75, 45, 25];

  /**
    * constructor
    */
  constructor(public _authService: AuthService,
    private _toastr: ToastrService,
    private _router: Router) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
  }

  /**
    * on submit to sign up
    */
  submit(form: NgForm) {
    this.data = {

      "acc_data": {
        "id_acc": 0,
        "id_role": 0,
        "username": this.username,
        "password": this.password,
        "repassword": this.repassword, 
        "email": this.email,
        "phone": this.phone,
        "address": this.address,
        "image": "null",
        "is_active": true,
        "date_joined": ""
      },

      "sub_data": {
        "id_customer": 0,
        "id_acc": 0,
        "fullname": this.fullname,
        "birthday": "2021-10-13",
        "gender": 0
      }
    }

    this.isValidFormSubmitted = false;

    if (form.invalid) { //value in form is invalid
      return;
      //if value null
    } else if(this.username === '' || this.password === '' || this.email === '' || this.phone === '' || this.address === '' || this.fullname === ''){
      this._toastr.warning('Thông tin của bạn không được bỏ trống');
    } else if(this.repassword !== this.password) {//if password and repassword difference
      this._toastr.warning('Mật khẩu và xác nhận mật khẩu phải giống nhau');
    } else { 
      this._authService.createAccount(this.data).subscribe((response) => {
        this.checkResponse = response as any;
        //Value response
        //if return success
        if (this.checkResponse === "Success") {
          this.isValidFormSubmitted = true;
          this._toastr.success('Đăng ký thành công', 'Thành công');
          //rediret sign-in 
          this._router.navigate(['/sign-in']);
          //reset form
          this.resetForm();
        } // if username return username existed
        else if (this.checkResponse === "username existed") {
            this._toastr.info('Tên tài khoản đã được sử dụng');
          } // if email return email existed
          else if (this.checkResponse === "email existed") {
            this._toastr.info('Email đã được sử dụng');
          }
      });   
    }
  }

  /**
    * reset form
    */
  resetForm(){
      this.username = '';
      this.password = '';
      this.email = '';
      this.phone = '';
      this.address = '';
      this.image = '';
      this.repassword = '';
      this.is_active= true;
      this.date_joined = "2021-10-30";
      this.fullname = '';
      this.birthday = "2021-10-13";
      this.gender = 0;
  }
}
