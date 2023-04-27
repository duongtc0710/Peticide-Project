import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: [ './nav-bar.css'
  ]
})
export class NavBarComponent implements OnInit{

  public timersubscription: Subscription = new Subscription();
  searchTerm: string = '';
  totalItem: number = 0;
  getUserDetails: any = [];
  isButtonVisible: boolean = false;
  
  /**
    * constructor
    */
  constructor(public _cartService: CartService,
    public _productService: ProductService,
    public _authService: AuthService,
    private _router: Router,
  ) {
    this._authService.cartSubject.subscribe((data)=>{
      this.totalItem = data;
    });
  }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.userDetails();    
    this.cartItemCount();
  }

  /**
    * function to goad all user in localStorage
    */
  userDetails(){
    if(localStorage.getItem('user.id_acc')){
      this.getUserDetails = JSON.parse(localStorage.getItem('user.id_acc')!);
      return this.isButtonVisible === false;
    }
    else {
      return this.isButtonVisible === true;
    }
  }
 
  /**
    * function to logout
    */
  logout(){
    localStorage.removeItem('user.id_acc');
    localStorage.removeItem('user.sub_acc');
    localStorage.removeItem('access_token');
    this._router.navigate(['/sign-in']);
  }

  /**
    * function to search query
    */
  search(event: any): void {
    if(event){
      this.searchTerm = (event.target as HTMLInputElement).value;
      this._productService._search.next(this.searchTerm);
      this._router.navigate(['/list-product']);
    }
  }

  /**
    * function to cart item count
    */
  cartItemCount(){
    if(localStorage.getItem('localCart') != null){
      var cartJson = JSON.parse(localStorage.getItem('localCart')!);
      this.totalItem = cartJson.length;
    }
  }
}
