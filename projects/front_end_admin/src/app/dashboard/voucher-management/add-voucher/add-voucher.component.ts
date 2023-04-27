import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Voucher } from 'src/app/models/voucher.model';
import { VoucherService } from 'src/app/services/voucher.service';
import { VoucherManagementComponent } from '../voucher-management.component';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.css'],
})
export class AddVoucherComponent implements OnInit {
  voucherForm!: FormGroup;
  existVou: string = '';
  id: number = 0;
  constructor(
    public _voucherService: VoucherService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _voumanage: VoucherManagementComponent
  ) {}

  ngOnInit(): void {
    this.voucherForm = this._formBuilder.group({
      id_voucher: [''],
      code: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      expirydate: [''],
      description: [''],
    });
  }

  onSubmit() {
    const voucher = this.voucherForm.value;

    if (
      voucher.discount == '' ||
      voucher.discount < 0 ||
      voucher.discount > 100 ||
      voucher.description == '' ||
      voucher.expirydate == ''
    ) {
      this._toastr.warning('Vui lòng nhập thông tin hợp lệ', 'Lỗi!!');
    } else {
      this.createVoucher(voucher);
      this.voucherForm.reset();
    }
  }

  createVoucher(voucher: Voucher) {
    voucher.id_voucher = 0;
    this._voucherService.createVoucher(voucher).subscribe(
      (res) => {
        this.existVou = res as unknown as string;
        this.id = res['id_voucher'] as number;
        if (this.existVou === 'exitst') {
          this._toastr.error('Voucher đã tồn tại', 'Lỗi!');
        } else if (this.id != 0) {
          this._toastr.success('Voucher đã tạo', 'Thành công');
          document.getElementById('closeButton')?.click();
          this._voumanage.loadAllVoucher();
        } else {
          this._toastr.warning('Vui lòng nhập thông tin', 'Lỗi!!');
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }
}
