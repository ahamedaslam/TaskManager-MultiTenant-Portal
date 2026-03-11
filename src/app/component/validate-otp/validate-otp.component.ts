import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RequestHelper } from '../../helpers/RequestHelper';
import { VERIFYOTPURL } from '../../Utility/ServiceConstant';

//decoratosr to define the component
@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.css']   
})
export class ValidateOTPComponent implements OnInit {

  otpArray = new Array(6).fill('');
  otpForm!: FormGroup;
  username!: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestHelper: RequestHelper,
    private toastr: ToastrService
  ) {}
//ngOnInit is a method that Angular calls automatically after the component’s constructor
  ngOnInit(): void {
    // read username from login navigation
    this.username = this.route.snapshot.queryParams['username'];

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
    });
  }

 validateOTP() {
  console.log("validateOTP called");

  console.log('OTP Array:', this.otpArray);
    const otpValue = this.otpArray.join('');

  if (otpValue.length < 4) {
    this.toastr.warning("Please enter valid OTP");
    return;
  }

  const payload = {
    userName: this.username,
    otp: otpValue
  };

  this.loading = true;

  console.log('Sending OTP verification request with payload:', payload);
  this.requestHelper.sendData('POST', VERIFYOTPURL, payload).subscribe({
    next: (res) => {
      console.log('Verify OTP API call successful:', res);
      this.loading = false;

      if (res.responseCode == 0) {
        this.toastr.success("OTP Verified!");

        //Store data in sessionStorage
        sessionStorage.setItem('accessToken', res.responseDatas.accessToken);
        sessionStorage.setItem('refreshToken', res.responseDatas.refreshToken);
        sessionStorage.setItem('expiresAt', res.responseDatas.expiresAt);
        sessionStorage.setItem('user', JSON.stringify(res.responseDatas.user));

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        this.toastr.error(res.responseDescription || "Invalid OTP");
      }
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error("Something went wrong");
    }
  });
}

trackByIndex(index: number): number {
  return index;
}

moveNext(event: any, index: number) {

  const input = event.target as HTMLInputElement;
  const value = input.value;

  if (!/^\d$/.test(value)) {
    input.value = '';
    return;
  }

  this.otpArray[index] = value;

  if (index < this.otpArray.length - 1) {
    const next = input.nextElementSibling as HTMLInputElement;
    next?.focus();
  }

}


movePrev(event: KeyboardEvent, index: number) {

  const input = event.target as HTMLInputElement;

  if (event.key === 'Backspace') {

    this.otpArray[index] = '';

    if (index > 0 && !input.value) {
      const prev = input.previousElementSibling as HTMLInputElement;
      if (prev) {
        prev.focus();
      }
    }

  }

}

} 