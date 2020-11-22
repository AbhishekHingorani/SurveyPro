import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpRequestsService } from '../../services/http-requests.service';

@Component({
  selector: 'app-formslist',
  templateUrl: './formslist.component.html',
  styleUrls: ['./formslist.component.scss']
})
export class FormslistComponent implements OnInit {

  forms = [];

  constructor(public router: Router, public activatedRoute: ActivatedRoute,public httpService: HttpRequestsService) { }

  ngOnInit(): void {
    this.httpService.getFormsList().subscribe(
      (response: any[]) => {
        this.forms = response;
      }
    );
  }

  redirectToFromResponses(formId) {
    this.router.navigate(['../'+formId+'/responses'], {relativeTo: this.activatedRoute});
  }

}
