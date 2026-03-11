import { AuthGuard } from '../app/helpers/AuthGuard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { ValidateOTPComponent } from './component/validate-otp/validate-otp.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LayoutComponent } from './component/Layout/layout/layout.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'verify-otp', component: ValidateOTPComponent },

  /* Protected Layout Routes */

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }