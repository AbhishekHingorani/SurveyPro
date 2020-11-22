import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  about() {
    Swal.fire({
      showCancelButton: false,
      showConfirmButton:false,
      text:'Created by: Abhishek Hingorani'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
