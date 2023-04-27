import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'purchase',
  templateUrl: './purchase.component.html',
  styles: [
  ]
})
export class PurchaseComponent implements OnInit {

  @ViewChild('content') content!: ElementRef;  
  @ViewChild('detail') detail!: ElementRef;  
  ratingForm!: FormGroup;
  private _api_url = API_URL;
  allProduct:any;
  allOrderItem: any;
  productID: number = 0;
  closeResult: string = "";
  ratingPro = {};

  /**
    * constructor
    */
  constructor(
    public _purchaseService: PurchaseService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _toastr: ToastrService,
  ) { }

  
  /**
    * ngOnInit
    */
  ngOnInit(): void { 

    this.ratingForm = this._formBuilder.group({
      rating: [''],
      content: [null] 
    });

    this.getRoute(this._route.snapshot.params['id']);
  }

  /**
    * function to get route product
    */
  getRoute(id: number){
    this._purchaseService.refreshListRatingItem(id).subscribe((response)=>{
      this.allProduct = response['productItem'];
      this.allOrderItem = response['orderItem']
    })
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string): string 
  {  
    return `${this._api_url}${serverPath}`;  
  } 

  /**
    * function to open dialog 
    */
  openDialogRating(content: any): void{
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
        if (result === 'yes') { 
          this.ratingOfProduct();
        }  
      }, (reason) => {  
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }
  
  /**
    * function to get dismiss reason
    */
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
    * function of button rating
    */
  onBtnRating(id_product: any): void{
    this.productID = id_product;
    this.openDialogRating(this.content);
  }

  /**
    * function to create rating of product
    */
  ratingOfProduct(): void{
   
    //create object post rating
    this.ratingPro = {
      "id_invoice": 1,
      "id_product": this.productID,
      "rate": this.ratingForm.get('rating')?.value,
      "content": this.ratingForm.get('content')?.value
    }

    //post rating with api
    this._purchaseService.postRatingProduct(this.ratingPro).subscribe((response): void=>{
      this.productID = 0;
      this._toastr.success('Cảm ơn bạn đã đánh giá sản phẩm'); 
      this.ratingForm.reset();
    })
  }
}
