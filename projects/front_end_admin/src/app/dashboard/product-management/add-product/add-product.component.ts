import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductManagementComponent } from '../product-management.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.css'],
})
export class AddProductComponent implements OnInit {
  @ViewChild('btnClose') btnClose!: ElementRef;
  checkInsertPro: string = '';
  checkInsertCate: string = '';
  productForm!: FormGroup;
  existPro: string = '';
  id: number = 0;
  selectedFiles!: FileList;
  imgURL: string = '';
  idAgency: number = 0;
  getDetail: any = [];
  getItemCategory = '';
  fileToUpload: File | any;
  imageUrl!: string;
  imageUrl1!: string;
  imageUrl2!: string;

  imageurls: any;

  constructor(
    public _productService: ProductService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private promanage: ProductManagementComponent
  ) {}

  ngOnInit(): void {
    this.getIdAgency();
    // Create the form
    this.productForm = this._formBuilder.group({
      id_product: [''],
      name_product: ['', [Validators.required]],
      price: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      expirydate: [''],
      description: [''],
      id_agency: [''],
      category: [''],
      image_defaul: ['', [Validators.required]],
      image1: [''],
      image2: [''],
    });
  }

  /**
   * get id_agency in local
   */
  getIdAgency() {
    if (localStorage.getItem('subdata')) {
      this.getDetail = JSON.parse(localStorage.getItem('subdata')!);
    }
  }

  get productFormControl() {
    return this.productForm.controls;
  }

  /**
   * Send the message
   */
  onSubmit(): void {
    const product = this.productForm.value;
    const regex = this.productForm.controls;

    if (
      product.name_product == '' ||
      product.brand == '' ||
      product.price == 0 ||
      product.quantity == 0 ||
      product.category.value == "" ||
      product.expirydate == '' ||
      //regular expression
      regex['price'].invalid ||
      regex['quantity'].invalid
    ) {
      this._toastr.warning('Thông tin chưa hợp lệ', 'Lỗi!!');
    } else {
      this.createProduct(product);
    }
  }

  /**
   * Create product
   */
  createProduct(product: Product): void {
    product.id_product = 0;
    product.id_agency = this.getDetail['id_agency'];
    product.category = this.getItemCategory;
    console.log(product)

    this._productService.createProduct(product).subscribe(
      (res) => {
        this.existPro = res as unknown as string;
        this.id = res['id_product'] as number;
        if (this.existPro === 'exitst') {
          this._toastr.error('Tên sản phẩm đã tồn tại', 'Lỗi!');
        } else if (this.existPro === "success") {
          this._toastr.success('Sản phẩm đã tạo', 'Thành công');
          this.promanage.loadAllProduct();
          this.promanage.reloadPage();
          this.btnClose.nativeElement.click();
          this.productForm.reset();
        } else if (this.existPro === 'fail') {
          this._toastr.warning('Thông tin chưa hợp lệ', 'Lỗi');
        } else {
          this._toastr.warning('Vui lòng nhập thông tin', 'Lỗi!!');
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
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

    //Set value form data
    const acc = this.productForm.value;

    //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image_defaul = response[0].file;
      this.productForm.controls['image_defaul'].setValue(response[0].file);
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
    const acc = this.productForm.value;

    //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image1 = response[0].file;
      this.productForm.controls['image1'].setValue(response[0].file);
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
    const acc = this.productForm.value;

    //Upload avatar
    this._productService.uploadFile(this.fileToUpload).subscribe((response) => {
      acc.image2 = response[0].file;
      this.productForm.controls['image2'].setValue(response[0].file);
    });
  }

  // Remove Image
  removeImage(url: any) {
    this.imageurls = this.imageurls.filter((img) => img != url);
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

  resetFormClose(){
    this.productForm.reset();
  }

  /**
   * get value category
   */
  getValueCate(event) {
    this.getItemCategory = event.target.value;
  }
}
