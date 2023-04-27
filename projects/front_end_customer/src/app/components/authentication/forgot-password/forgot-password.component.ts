import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [
  ]
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm!: FormGroup;
  checkForgot: string = "";

  /**
    * constructor
    */
  constructor(private _formBuilder: FormBuilder,
    public _authService: AuthService,
    private _router: Router) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', Validators.required]
    });  
  }

  /**
    * Get form controls
    */
  get form(){
    return this.forgotPasswordForm.controls;
  }

  /**
    * function to forgot password
    */
  forgotPassword(){
    this._authService.forgotPassword(this.forgotPasswordForm.value).subscribe((response) => {
      this.checkForgot = response as any;
      //Value response
      //If response "An email is sent" then redirect to confirm-password page
      if(this.checkForgot === "An email is sent"){
        this._router.navigate(['/confirm-password']);
      }
    })  
  }
}
