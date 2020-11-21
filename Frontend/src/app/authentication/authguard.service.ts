import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Authguard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    if(this.auth.isLoggedIn()) return true;

    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
