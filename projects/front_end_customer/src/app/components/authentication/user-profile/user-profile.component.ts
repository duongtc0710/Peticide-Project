import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: [ './user-profile.css'
  ]
})
export class UserProfileComponent implements OnInit {

  @ViewChild('btnClose') btnClose! : ElementRef;
  @ViewChild('btnClose1') btnClose1! : ElementRef;
  public _api_url = API_URL;
  statusEdit: string = '';
  changePasswordForm!: FormGroup;
  proFileForm!: FormGroup;
  sub_accountForm!: FormGroup;
  checkChangePassword: string = "";
  fileToUpload: File | any;
  getAccData: any = [];
  getSubData: any = [];
  idUser = 0;
  imageUrl!: string;
  urlAvatar = "";
  public barLabel: string = "Kiểm tra mật khẩu mạnh:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public thresholds = [90, 75, 45, 25];

  /**
    * constructor
    */
  constructor(private _formBuilder: FormBuilder,
    public _authService: AuthService,
    private _toastr: ToastrService,
    public _accountService: AuthService
    ) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.userData();

    this.proFileForm = this._formBuilder.group({
      id_acc: [''],
      id_role: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      image: ['null'],
      address: ['', [Validators.required]],
      is_active: [true]
    });

    this.sub_accountForm = this._formBuilder.group({
      id_admin: [''],
      id_acc: [''],
      fullname: ['', [Validators.required]],
      birthday: [''],
      gender: 0
    });

    this.changePasswordForm = this._formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }); 
  }

  /**
    * ge profile form
    */
  get proFileFormControl() {
    return this.proFileForm.controls;
  }

  /**
    * ge sub account form
    */
  get sub_accountFormControl() {
    return this.sub_accountForm.controls;
  }

  
  /**
    * ge change password form
    */
  get form(){
    return this.changePasswordForm.controls;
  }

  /**
    * function to row vale item
    */
  onUpdate(row: any, row1: any){
    this.proFileForm.controls['email'].setValue(row.email);
    this.proFileForm.controls['phone'].setValue(row.phone);
    this.proFileForm.controls['address'].setValue(row.address);
    this.sub_accountForm.controls['fullname'].setValue(row1.fullname);
    this.sub_accountForm.controls['gender'].setValue(row1.gender);
    this.sub_accountForm.controls['birthday'].setValue(row1.birthday);
    this.urlAvatar = this.getAccData['image'];
  }

  
  /**
    * function to get user in local Storage
    */
  userData(){
    if(localStorage.getItem('user.id_acc')){
      this.getAccData = JSON.parse(localStorage.getItem('user.id_acc')!);
    }
    if(localStorage.getItem('user.sub_acc')){
      this.getSubData = JSON.parse(localStorage.getItem('user.sub_acc')!);
    }
  }

  /**
    * function to change password
    */
  changePassword(){
    if(this.changePasswordForm.get('new_password')?.value === this.changePasswordForm.get('confirm_password')?.value){
        this._authService.changePassword(this.changePasswordForm.value).subscribe((response)=>{
          console.log(response)
          this.checkChangePassword = response as string;
          if(this.checkChangePassword === 'ok'){
            this._toastr.success('Bạn đã đổi thành công mật khẩu');
            this.btnClose1.nativeElement.click();
          }
      })
    }
    else {
      this._toastr.error('Mật khẩu mới với xác nhận mật khẩu mới phải giống nhau');
    }
  }

  /**
    * function to choose file
    */
  chooseFile(imageInput: any): void
  {
    const file: File = imageInput.files[0];
    this.fileToUpload = file;
  }

  /**
    * function to upload avatar
    */
  uploadFile(imageInput: any): void
  {
    this.chooseFile(imageInput)
    //Set value form data
    const acc = this.proFileForm.value;
    //Upload avatar
    this._accountService.uploadFile(this.fileToUpload).subscribe(response => {
      acc.image = response[0].file;
      this.proFileForm.controls['image'].setValue(response[0].file);
      this.urlAvatar = response[0].file;
    });
  }

  /**
    * function on submit update info
    */
  onSubmit(){
    //get raw value form
    const account = this.proFileForm.getRawValue();
    const sub_account = this.sub_accountForm.getRawValue();

    account.id_acc = this.getAccData.id_acc;
    account.id_role = this.getAccData.id_role;
    account.image = this.urlAvatar;
    account.is_active = this.getAccData.is_active;

    sub_account.id_customer = this.getSubData.id_customer;
    sub_account.id_acc = this.getSubData.id_acc;

    const regex = this.proFileForm.controls;

    // if phone and address invalid
    if (
      regex.phone.invalid || regex.address.invalid
    ) {
      this._toastr.warning('Thông tin chưa hợp lệ!', 'Lỗi');
    } else {
      this._accountService.updateAccount(account, sub_account).subscribe(
        (res) => {
          this.statusEdit = res as unknown as string;
          //Value response
          //if return exitst
          if(this.statusEdit === "exitst"){
          } else if (this.statusEdit === "Success"){
              //if return Success
              this._accountService.updateAccount(account, sub_account).subscribe((res)=>{
                localStorage.setItem("user.id_acc", JSON.stringify(account));
                localStorage.setItem("user.sub_acc", JSON.stringify(sub_account));
                this.userData();
              });
              this._toastr.success('Đã cập nhật thông tin', 'Thành công');
              this.btnClose.nativeElement.click();
            }  
          } 
        )
    }
  }

  /**
    * Get url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  }
}
