import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { ProductService } from 'src/app/services/product.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.css'],
})
export class ProductManagementComponent implements OnInit {

  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  p: number = 1;
  page: number = 1;
  closeResult: string = '';
  allProducts$: any;
  pagination: any;
  public _api_url = API_URL;
  selectedProductForm!: FormGroup;
  existProduct: string = '';
  searchKey: string = 'cate';
  getDetail: any = [];
  idAgency: number = 0;
  fileToUpload!: File;
  imageUrl!: string;
  imageUrl1!: string;
  imageUrl2!: string;
  urlCover: string = '';
  urlImage1: string = '';
  urlImage2: string = '';
  getItemCategory: string = '';
  getLocal: any = [];
  roleLocal = 0;
  disableBtn: boolean = false;
  idStatus: number = 0;

  constructor(
    public _productService: ProductService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getIdAgency();
    // Create the form
    this.selectedProductForm = this._formBuilder.group({
      id_product: [''],
      name_product: ['', [Validators.required]],
      price: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      expirydate: [''],
      description: [''],
      id_agency: [''],
      category: [''],
      status: [''],
      image_defaul: ['', [Validators.required]],
      image1: [''],
      image2: [''],
    });

    this.loadAllProduct();

    // Search input category
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          // Search category with service
          this.searchKey = query;
          return this._productService.searchProducts(this.searchKey);
        })
      )
      .subscribe((res) => {
        this.allProducts$ = res.data;
        this.pagination = res.pagination;
      });
  }

  /**
   * load all product
   */
  loadAllProduct() {
    if (this.getLocal['id_role'] === 1) {
      this._productService.refreshListProduct(this.page).subscribe((res) => {
        this.allProducts$ = res.data;
        this.pagination = res.pagination;
      });
    } else {
      this._productService
        .refreshListProductByAgency(this.page, this.getDetail['id_agency'])
        .subscribe((res) => {
          this.allProducts$ = res.data;
          this.pagination = res.pagination;
        });
    }
  }

  /**
   * reload page
   */
  reloadPage() {
    const img = document.createElement('img');
    document.getElementById('imgPath')?.replaceWith('<img>');
  }

  /**
   * selected category
   */
  onUpdate(row: any) {
    if(this.getLocal['id_role'] == 1){
      this.disableInputForAdmin();
    }

    this.selectedProductForm.controls['id_product'].setValue(row.id_product);
    this.selectedProductForm.controls['name_product'].setValue(
      row.name_product
    );
    this.selectedProductForm.controls['price'].setValue(row.price);
    this.selectedProductForm.controls['description'].setValue(row.description);
    this.selectedProductForm.controls['brand'].setValue(row.brand);
    this.selectedProductForm.controls['quantity'].setValue(row.quantity);
    this.selectedProductForm.controls['expirydate'].setValue(row.expirydate);
    this.selectedProductForm.controls['image_defaul'].setValue(
      row.image_defaul
    );
    this.selectedProductForm.controls['image1'].setValue(row.image1);
    this.selectedProductForm.controls['image2'].setValue(row.image2);
    this.selectedProductForm.controls['id_agency'].setValue(row.id_agency);
    this.selectedProductForm.controls['category'].setValue(row.category);

    if (row.status == 0) {
      document.getElementById('true')?.click();
    } else if (row.status == 1) {
      document.getElementById('false')?.click();
    } else if (row.status == 2) {
      document.getElementById('block')?.click();
    }

    this.idStatus = row.status;
    this.getItemCategory = row.category;
    this.urlCover = row.image_defaul;
    this.urlImage1 = row.image1;
    this.urlImage2 = row.image2;
  }

  /**
   * get agency in local
   */
  getIdAgency() {
    if (localStorage.getItem('userData')) {
      this.getLocal = JSON.parse(localStorage.getItem('userData')!);
    }
    if (localStorage.getItem('subdata')) {
      this.getDetail = JSON.parse(localStorage.getItem('subdata')!);
    }
  }

  disableButtonAdd() {
    if (this.getLocal['id_role'] === 3) {
      return this.disableBtn === false;
    }
    return this.disableBtn === true;
  }

  // open dialog delete
  openDialog(content, proID) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === 'yes') {
            this.deleteSelectedProduct(proID);
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
  deleteSelectedProduct(id: number): void {
    // Delete the product on the server
    this._productService.deleteProduct(id).subscribe(() => {
      this._toastr.success('Đã xóa sản phẩm', 'Thành công');
      // Reload product list
      this.loadAllProduct();
    });
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

  /**
   * Change page
   */
  changePage(event: any): void {
    this.page = event;
    this.loadAllProduct();
  }

  /**
   * Upload image_defaul
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

    // //Set value form data
    const acc = this.selectedProductForm.value;

    // //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image_defaul = response[0].file;
      this.selectedProductForm.controls['image_defaul'].setValue(
        response[0].file
      );
      this.urlCover = response[0].file;
    });
  }

  /**
   * Upload image1
   *
   */
  selectedFile1(imageInput: any): void {
    const file: File = imageInput.files[0];

    this.fileToUpload = file;

    var reader = new FileReader();

    reader.onload = (event: any) => {
      //Change image on load
      this.imageUrl1 = event.target.result;
    };

    //Read file
    reader.readAsDataURL(file);

    //Set value form data
    const acc = this.selectedProductForm.value;

    //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image1 = response[0].file;
      this.selectedProductForm.controls['image1'].setValue(response[0].file);
      this.urlImage1 = response[0].file;
    });
  }

  /**
   * Upload image2
   *
   */
  selectedFile2(imageInput: any): void {
    const file: File = imageInput.files[0];

    this.fileToUpload = file;

    var reader = new FileReader();

    reader.onload = (event: any) => {
      //Change image on load
      this.imageUrl2 = event.target.result;
    };

    //Read file
    reader.readAsDataURL(file);

    //Set value form data
    const acc = this.selectedProductForm.value;

    //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image2 = response[0].file;
      this.selectedProductForm.controls['image2'].setValue(response[0].file);
      this.urlImage2 = response[0].file;
    });
  }

  /**
   * Upload files
   */
  uploadFiles(): void {
    this._productService.uploadFile(this.fileToUpload).subscribe((res) => {});
  }

  /**
   * open files
   */
  handleClick() {
    document.getElementById('fileInput')?.click();
  }

  /**
   * open files
   */
  handleClick1() {
    document.getElementById('fileInput1')?.click();
  }

  /**
   * open files
   */
  handleClick2() {
    document.getElementById('fileInput2')?.click();
  }

  /**
   * Update the selected product using the form mock-api
   */
  updateSelectedProduct(): void {
    // Get the product object
    const product = this.selectedProductForm.getRawValue();
    // Update the product on the server
    this._productService.updateProduct(product).subscribe(
      (res) => {
        this.existProduct = res as unknown as string;
        if (this.existProduct === 'exitst') {
          this._toastr.error('Tên sản phẩm đã tồn tại', 'Lỗi!');
        } else {
          this._toastr.success('Đã cập nhật sản phẩm', 'Thành công');
          this.loadAllProduct();
          document.getElementById('buttonClose')?.click();
          this.selectedProductForm.reset();
        }
      },
      () => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }

  /**
   * Get url image
   */
  createImgPath(serverPath: string) {
    return `${this._api_url}${serverPath}`;
  }

  /**
   * get value category
   */
  getValueCate(event) {
    this.getItemCategory = event.target.value;
  }

  disableInputForAdmin(){
    this.selectedProductForm.controls['name_product'].disable();
    this.selectedProductForm.controls['price'].disable();
    this.selectedProductForm.controls['description'].disable();
    this.selectedProductForm.controls['brand'].disable();
    this.selectedProductForm.controls['quantity'].disable();
    this.selectedProductForm.controls['expirydate'].disable(); 
    this.selectedProductForm.controls['category'].disable();
    this.selectedProductForm.controls['image_defaul'].disable();
    this.selectedProductForm.controls['image1'].disable();
    this.selectedProductForm.controls['image2'].disable();
  }
}
