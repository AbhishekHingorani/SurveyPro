import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createform',
  templateUrl: './createform.component.html',
  styleUrls: ['./createform.component.scss'],
})
export class CreateformComponent implements OnInit {
  quesType: number = 0;
  title = '';
  quesText = '';
  optionVal = '';
  options = [];

  questions = [];

  constructor(public httpRequests: HttpRequestsService) {}

  ngOnInit(): void {}

  addOption() {
    if (this.optionVal && this.optionVal.length > 0) {
      if(this.options.indexOf(this.optionVal) == -1)
        this.options.push(this.optionVal);
      else {
        this.showError('Option Already Exists');
      }
      this.optionVal = '';
    }
  }

  deleteOption(option) {
    this.options = this.options.filter(val => val != option);
  }

  addQuestion(){
    if(this.quesText === '') {
      this.showError('Please enter Question text');
      return;
    }
    if(this.quesType === 0) {
      this.showError('Please select Input Type');
      return;
    }
    if((this.quesType==2 || this.quesType==3) && this.options.length < 2) {
      this.showError("Please add atleast 2 options");
      return;
    }
    let ques = {
      "quesTitle":this.quesText,
      "quesType":this.quesType,
      "quesOptions":this.options
    }
    this.questions.push(ques);
    this.clearFields();
  }

  createForm() {
    if(this.title === '') {
      this.showError('Please enter form title');
      return;
    }

    if(this.questions.length <= 0) {
      this.showError('Please add atleast one question');
      return;
    }

    const formData = {
      "title": this.title,
      "questions": this.questions
    }

    this.httpRequests.createForm(formData).subscribe(
      (response) => {
        let url = "http://localhost:4200/forms/" + response["formId"] + "/fill";
        
        Swal.fire({
          icon: "success",
          showCancelButton: false,
          showConfirmButton:false,
          text:'Form created successfully! Copy the Form URL below.',
          footer: "<input type=\"text\" class=\"form-control\" placeholder=\"Form URL\" aria-label=\"Form URL\" aria-describedby=\"form-url\" value=\""+url+"\"/>"
        });
      },
      (error) => {
        this.showError('Cannot create form');
      }
    )
  }

  clearFields() {
    this.quesText = '';
    this.quesType = 0;
    this.options = [];
  }

  showError(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: msg,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}
