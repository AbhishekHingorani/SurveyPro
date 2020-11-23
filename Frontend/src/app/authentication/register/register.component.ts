import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../authentication.component.scss']
})
export class RegisterComponent {

  constructor(public auth: AuthService, private router: Router) { }

  // Local Registration
  register(creds) {
    this.auth.register(creds).subscribe(
      (response) => {
        // Save token and redirect if login successful.
        this.auth.saveTokenAndNavigate(response);
      },
      (error) => {
        // Show error if registration fails.
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Cannot Signup',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      }
    );
  }

  googleRegistration() {
    // Registration using google.
    this.auth.googleAuthentication();
  }

}
