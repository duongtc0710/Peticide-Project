import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from 'src/app/services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  checkForgot: string = "";

  constructor(private _formBuilder: FormBuilder,
    public _authService: ForgotPasswordService,
    private _router: Router) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', Validators.required]
    });  
  }

  get form(){
    return this.forgotPasswordForm.controls;
  }

  forgotPassword(){
    console.log(this.forgotPasswordForm.value)
    this._authService.forgotPassword(this.forgotPasswordForm.value).subscribe((response) => {
      this.checkForgot = response as any;
      console.log(this.checkForgot);
      if(this.checkForgot === "An email is sent"){
        this._router.navigate(['/confirm-password']);
      }
    })  
  }

}
