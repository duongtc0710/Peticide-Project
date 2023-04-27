import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { CartComponent } from './components/product/cart/cart.component';
import { CheckoutComponent } from './components/product/checkout/checkout.component';
import { OrderSuccessfulComponent } from './components/product/page/order-successful/order-successful.component';
import { PurchaseComponent } from './components/product/page/purchase/purchase.component';
import { OrdersListComponent } from './components/product/orders-list/orders-list.component';
import { OrdersDetailComponent } from './components/product/orders-list/orders-detail/orders-detail.component';
import { SignInComponent } from './components/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { ConfirmPasswordComponent } from './components/authentication/confirm-password/confirm-password.component';
import { ChangePasswordComponent } from './components/authentication/change-password/change-password.component';
import { UserProfileComponent } from './components/authentication/user-profile/user-profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'confirm-password',
    component: ConfirmPasswordComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent
  },
  {
    path: 'change-password/:id',
    component: ChangePasswordComponent
  },
  { 
    path: 'home',
    component: HomeComponent,
  },
  { 
    path: 'list-product',
    component: ProductComponent,
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent
  },
  {
    path: 'order-successful',
    component: OrderSuccessfulComponent
  },
  {
    path: 'purchase/:id',
    component: PurchaseComponent
  },
  {
    path: 'orders-list',
    component: OrdersListComponent
  },
  {
    path: 'orders-detail/:id',
    component: OrdersDetailComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
