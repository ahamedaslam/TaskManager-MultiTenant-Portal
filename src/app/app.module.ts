import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { ValidateOTPComponent } from './component/validate-otp/validate-otp.component';
import { LayoutComponent } from './component/Layout/layout/layout.component';
import { SidebarComponent } from './component/Layout/sidebar/sidebar.component';
import { NavbarComponent } from './component/Layout/navbar/navbar.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ValidateOTPComponent,
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent
  ],
 imports: [
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,   // must come before toastr
  HttpClientModule,

  ToastrModule.forRoot()
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
