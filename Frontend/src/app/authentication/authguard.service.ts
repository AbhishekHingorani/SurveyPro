import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class Authguard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  // This route guard will prevent users from accessing protected
  // routes if they are not logged in.
  canActivate(route, state: RouterStateSnapshot) {
    if(this.auth.isLoggedIn()) return true;

    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
