import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { CartItem } from 'src/app/models/cart.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';


@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  private _api_url = API_URL;
  product: any;
  cartItem1 = new CartItem;
  checkCreateCart: string = '';
  quantityCart: number = 1;
  quantityOfPro: number = 0;
  index = 1;
  totalItem: number = 0;
  itemsCart: any = [];
  getUserDetails: any = [];
  idUser: any;
  quantityForm: any;
  idAgency = 0;
  agencyDetail: any;
  valueRate: number = 0;
  listRate: any;
  pagination: any;
  allDataRate$: any;
  page: number = 1;
  public stars: any[] = new Array(5);

  /**
    * constructor
    */
  constructor(
    public _productService: ProductService,
    public _purchaseService: PurchaseService,
    public _cartService: CartService,
    public _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getRoute(this._route.snapshot.params['id']);
    this.userDetails();
    this.getPurchase();
    this.quantityForm = this._formBuilder.group({
      quantityOfCart: 1
    })
  }  
 
  /**
    * function to get route product
    */
  getRoute(id: number){

    // Get product by id with api
    this._productService.getProductById(id)
    .subscribe((response) => {
      this.product = response;
      this.quantityOfPro = response.quantity;
      this.idAgency = response.id_agency;

      this._authService.getInforAgency(this.idAgency).subscribe((response)=>{
        this.agencyDetail = response;
      });
    });
  }

  /**
    * function to get purchase
    */
  getPurchase(){
    this._purchaseService.getRating(this._route.snapshot.params['id']).subscribe((response)=>{
      this.valueRate = response.rate;
      this.listRate = response.list;
      this.pagination = this.listRate['pagination'];
    })
  }

  /**
    * function to change page
    */  
  changePage(event: any): void
  {
    this.page = event;
    this.getPurchase();
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  } 

  /**
    * function to increate quantity of product
    */
  increaseQuantity(old_quantity){
    if((this.quantityCart < old_quantity) && (this.quantityForm.get('quantityOfCart').value < this.quantityOfPro)){
      this.index++;
      this.quantityCart = this.index;
      this.quantityForm.controls['quantityOfCart'].setValue(this.quantityCart);
    } else {
      this._toastr.warning("Không đủ số lượng sản phẩm");
    }
  }

  /**
    * function to decreate quantity of product
    */
  decreaseQuantity(){
    if(this.index != 1){
      this.index--;
      this.quantityCart = this.index;
      this.quantityForm.controls['quantityOfCart'].setValue(this.quantityCart);
    }
  }

  /**
    * function to get all user in localStorage
    */
  userDetails(){
    if(localStorage.getItem('user.id_acc')){
      this.getUserDetails = JSON.parse(localStorage.getItem('user.id_acc')!);
      this.idUser = this.getUserDetails["id_acc"];
    }
  }

  /**
    * function to add cart
    */
  createToCart(cartItem)
  {
    //If quantity of input high quantity 
    if(this.quantityForm.get('quantityOfCart').value > this.quantityOfPro){
      this._toastr.warning("Không đủ số lượng sản phẩm");
    } else {
      //Set value cart item to add
      this.cartItem1.id_customer = this.idUser;
      this.cartItem1.id_product = parseInt(this._route.snapshot.params['id']);
      this.cartItem1.quantity = this.quantityForm.get('quantityOfCart').value;
      console.log(this.cartItem1)
      let cartDataNull = localStorage.getItem("localCart");
      if(cartDataNull === null){
        let stortDataGet: any = [];
        stortDataGet.push(this.cartItem1);
        localStorage.setItem("localCart", JSON.stringify(stortDataGet));
      } else {
        //Set id equa id_product
        var id = this.cartItem1.id_product;
        let index: number = -1;
        this.itemsCart = JSON.parse(localStorage.getItem('localCart')!);
        localStorage.setItem("localCart", JSON.stringify(this.itemsCart));
        //Loop each item cart
        for(let i = 0; i < this.itemsCart.length; i++){
          //if id equa id of product when it change value quatity
          if(id === this.itemsCart[i].id_product)
          {
            this.itemsCart[i].quantity = this.cartItem1.quantity;
            index = i;
            break;
          }
        }
        if(index === -1){
          //Push in itemsCart
          this.itemsCart.push(this.cartItem1);
          localStorage.setItem("localCart", JSON.stringify(this.itemsCart));
        } else {
          localStorage.setItem("localCart", JSON.stringify(this.itemsCart));
        }
      }

      //Call fuc cart count
      this.cartItemCount();

      //Add to cart with server
      this._cartService.addToCart(this.cartItem1).subscribe((response)=>{});
    }
  }

  /**
    * function to cart item count
    */
  cartItemCount(){
    var cartJson = JSON.parse(localStorage.getItem('localCart')!);
    this.totalItem = cartJson.length;
    this._authService.cartSubject.next(this.totalItem);
  }

  /**
    * function of button add to cart
    */
  onBtnAddToCart(cartItem){
    if(localStorage.getItem('user.id_acc') === null){
      this._router.navigate(['/sign-in']);
    } else {
      this.createToCart(cartItem);
    }
  }
}
