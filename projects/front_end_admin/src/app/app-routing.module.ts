import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './dashboard/product-management/product-management.component';
import { AccountManagementComponent } from './dashboard/account-management/account-management.component';
import { DiseaseComponent } from './engineer/disease/disease.component';
import { AngencyManagementComponent } from './dashboard/angency-management/angency-management.component';
import { ProfileManageComponent } from './dashboard/profile-manage/profile-manage.component';
import { VoucherManagementComponent } from './dashboard/voucher-management/voucher-management.component';
import { LoginComponent } from './authentication/login/login.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './authentication/confirm-code/confirm-code.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { ChatComponent } from './engineer/chat/chat.component';
import { OrderManagementComponent } from './dashboard/order-management/order-management.component';
import { AIIntentsComponent } from './engineer/ai-intents/ai-intents.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'confirm-password',
    component: ConfirmCodeComponent
  },
  {
    path: 'change-password/:id',
    component: ChangePasswordComponent
  },
  { path: 'dashboard',
    component: DashboardComponent,
  },
  { path: 'product-management',
    component: ProductManagementComponent
  },
  { path: 'account-management',
    component: AccountManagementComponent
  },
  {
    path: 'disease',
    component: DiseaseComponent
  },
  {
    path: 'agency-management',
    component: AngencyManagementComponent
  },
  {
    path: 'profile-manage',
    component: ProfileManageComponent
  },
  {
    path: 'voucher-management',
    component: VoucherManagementComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'order-management',
    component: OrderManagementComponent
  },
  {
    path: 'ai-intents',
    component: AIIntentsComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
