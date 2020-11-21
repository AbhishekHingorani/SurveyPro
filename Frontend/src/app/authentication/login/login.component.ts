import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../authentication.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  login(creds) {
    this.auth.login(creds).subscribe(
      (response) => {
        console.log(response);
        this.auth.saveTokenAndNavigate(response);
      },
      (error) => {
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
    this.auth.googleAuthentication();
  }
}
