import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile-manage',
  templateUrl: './profile-manage.component.html',
  styleUrls: ['./profile-manage.component.css'],
})
export class ProfileManageComponent implements OnInit {

  proFileForm!: any;
  sub_accountForm!: any;
  getUserDataS: any = [];
  getSubData: any = [];
  changePasswordForm: any = [];
  public _api_url = API_URL;
  statusEdit: string = '';
  statusChangePassword: string = '';
  urlAvatar = "";
  fileToUpload: File | any;

  constructor(
    private _formBuilder: FormBuilder,
    public _accountService: AccountService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userData();

    this.proFileForm = this._formBuilder.group({
      id_acc: [''],
      id_role: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      image: [''],
      address: ['', [Validators.required]],
      is_active: [true],
    });

    this.sub_accountForm = this._formBuilder.group({
      id_admin: [''],
      id_acc: [''],
      fullname: ['', [Validators.required]],
      birthday: [''],
      gender: ['', [Validators.required]]
    });

    this.changePasswordForm = this._formBuilder.group({
      old_password: [''],
      new_password: [''],
      confirm_password: [''],
    });
  }

  get proFileFormControl() {
    return this.proFileForm.controls;
  }

  get sub_accountFormControl() {
    return this.sub_accountForm.controls;
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  /**
    * get user data in local
    */
  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }

  onUpdate(row: any, row1: any) {
    this.sub_accountForm.controls['fullname'].setValue(row1.fullname);
    this.sub_accountForm.controls['gender'].setValue(row1.gender);
    this.sub_accountForm.controls['birthday'].setValue(row1.birthday);
    this.proFileForm.controls['email'].setValue(row.email);
    this.proFileForm.controls['phone'].setValue(row.phone);
    this.proFileForm.controls['address'].setValue(row.address);
    this.urlAvatar = this.getUserDataS['image'];
  }

  /**
    * Choose file
    *
    */
  chooseFile(imageInput: any): void
  {
    const file: File = imageInput.files[0];
    this.fileToUpload = file;
  }

  /**
    * Upload avatar
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
    * on submit update info
    */
  onSubmit() {
    const account = this.proFileForm.getRawValue();
    const sub_account = this.sub_accountForm.getRawValue();

    account.id_acc = this.getUserDataS.id_acc;
    account.id_role = this.getUserDataS.id_role;
    account.image = this.urlAvatar;
    account.is_active = this.getUserDataS.is_active;

    sub_account.id_admin = this.getSubData.id_admin;
    sub_account.id_acc = this.getSubData.id_acc;

    const regex = this.proFileForm.controls;

    if (
      account.fullname == '' || regex.phone.invalid || regex.address.invalid
    ) {
      this._toastr.warning('Thông tin chưa hợp lệ!', 'Lỗi');
    } else {
      this._accountService.updateAccount(account, sub_account).subscribe(
        (res) => {
          this.statusEdit = res as unknown as string;
          if (this.statusEdit === 'exitst') {
            this._toastr.error('Tên sản phẩm đã tồn tại', 'Lỗi!');
          } else if (this.statusEdit === 'Success') {
            this._accountService.updateAccount(account, sub_account).subscribe((res) => {
                localStorage.setItem('userData', JSON.stringify(account));
                localStorage.setItem('subdata', JSON.stringify(sub_account));
                this.userData();
              });
            this._toastr.success('Đã cập nhật thông tin', 'Thành công');
            document.getElementById('closeButton')?.click();
          } else if (this.statusEdit === 'fail') {
            this._toastr.warning('Thông tin chưa hợp lệ', 'Cập nhật');
          } else if (this.statusEdit === 'not found') {
            this._toastr.warning('Thông tin chưa hợp lệ', 'Cập nhật');
          }
        },
        (err) => {
          this._toastr.error('Thử lại', 'Không thể kết nối...');
        }
      );
    }
  }

  /**
    * change password
    */
  onChange() {
    const changePassword = this.changePasswordForm.getRawValue();
    const regex = this.changePasswordForm.controls;
    if(regex['new_password'].invalid){
      this._toastr.warning('Mật khẩu phải lớn hơn 8 kí tự', 'Lỗi!')
    }
    if (changePassword.new_password === changePassword.confirm_password) {
      this._accountService.changePassword(changePassword).subscribe((res) => {
        this.statusChangePassword = res as unknown as string;
        if (this.statusChangePassword === 'fail') {
          this._toastr.error('Đổi mật khẩu thất bại', 'Lỗi!');
        } else if (this.statusChangePassword === 'ok') {
          this._accountService.changePassword(changePassword);
          this._toastr.success('Đã thay đổi mật khẩu', 'Thành công');
          document.getElementById('closeChange')?.click();
          this.changePasswordForm.reset();
        } else {
          this._toastr.error('Mật khẩu hiện tại không đúng', 'Lỗi');
        }
      });
    } else {
      this._toastr.error('Mật khẩu mới không trùng khớp', 'Lỗi!');
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
