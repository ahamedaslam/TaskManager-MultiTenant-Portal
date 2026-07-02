/**
 * RequestHelper Service
 * 
 * Purpose:
 * This helper service encapsulates HTTP logic for sending requests to the backend API.
 * It provides a central place for routing HTTP requests, configuring default headers, 
 * implementing error management, and handling local authentication state.
 * 
 * Features:
 * 1. HTTP Methods Wrapper (sendData): Supports GET, POST, PUT, and DELETE.
 * 2. Cache Busting: Automatically appends a timestamp query parameter to GET requests to prevent cached browser responses.
 * 3. Authorization Headers: Automatically attaches the JWT bearer token from sessionStorage to the 'Authorization' header of requests.
 * 4. Error Handling: Intercepts network & HTTP errors (401, 403, 404, 500, etc.) to trigger Toastr messages, clear storage on session expiry, and redirect to the login screen.
 * 5. Credentials Helper: Provides utility methods for "Remember Me" credential preservation using localStorage.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestHelper {
  private BASEURL = 'https://localhost:7000'; //your API base if needed
  private rememberMeKey = 'rememberMe';
  private storedCredentialsKey = 'storedCredentials';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  sendData(method: string, url: string, data?: any, options?: any): Observable<any> {
    let fullUrl = `${this.BASEURL}/${url}`;
    //This is a common technique called cache busting. By adding a unique timestamp to each GET request, it prevents browsers or proxies from serving a cached response, ensuring the client always gets the latest data from the server.
    // Timestamp for GET requests to avoid cahed responses from API
    if (method.toUpperCase() === 'GET') {
      const timestamp = new Date().getTime();
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + `t=${timestamp}`;
    }

    //Used to set request headers.
    //Authorization: Adds a Bearer token from localStorage (if available) for authenticated requests.
    // Default headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      //tells the server that the request body is in JSON format.
      'Authorization': `Bearer ${this.getToken() || ''}`
    });

    options = options || { headers };

    //Observable is a way to handle asynchronous data streams. 
    let request$: Observable<any>;
    //Depending on the HTTP method, it calls the appropriate Angular HttpClient method
    //Observables allow developers to work with asynchronous data
    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get(fullUrl, options);
        break;
      case 'POST':
        request$ = this.http.post(fullUrl, data, options);
        break;
      case 'PUT':
        request$ = this.http.put(fullUrl, data, options);
        break;
      case 'DELETE':
        request$ = this.http.delete(fullUrl, options);
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    return request$.pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Token helper
  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // Auth check
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.toastr.error(error?.error?.responseDescription || 'Unauthorized');
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    } else if (error.status === 403) {
      this.toastr.error(error?.error?.responseDescription || 'Access denied');
    } else if (error.status === 404) {
      this.toastr.error(error?.error?.responseDescription || 'API not found');
    } else if (error.status >= 500) {
      this.toastr.error('Server error. Please try again later.');
    } else if (error.error?.errors) {
      for (const field in error.error.errors) {
        if (error.error.errors.hasOwnProperty(field)) {
          error.error.errors[field].forEach((msg: string) => {
            this.toastr.error(msg, 'Validation Error');
          });
        }
      }
    } else {
      this.toastr.error('Something went wrong.');
    }

    return throwError(() => error);
  }

  // Remember Me
  //In local storage
  //Stores the username (or credentials) as a JSON string under storedCredentials.
  storeRememberMe(username: string): void {
    localStorage.setItem(this.rememberMeKey, 'true');
    localStorage.setItem(this.storedCredentialsKey, JSON.stringify(username));
  }

  clearRememberMe(): void {
    localStorage.removeItem(this.rememberMeKey);
    localStorage.removeItem(this.storedCredentialsKey);
  }

  getRememberMe(): boolean {
    return localStorage.getItem(this.rememberMeKey) === 'true';
  }

  getStoredCredentials(): { username: string; password: string } | null {
    const creds = localStorage.getItem(this.storedCredentialsKey);
    return creds ? JSON.parse(creds) : null;
  }
}
