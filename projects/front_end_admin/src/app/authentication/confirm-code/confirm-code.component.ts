import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordService } from 'src/app/services/forgot-password/forgot-password.service';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.css']
})
export class ConfirmCodeComponent implements OnInit {

  confirmCodeForm!: FormGroup;
  checkConfirmCode: string = "";

  constructor(private _formBuilder: FormBuilder,
    public _authService: ForgotPasswordService,
    private _router: Router,
    private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.confirmCodeForm = this._formBuilder.group({
      code: ['', Validators.required]
    });  
  }

  confirmCode(){
    this._authService.confirmCode(this.confirmCodeForm.value).subscribe((response)=>{
      this.checkConfirmCode = response as string;
      if(this.checkConfirmCode === 'wrong code'){
        this._toastr.warning('Sai mã code', 'Lỗi');
        this.confirmCodeForm.reset();
      } else {
        this._router.navigate(['/change-password/', response]);
      }
    })
  }

}
