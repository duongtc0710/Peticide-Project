import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { API_URL } from 'src/app/config/url.constants';
import { ProductService } from 'src/app/services/product.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'list-product',
  templateUrl: './product.component.html',
  styleUrls: [ './product.component.css'
  ]
})

export class ProductComponent implements OnInit {

  private _api_url = API_URL;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('btnClose') btnClose! : ElementRef;
  filterForm!: FormGroup;
  allProducts$: any;
  oldProduct$: any;
  pagination: any;
  page: number = 1;
  searchKey: string = 'pro';
  valueSort: string = "";

  /**
    * Constructor
    */  
  constructor(
    public _productService: ProductService,
    private _formBuilder: FormBuilder
  ) {}

  /**
    * ngOnInit
    */  
  ngOnInit(): void 
  {
    this.filterForm = this._formBuilder.group({
      chat_dan_du_con_trung: [''],
      thuoc_dieu_hoa_sinh_truong: [''],
      thuoc_tru_benh: [''],
      thuoc_tru_chuot: [''],
      thuoc_tru_co: [''],
      thuoc_tru_oc: [''],
      thuoc_tru_sau: [''],
      search_key: ['']
    });  

    //Load products
    this.loadProducts();

    //Search product
    this._productService._search.pipe(
      takeUntil(this._unsubscribeAll),
      switchMap((query) => {
        // Search product with service
        this.searchKey = query;
        return this._productService.searchProducts(this.searchKey);
      })
    ).subscribe((response)=>{
      this.allProducts$ = response.data;
      this.pagination = response.pagination;
    })
  }

  /**
    * function to get all products
    */  
  loadProducts(): void 
  {
    this._productService.refreshListProduct(this.page).subscribe((response)=>{
      console.log(response)
      this.allProducts$ = response.data;
      this.oldProduct$ = response.data;
      this.pagination = response.pagination;
    });
  }

  /**
    * function to change page
    */  
  changePage(event: any): void
  {
    this.page = event;
    this.loadProducts();
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string): string 
  {  
    return `${this._api_url}${serverPath}`;  
  } 

  /**
    * function to sort product by price
    */
  sortProductByPrice(option: any){
    this.valueSort = option.target.value; 
    if(this.valueSort === '10to50'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 10000 && element.price <= 50000));
    } else if(this.valueSort === '50to100'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 50000 && element.price <= 100000));
    } else if(this.valueSort === '100to200'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 100000 && element.price <= 200000));
    } else if(this.valueSort === '200to350'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 250000 && element.price <= 350000));
    } else if(this.valueSort === '350to450'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 350000 && element.price <= 450000));
    } else if(this.valueSort === '450toBig'){
      this.allProducts$ = this.oldProduct$;
      this.allProducts$ = _.filter(this.allProducts$, element => (element.price >= 450000));
    } else {
      this.allProducts$ = this.oldProduct$;
    }
  }

  /**
    * function to sort product By Price
    */
  changeSortByPrice(event: any) {
    switch (event.target.value) {
      case "Low":
        {
          this.allProducts$ = this.allProducts$.sort((low, high) => low.price - high.price);
          break;
        }
      case "High":
        {
          this.allProducts$ = this.allProducts$.sort((low, high) => high.price - low.price);
          break;
        }
      case "Name":
        {
          this.allProducts$ = this.allProducts$.sort(function (low, high) {
            if (low.name_product < high.name_product) {
              return -1;
            }
            else if (low.name_product > high.name_product) {
              return 1;
            }
            else {
              return 0;
            }
          })
          break;
      }
      default: {
        this.allProducts$ = this.allProducts$.sort((low, high) => low.price - high.price);
        break;
      }
    }
    return this.allProducts$;
  }

  /**
    * function to filter by category
    */
  filterCategory(){
    this._productService.filterByCategory(this.filterForm.value).subscribe((res)=>{
      this.allProducts$ = res.data;
      this.pagination = res.pagination;
      this.btnClose.nativeElement.click();
    })
  }
}
