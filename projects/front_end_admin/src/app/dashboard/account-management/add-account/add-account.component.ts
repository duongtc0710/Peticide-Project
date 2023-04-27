import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Account, Sub_account } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { AccountManagementComponent } from '../account-management.component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.css'],
})
export class AddAccountComponent implements OnInit {
  [x: string]: any;

  //decalere variable
  accountForm!: any;
  sub_accountForm!: any;
  checkInsertUsername!: string;
  checkInsertEmail!: string;
  checkInsertName!: string;
  imageUrl!: string;
  fileToUpload: File | any = null;
  allAccount$: any;
  allSubAccount$: any;
  allEngineerAccount$: any;

  roles = [
    {
      name_role: 'Admin',
      value: 1,
    },
    {
      name_role: 'Kỹ sư',
      value: 2,
    },
    {
      name_role: 'Đại lý',
      value: 3,
    },
  ];

  constructor(
    private acc_manage: AccountManagementComponent,
    public _accountService: AccountService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Create the form
    this.accountForm = this._formBuilder.group({
      id_acc: ['0'],
      is_active: ['true'],
      id_role: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      image: ['null'],
      date_joined: ['2022-03-09'],
    });
    this.sub_accountForm = this._formBuilder.group({
      fullname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });
    //URL image default
    this.imageUrl = '../../../../assets/images/1.jpg';
  }

  /**
   * get form control
   */
  get accountFormControl() {
    return this.accountForm.controls;
  }

  /**
   * get form control
   */
  get sub_accountFormControl() {
    return this.sub_accountForm.controls;
  }

  onSubmit() {
    const account = this.accountForm.value;
    const sub_account = this.sub_accountForm.value;

    const regex = this.accountForm.controls;
    //if value null
    if (
      account.username == '' ||
      account.password == '' ||
      account.email == '' ||
      account.phone == '' ||
      account.address == '' ||
      sub_account.fullname == '' ||
      sub_account.birthday == '' ||
      sub_account.gender == 0 ||
      //Check regular expression
      regex['phone'].invalid == true ||
      regex['email'].invalid == true ||
      regex['username'].invalid == true ||
      regex['password'].invalid == true
    ) {
      this._toastr.warning('Vui lòng nhập giá trị hợp lệ!', 'Tạo tài khoản');
    } else {
      if (account.id_acc === undefined || account.id_acc == 0) {
        //If id=0 add
        this.createAccount(account, sub_account);
      }
    }
  }

  /**
   * Create account
   */
  createAccount(account: Account, sub_account: Sub_account) {
    this._accountService.createAccount({ account, sub_account }).subscribe(
      (res) => {
        this.checkInsertUsername = res as unknown as string;
        this.checkInsertEmail = res as unknown as string;
        this.checkInsertName = res as unknown as string;

        if (this.checkInsertUsername === 'username existed') {
          this._toastr.error('Tài khoản đã tồn tại', 'Thất bại');
        } else if (this.checkInsertEmail === 'email existed') {
          this._toastr.error('Email đã tồn tại', 'Thất bại');
        } else if (this.checkInsertUsername === 'acc fail') {
          this._toastr.error('Thông tin tài khoản chưa hợp lệ', 'Thất bại');
        } else if (this.checkInsertName === 'Success') {
          this._toastr.success('Tài khoản đã được thêm', 'Thành công');
          document.getElementById('onClose')?.click();
          this.acc_manage.loadAllAccount();
          //Reset form
          this.resetAccountForm();
        }
      },
      (err) => {
        this._toastr.error('Tài khoản hoặc email không hợp lệ!', 'Thử lại');
      }
    );
  }

  /**
   * Upload avatar
   *
   */
  selectedFile(imageInput: any): void {
    const file: File = imageInput.files[0];

    this.fileToUpload = file;

    var reader = new FileReader();

    reader.onload = (event: any) => {
      //Change image on load
      this.imageUrl = event.target.result;
    };

    //Read file
    reader.readAsDataURL(file);

    //Set value form data
    const acc = this.accountForm.value;

    //Upload avatar
    this._accountService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image = response[0].file;
      this.accountForm.controls['image'].setValue(response[0].file);
    });
  }

  resetAccountForm() {
    const account = this.accountForm.value;

    account.id_acc = 0;
    account.is_active = true;
    this.accountForm.controls['id_role'].setValue('0');
    this.accountForm.controls['username'].setValue('');
    this.accountForm.controls['password'].setValue('');
    this.accountForm.controls['email'].setValue('');
    this.accountForm.controls['phone'].setValue('');
    this.accountForm.controls['address'].setValue('');
  }
}
