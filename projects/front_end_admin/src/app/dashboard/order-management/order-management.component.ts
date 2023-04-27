import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { AccountService } from 'src/app/services/account.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css'],
})
export class OrderManagementComponent implements OnInit {

  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  p: number = 1;
  page: number = 1;
  allOrder$: any;
  allInfor$: any;
  pagination: any;
  selectedOrderForm!: FormGroup;
  InforOrderForm!: FormGroup;
  filterByDateForm!: FormGroup;
  getUserDataS: any = [];
  getSubData: any = [];
  idStatus: any;
  checkStatusOrder: string = '';
  searchKey: string = '';

  idOrder: number = 0;
  idCustomer: number = 0;
  idAgency: number = 0;
  idVoucher: number = 0;
  idDate: string = '';
  idMethod: number = 0;

  constructor(
    public _orderService: OrderService,
    public _accountService: AccountService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userData();
    // Create the form
    this.selectedOrderForm = this._formBuilder.group({
      id_paymentmethod: [''],
      address: ['', [Validators.required]],
      total_payment: ['', [Validators.required]],
      date: ['', [Validators.required]],
      status: [''],
      id_order: [''],
      id_customer: [''],
      id_agency: [''],
      id_voucher: [''],
    });

    this.InforOrderForm = this._formBuilder.group({
      fullname: [''],
      email: [''],
      phone: [''],
    });

    this.filterByDateForm = this._formBuilder.group({
      id_agency: 0,
      start_date: [''],
      end_date: ['']
    });

    if (this.getUserDataS['id_role'] === 1) {
      this.loadAllOrder();
    } else if (this.getUserDataS['id_role'] === 3) {
      this.loadOrderByAgency();
    }

    // Search input category
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          // Search category with service
          this.searchKey = query;
          return this._orderService.searchOrders(this.searchKey);
        })
      )
      .subscribe((res) => {
        this.allOrder$ = res.data;
        this.pagination = res.pagination;
    });
  }

  /**
   * load all account
   */
  loadAllOrder() {
    this._orderService.refreshListOrder(this.page).subscribe((res) => {
      this.allOrder$ = res.data;
      this.pagination = res.pagination;
    });
  }

  loadOrderByAgency() {
    this._orderService
      .refreshListOrderByAgency(this.page, this.idAgency)
      .subscribe((res) => {
        this.allOrder$ = res.data;
        this.pagination = res.pagination;
    });
  }

  /**
   * Change page
   */
  changePage(event: any): void {
    this.page = event;
    this.loadAllOrder();
  }

  /**
    * on btn update
    */
  onUpdate(row: any) {
    this.idStatus = 0;
    this.idCustomer = 0;
    this.idVoucher = 0;
    this.idOrder = 0;
    this.idMethod = 0;
    this.idDate = '';

    if (row.status == 3) {
      this.idStatus = row.status;
      this.idCustomer = row.id_customer;
      this.idVoucher = row.id_voucher;
      this.idOrder = row.id_order;
      this.idMethod = row.id_paymentmethod;
      this.idDate = row.date;
    }

    this._accountService.getCustomerInfor(row.id_customer).subscribe((res) => {
      this.allInfor$ = res;

      this.InforOrderForm.controls['fullname'].setValue(
        this.allInfor$.fullname
      );
      this.InforOrderForm.controls['email'].setValue(this.allInfor$.email);
      this.InforOrderForm.controls['phone'].setValue(this.allInfor$.phone);
    });

    if (row.id_paymentmethod == 1) {
      this.selectedOrderForm.controls['id_paymentmethod'].setValue('VN PAY');
    } else {
      this.selectedOrderForm.controls['id_paymentmethod'].setValue('Tiền mặt');
    }
    this.selectedOrderForm.controls['address'].setValue(row.address);
    this.selectedOrderForm.controls['total_payment'].setValue(
      row.total_payment
    );
    this.selectedOrderForm.controls['date'].setValue(
      formatDate(row.date, 'yyyy-MM-dd', 'en')
    );
  }

  /**
   * Update status of account
   */
  updateSelecteOrder(): void {
    // Get the account object
    const order = this.selectedOrderForm.getRawValue();
    order.id_customer = this.idCustomer;
    order.id_agency = this.idAgency;
    order.id_order = this.idOrder;
    order.id_voucher = this.idVoucher;
    order.id_paymentmethod = this.idMethod;
    order.date = this.idDate;
    this._orderService.updateOrder(order).subscribe(
      (res) => {
        this.checkStatusOrder = res as unknown as string;
        if (this.checkStatusOrder === 'ok') {
          this._toastr.success(
            'Đã cập nhật trạng thái của hoá đơn',
            'Thành công'
          );
          this.loadOrderByAgency();
          document.getElementById('closeButton')?.click();
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }

  /**
   * Get url image
   */
  onSubmit() {
    this.updateSelecteOrder();
  }

  /**
   * filter by date
   */
  filterByDate(event){
    if((this.filterByDateForm.get('start_date')?.value != '' && this.filterByDateForm.get('end_date')?.value != '') 
      && (this.filterByDateForm.get('end_date')?.value) > (this.filterByDateForm.get('start_date')?.value)){
      if(this.getUserDataS['id_role'] === 1){
        this._orderService.filterOrdersByDate(this.filterByDateForm.value).subscribe((response)=>{
          this.allOrder$ = response.data;
          this.pagination = response.pagination;
        })
      } else if(this.getUserDataS['id_role'] === 3){
        this.filterByDateForm.controls['id_agency'].setValue(this.idAgency);
        this._orderService.filterOrdersByDate(this.filterByDateForm.value).subscribe((response)=>{
          this.allOrder$ = response.data;
          this.pagination = response.pagination;
        })
      }
    } else {
      this._toastr.warning('Ngày của bạn chọn không hợp lệ');
    }
  }

  /**
    * Get user data in local
    */
  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }

    if (this.getUserDataS['id_role'] === 3) {
      this.idAgency = this.getSubData['id_agency'];
    }
  }
}
