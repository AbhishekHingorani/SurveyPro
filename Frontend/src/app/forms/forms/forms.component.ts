import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {

  constructor(public authService: AuthService, public router: Router) { }

  about() {
    Swal.fire({
      showCancelButton: false,
      showConfirmButton:false,
      text:'Created by: Abhishek Hingorani'
    });
  }

  logout() {
    // Clearing the token and redirecting user to login page.
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
