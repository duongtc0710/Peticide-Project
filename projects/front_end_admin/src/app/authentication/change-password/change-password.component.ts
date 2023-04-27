import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordService } from 'src/app/services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  checkChange = "";
  id_acc = 0;
  
  constructor(private _formBuilder: FormBuilder,
    public _authService: ForgotPasswordService,
    private _router: Router,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.changePasswordForm = this._formBuilder.group({
      id_acc: this._route.snapshot.params['id'],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    },
    { 
      validator: this.ConfirmedValidator('new_password', 'confirm_password')
    });  
  }

  get form(){
    return this.changePasswordForm.controls;
  }

  changePassword(){
    this._authService.resetPassword(this.changePasswordForm.value).subscribe((res)=>{
      this.checkChange = res as string;
      if(this.checkChange === 'ok'){
        this._toastr.success("Bạn đã thay đổi mật khẩu thành công");
        this._router.navigate(['/login']);
      }
    })
  }

  ConfirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }  

}
