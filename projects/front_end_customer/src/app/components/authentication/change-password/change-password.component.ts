import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  checkChange = "";
  id_acc = 0;
  public barLabel: string = "Kiểm tra mật khẩu mạnh:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public thresholds = [90, 75, 45, 25];
  
  /**
    * constructor
    */
  constructor(private _formBuilder: FormBuilder,
    public _authService: AuthService,
    private _router: Router,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.changePasswordForm = this._formBuilder.group({
      id_acc: this._route.snapshot.params['id'],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }); 
  }

  /**
    * get form controls
    */
  get form(){
    return this.changePasswordForm.controls;
  }

  /**
    * function change password
    */
  changePassword(){
    this._authService.resetPassword(this.changePasswordForm.value).subscribe((res)=>{
      this.checkChange = res as string;
      //value return response 
      //If return "ok" is change password to success
      if(this.checkChange === 'ok'){
        this._toastr.success("Bạn đã thay đổi mật khẩu thành công");
        this._router.navigate(['/sign-in']);
      }
    })
  }
}