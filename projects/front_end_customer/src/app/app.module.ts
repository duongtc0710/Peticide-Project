import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HomeComponent } from './components/home/home.component';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CartComponent } from './components/product/cart/cart.component';
import { FilterPipe } from './shared/filter.pipe';
import { CheckoutComponent } from './components/product/checkout/checkout.component';
import { OrderSuccessfulComponent } from './components/product/page/order-successful/order-successful.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { PurchaseComponent } from './components/product/page/purchase/purchase.component';
import { OrdersListComponent } from './components/product/orders-list/orders-list.component';
import { OrdersDetailComponent } from './components/product/orders-list/orders-detail/orders-detail.component';
import { SignInComponent } from './components/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { ConfirmPasswordComponent } from './components/authentication/confirm-password/confirm-password.component';
import { ChangePasswordComponent } from './components/authentication/change-password/change-password.component';
import { UserProfileComponent } from './components/authentication/user-profile/user-profile.component';
import { AuthService } from './services/auth.service';
import { Ng9PasswordStrengthBarModule } from 'ng9-password-strength-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MobileNavComponent,
    NavBarComponent,
    FooterComponent,
    ProductComponent,
    ProductDetailsComponent,
    CartComponent,
    FilterPipe,
    CheckoutComponent,
    OrderSuccessfulComponent,
    PurchaseComponent,
    OrdersListComponent,
    OrdersDetailComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ConfirmPasswordComponent,
    ChangePasswordComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule,
    SlickCarouselModule,
    ReactiveFormsModule,  
    NgxStarRatingModule,
    SocialLoginModule,
    Ng9PasswordStrengthBarModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '961938155009-s4r7ecd51o381dlvrs11rcrvnkm4mh82.apps.googleusercontent.com' // add web app client id
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
