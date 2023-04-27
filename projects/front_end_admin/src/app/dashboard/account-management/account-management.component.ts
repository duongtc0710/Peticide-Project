import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import * as _ from 'lodash';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { API_URL } from 'src/app/config/url.constants';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.css'],
})
export class AccountManagementComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchInputControl: FormControl = new FormControl();
  selectedAccountForm!: any;
  selectedSubAccountForm!: any;
  allAccount$: any;
  allSubAccount$: any;
  allEngineerAccount$: any;
  allAgencyAccount$: any;
  allCustomer$: any;
  private _api_url = API_URL;
  checkStatusAccount: string = '';
  imageAcc: any;
  role = 0;
  roleLocal = 0;
  disableBtn: boolean = false;
  getUserDataS: any = [];
  getSubData: any = [];
  searchKey: string = '';
  pagination: any;

  constructor(
    public _accountService: AccountService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userData();
    // Create the form
    this.selectedAccountForm = this._formBuilder.group({
      id_acc: [''],
      id_role: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      image: ['null'],
      is_active: [],
      date_joined: ['2022-03-09'],
    });

    this.selectedSubAccountForm = this._formBuilder.group({
      fullname: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required]],
    });

    this.loadAllAccount();

    // Search input category
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          // Search category with service
          this.searchKey = query;
          return this._accountService.searchAccount(this.searchKey);
        })
      )
      .subscribe((res) => {
        console.log(res)
        this.allAccount$ = res.data;
        this.pagination = res.pagination;
    });
  }

  /**
   * load all account
   */
  loadAllAccount() {
    this._accountService.refreshListAccount().subscribe((res) => {
      console.log(res)
      this.allCustomer$ = res.customer;
      this.allAccount$ = res.account;
      this.allSubAccount$ = res.admin;
      this.allEngineerAccount$ = res.engineer;
      this.allAgencyAccount$ = res.agency;
    });
  }

  /**
   * selected category
   */
  onUpdate(row: any, row1: any) {
    this.selectedAccountForm.controls['id_acc'].setValue(row.id_acc);
    this.selectedAccountForm.controls['username'].setValue(row.username);
    this.selectedAccountForm.controls['email'].setValue(row.email);
    this.selectedAccountForm.controls['phone'].setValue(row.phone);
    this.selectedAccountForm.controls['address'].setValue(row.address);
    this.selectedSubAccountForm.controls['fullname'].setValue(row1.fullname);
    this.selectedSubAccountForm.controls['birthday'].setValue(row1.birthday);
    this.selectedSubAccountForm.controls['gender'].setValue(row1.gender);
    this.imageAcc = row.image;
    this.selectedAccountForm.controls['is_active'].setValue(row.is_active);

    if (row.is_active == true) {
      document.getElementById('true')?.click();
    } else {
      document.getElementById('false')?.click();
    }
    this.role = row.id_role;
  }

  /**
   * Update status of account
   */
  updateSelectedAccount(): void {
    // Get the account object
    const account = this.selectedAccountForm.getRawValue();
    this._accountService.updateStatusOfAccount(account).subscribe(
      (res) => {
        this.checkStatusAccount = res as unknown as string;
        console.log(res)
        if (this.checkStatusAccount === 'ok') {
          this._toastr.success(
            'Đã cập nhật trạng thái của tài khoản',
            'Thành công'
          );
          this.loadAllAccount();
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
    document.getElementById('closeButton')?.click();
  }

  /**
   * Get url image
   */
  onSubmit() {
    this.updateSelectedAccount();
    document.getElementById('closeButton')?.click();
  }

  /**
   * Get url image
   */
  createImgPath(serverPath: string) {
    return `${this._api_url}${serverPath}`;
  }

  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }
}
