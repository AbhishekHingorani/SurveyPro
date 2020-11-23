import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-responses',
  templateUrl: './form-responses.component.html',
  styleUrls: ['./form-responses.component.scss']
})
export class FormResponsesComponent implements OnInit {

  formId: string;
  title: string;
  responses: [];

  constructor(
    public httpRequest: HttpRequestsService,
    public route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    // Getting form id from URL parameters
    this.route.paramMap.subscribe((params) => {
      this.formId = params.get('formId');
    });

    // Calling API to get all the responses of the form.
    this.httpRequest.getFormResponses(this.formId).subscribe(
      (response) => {
        this.title = response["title"];
        this.responses = response["answers"];
      },
      (error) => {
        Swal.fire('Error','No responses found','error');
        this.router.navigate(['/']);
      }
    )
  }

}
