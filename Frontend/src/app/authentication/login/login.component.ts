import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../authentication.component.scss']
})
export class LoginComponent {

  constructor(
    public auth: AuthService
  ) { }

  login(creds) {
    // Local Authentication
    this.auth.login(creds).subscribe(
      (response) => {
        this.auth.saveTokenAndNavigate(response);
      },
      (error) => {
        // Showing error if login fails
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'Incorrect Credentials',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      }
    );
  }

  googleLogin() {
    // Google login
    this.auth.googleAuthentication();
  }
}
