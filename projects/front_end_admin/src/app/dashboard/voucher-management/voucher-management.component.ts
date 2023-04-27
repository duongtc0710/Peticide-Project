import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VoucherService } from 'src/app/services/voucher.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.css'],
})
export class VoucherManagementComponent implements OnInit {
  selectedVoucherForm!: FormGroup;
  page: number = 1;
  allVoucher$: any;
  pagination: any;
  closeResult: string = '';

  constructor(
    public _voucherService: VoucherService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.selectedVoucherForm = this._formBuilder.group({
      id_voucher: [''],
      code: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      expirydate: [''],
    });

    this.loadAllVoucher();
  }

  loadAllVoucher() {
    this._voucherService.refreshListVoucher(this.page).subscribe((res) => {
      this.allVoucher$ = res.data;
      this.pagination = res.pagination;
    });
  }

  // open dialog delete
  openDialog(content, vouID) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === 'yes') {
            this.deleteSelectedVoucher(vouID);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  /**
   * Delete the selected product
   */
  deleteSelectedVoucher(id: number): void {
    // Delete the product on the server
    this._voucherService.deleteProduct(id).subscribe(() => {
      this._toastr.success('Đã xóa voucher', 'Thành công');
      // Reload product list
      this.loadAllVoucher();
    });

    // Delete the category of product on the server
    // this._productService.deleteCateOfPro(product.id_product).subscribe(() => {});
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  changePage(event: any): void {
    this.page = event;
    this.loadAllVoucher();
  }
}
