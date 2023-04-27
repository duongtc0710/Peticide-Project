import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './dashboard/product-management/product-management.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';
import { AddProductComponent } from './dashboard/product-management/add-product/add-product.component';
import { AccountManagementComponent } from './dashboard/account-management/account-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddAccountComponent } from './dashboard/account-management/add-account/add-account.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SlideToggleModule } from 'ngx-slide-toggle';
import { DiseaseComponent } from './engineer/disease/disease.component';
import { AddDiseaseComponent } from './engineer/disease/add-disease/add-disease.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchFilterPipe } from './search-filter.pipe';
import { AngencyManagementComponent } from './dashboard/angency-management/angency-management.component';
import { ProfileManageComponent } from './dashboard/profile-manage/profile-manage.component';
import { VoucherManagementComponent } from './dashboard/voucher-management/voucher-management.component';
import { AddVoucherComponent } from './dashboard/voucher-management/add-voucher/add-voucher.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './authentication/confirm-code/confirm-code.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ChatComponent } from './engineer/chat/chat.component';
import { OrderManagementComponent } from './dashboard/order-management/order-management.component';
import { AIIntentsComponent } from './engineer/ai-intents/ai-intents.component';
import { AddIntentsComponent } from './engineer/ai-intents/add-intents/add-intents.component';
import { LoaderService } from './services/loader.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductManagementComponent,
    NavbarComponent,
    AddProductComponent,
    AccountManagementComponent,
    AddAccountComponent,
    DiseaseComponent,
    AddDiseaseComponent,
    SearchFilterPipe,
    AngencyManagementComponent,
    ProfileManageComponent,
    VoucherManagementComponent,
    AddVoucherComponent,
    ForgotPasswordComponent,
    ConfirmCodeComponent,
    ChangePasswordComponent,
    ChatComponent,
    OrderManagementComponent,
    AIIntentsComponent,
    AddIntentsComponent,
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
    SlideToggleModule,
    NgSelectModule,
    ReactiveFormsModule,
  ],
  providers: [LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
