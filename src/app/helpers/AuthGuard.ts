import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RequestHelper } from '../helpers/RequestHelper';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private requestHelper: RequestHelper, private router: Router) {}
// Block access to protected routes if no token is present
  canActivate(): boolean {
    if (this.requestHelper.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
