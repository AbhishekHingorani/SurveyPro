import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from "moment";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8989/';

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Login API
  login(creds) {
    return this.http.post(
        this.baseUrl + "login",
        JSON.stringify(creds),
        this.httpOptions
      );
  }

  // Register API
  register(creds) {
    return this.http.post(
        this.baseUrl + "register",
        JSON.stringify(creds),
        this.httpOptions
      );
  }

  googleAuthentication() {
    // Opening a new child browser window with the backend URL for google redirect.
    window.open('http://localhost:8989/login/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
    // Adding event listener to the child window to get its response.
    let listener = window.addEventListener('message', (message) => {
      if(message && message.data && message.data.token) {
        // If token was returned by the child google window, save it and redirect.
        this.saveTokenAndNavigate(message.data.token);
      } else {
        // Show error if login failed.
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Error in Authentication',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      }
    });
  }

  saveTokenAndNavigate(tokenData) {
    this.setLocalStorage(tokenData);
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate(['forms/list']);
  }

  setLocalStorage(responseObj) {
    let expires;
    // We expect the token expiration date to be 1d always.
    // This can be modified in the future to expect a dynamic value.
    if(responseObj.expires==='1d'){
      expires = moment().add(1, 'd');
    } else {
      throw Error('Token Expiration was not as Expected. Expected value is one day');
    }
    
    // Setting token and expiration time in local storage.
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
  }          

  logout() {
    // Deleting all local storage to logout.
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
  }

  isLoggedIn() {
    // If the token is not expired, return true.
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    // Getting expiration time from local storage.
    const expiration = localStorage.getItem('expires');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }    
}
