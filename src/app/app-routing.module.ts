import { AuthGuard } from '../app/helpers/AuthGuard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { ValidateOTPComponent } from './component/validate-otp/validate-otp.component';
import { DashboardComponent } from '../app/component/dashboard/dashboard.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'verify-otp', component: ValidateOTPComponent },

  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }