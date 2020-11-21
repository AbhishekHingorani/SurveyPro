import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../authentication.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register(creds) {
    console.log(creds);
    this.auth.register(creds).subscribe(
      (response) => {
        console.log(response);
        this.auth.saveTokenAndNavigate(response);
      },
      (error) => {
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
    this.auth.googleAuthentication();
  }

}
