import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.css'
  ]
})
export class CartComponent implements OnInit{

  getCartDetails: any = [];
  getCartByIdAgency: any = [];
  getUserDetails: any = [];
  private _api_url = API_URL;
  pagination: any;
  quantity: number = 0;
  allCartItem: any;
  allOrder: any;
  totalItem: number = 0;
  idUser: number = 0;
  idAgency: number = 0;
  checkDelete: string = "";

  /**
    * constructor
    */
  constructor(
    public _cartService: CartService,
    public _authService: AuthService,
    public _orderService: OrderService,
    private _router: Router,
    private _toastr: ToastrService,
  ) {}

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.userDetails();
    this.storeLocalCart();
    this.loadAllOrder();
    this.loadAllCartItem();
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
    * function to get all cart item
    */
  loadAllCartItem(){
    this._cartService.refreshListCartItem(this.idUser).subscribe((response)=>{
      this.getCartByIdAgency = response;
      console.log(this.getCartByIdAgency)
      this.storeLocalCart();
    });
  }

  /**
    * function to get all order 
    */
  loadAllOrder(){
    this._orderService.refreshListOrder().subscribe((response)=>{
      this.pagination = response.pagination;
      this.allOrder = response.data;
    });
  }

  /**
    * function to all local cart
    */
  storeLocalCart(){
    this.getCartDetails = [];
    this.getCartByIdAgency.forEach(element => {
      element["pro_item"].forEach(item => {
        this.getCartDetails.push(item);
      })
    });
    localStorage.setItem('localCart', JSON.stringify(this.getCartDetails));
  }


  /**
    * function decrease cart item your choose in cart
    */
  decreaseQuantity(cartitem){
    cartitem.quantity = cartitem.quantity - 1  
    this._cartService.updateToCart(cartitem).subscribe((): void=>{
      this.loadAllOrder();
      this.loadAllCartItem();
    });
  }

  /**
    * function increase cart item your choose in cart
    */
  increaseQuantity(cartitem, quantity){
    if(cartitem.quantity < quantity){
      cartitem.quantity = cartitem.quantity + 1;
      this._cartService.updateToCart(cartitem).subscribe((): void=>{
        this.loadAllOrder();
        this.loadAllCartItem();
      })
    } else {
      this._toastr.warning('Số lượng sản phẩm không cung cấp đủ san phẩm');
    }
  }

  /**
    * function to delete cart
    */
  deleteSelectedCart(cartID){
    //remave item server
    this._cartService.deleteCart(cartID).subscribe((res)=>{
      console.log(res)
      this.checkDelete = res as unknown as string
      if(this.checkDelete === 'ok'){
        this.loadAllCartItem();
        window.location.reload();
      }   
    });
  }

  /**
    * function to cart item count
    */
  cartItemCount(){
    if(localStorage.getItem('localCart') !== null){
      var cartJson = JSON.parse(localStorage.getItem('localCart')!);
      this.totalItem = cartJson.length;
      this._authService.cartSubject.next(this.totalItem);
    }
  }

  /**
    * function to create order item
    */
  createOrderItem(data){
    this._orderService.addOrderItem(data).subscribe((response)=>{
      this._router.navigate(['/checkout/', response.id_order]);
    })
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  }
}