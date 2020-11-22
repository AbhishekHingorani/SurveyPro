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

  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute) {}

  login(creds) {
    return this.http.post(
        this.baseUrl + "login",
        JSON.stringify(creds),
        this.httpOptions
      );
  }

  register(creds) {
    return this.http.post(
        this.baseUrl + "register",
        JSON.stringify(creds),
        this.httpOptions
      );
  }

  googleAuthentication() {
    window.open('http://localhost:8989/login/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
    let listener = window.addEventListener('message', (message) => {
      if(message && message.data && message.data.token) {
        this.saveTokenAndNavigate(message.data.token);
      } else {
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
    if(responseObj.expires==='1d'){
      expires = moment().add(1, 'd');
    } else {
      throw Error('Token Expiration was not as Expected. Expected value is one day');
    }
    
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
  }          

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }    
}
