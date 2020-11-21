import { Component, OnInit } from '@angular/core';
import { HttpRequestsService } from '../services/http-requests.service';

@Component({
  selector: 'app-formslist',
  templateUrl: './formslist.component.html',
  styleUrls: ['./formslist.component.scss']
})
export class FormslistComponent implements OnInit {

  constructor(public httpService: HttpRequestsService) { }

  ngOnInit(): void {
    this.httpService.getFormsList(0).subscribe(
      (response) => {
        console.log(response);
      }, 
      (error) => {
        console.log('error aya');
      }
    );
  }



}
