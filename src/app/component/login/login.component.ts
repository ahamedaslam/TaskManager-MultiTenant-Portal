/**
 * LoginComponent
 * 
 * Purpose:
 * This component handles the user login process for the TaskManager Multi-Tenant Portal.
 * It provides a reactive form (loginForm) with fields for 'username' and 'password'.
 * 
 * Flow:
 * 1. The user inputs their credentials and clicks "Login".
 * 2. It sends a POST request with the credentials payload to the LOGINURL via RequestHelper.
 * 3. On success (responseCode === 0):
 *    - Saves tokens (accessToken, refreshToken) and userId in sessionStorage.
 *    - Triggers a success notification using Toastr.
 *    - Pauses for 5 seconds, then routes the user to the OTP verification page (/verify-otp) with the username.
 * 4. Displays an error toast message if credentials are invalid or if a server error occurs.
 */

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestHelper } from '../../helpers/RequestHelper';
import { ToastrService } from 'ngx-toastr';
import { LOGINURL } from '../../Utility/ServiceConstant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private requestHelper: RequestHelper,
    private toastr: ToastrService,
    private router: Router,
  ) {
    //Data entered by the user into the login form (like username and password)
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

//   ngOnInit() {
//   this.toastr.success("Toastr working");
// }

  login() {
  if (this.loginForm.invalid) {
    this.toastr.warning('Please enter both username and password.');
    return;
  }

  this.loading = true;
  const payload = this.loginForm.value;

  this.requestHelper.sendData('POST', LOGINURL, payload).subscribe({
    next: (res) => {
      console.log('Login API call successful:', res);

      if (res.responseCode === 0) {
        sessionStorage.setItem('accessToken', res.responseDatas?.accessToken);
        sessionStorage.setItem('refreshToken', res.responseDatas?.refreshToken);
        sessionStorage.setItem('userId', res.responseDatas?.user?.userId);

        this.toastr.success(res?.responseDatas || 'Login successful');
  // Hold for 5 seconds before navigation
  setTimeout(() => {
    this.router.navigate(['/verify-otp'], {
      queryParams: { username: payload.username }
    });
  }, 5000);
      } else {
        this.toastr.error(res?.responseDescription || 'Login failed. Please try again.');
      }

      this.loading = false;
    },
    error: (err) => {
      console.error('Login API call failed:', err);
      this.loading = false;

      const errorMsg =
        err?.error?.responseDescription ||
        err?.message ||
        'An unexpected error occurred.';

      this.toastr.error(errorMsg);
    }
  });
}

}
