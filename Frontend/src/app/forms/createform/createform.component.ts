import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createform',
  templateUrl: './createform.component.html',
  styleUrls: ['./createform.component.scss'],
})
export class CreateformComponent {
  quesType: number = 0;
  title = '';
  quesText = '';
  optionVal = '';
  options = [];

  questions = [];

  constructor(public httpRequests: HttpRequestsService) {}

  // If input type is checkbox or radio button, this method will add 
  // the options added by user to the options array.
  addOption() {
    if (this.optionVal && this.optionVal.length > 0) {
      if(this.options.indexOf(this.optionVal) == -1)
        this.options.push(this.optionVal);
      else {
        // If same option was already added previously, throw error.
        this.showError('Option Already Exists');
      }
      // Reset the option value after adding.
      this.optionVal = '';
    }
  }

  // Delete the option from options array.
  deleteOption(option) {
    this.options = this.options.filter(val => val != option);
  }

  // Add the question to questions array.
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
    // After question is added, clearing the questions field.
    this.clearFields();
  }

  // Call api to create form.
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

  // Clear all questions fields.
  clearFields() {
    this.quesText = '';
    this.quesType = 0;
    this.options = [];
  }

  // Show Sweet Alert Error toast with specified message.
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
