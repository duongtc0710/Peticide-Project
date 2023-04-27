import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'confirm-password',
  templateUrl: './confirm-password.component.html',
  styles: [
  ]
})
export class ConfirmPasswordComponent implements OnInit {

  confirmCodeForm!: FormGroup;
  checkConfirmCode: string = "";

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
    this.confirmCodeForm = this._formBuilder.group({
      code: ['', Validators.required]
    });  
  }

  /**
    * function to confirm code
    */
  confirmCode(){
    this._authService.confirmCode(this.confirmCodeForm.value).subscribe((response)=>{
      this.checkConfirmCode = response as string;
      //Value response
      //If response "wrong code" then reset form and reinput
      if(this.checkConfirmCode === 'wrong code'){
        this.confirmCodeForm.reset();
      } else { 
        // redirect to change-password page
        this._router.navigate(['/change-password/', response]);
      }
    })
  }

}
