import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestsService } from 'src/app/services/http-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.scss'],
})
export class FillFormComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public httpRequest: HttpRequestsService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  formId;
  formData;
  myForm: FormGroup;

  ngOnInit(): void {
    // Getting form id from URL parameters.
    this.route.paramMap.subscribe((params) => {
      this.formId = params.get('formId');
    });

    // Getting all the questions of the form.
    this.httpRequest.getFormQuestions(this.formId).subscribe(
      (response) => {
        this.formData = response;
        this.loadFormData();
      },
      (error) => {
        Swal.fire(
          'Error',
          'Error loading form data. Please ensure the form url is correct.',
          'error'
        );
      }
    );
  }

  loadFormData() {
    // If form data is not initialized show error and return.
    if (!this.formData) {
      Swal.fire(
        'Error',
        'Error loading form data. Please ensure the form url is correct.',
        'error'
      );
      return;
    }

    // Initializing the formgroup object with the fields retrieved from backend.
    // Keeping the name of form controls as the question id.
    const group = this.fb.group({});
    this.formData.questions.forEach((element) => {
      if(element.quesType === 3) {
        // For checkbox field, we need an array of controls.
        group.addControl(element.quesId, new FormArray([]));
      } else {
        // For other fields we just need a single form control
        group.addControl(element.quesId, this.fb.control(null));
      }
    });
    this.myForm = group;
  }

  // For checkbox special handling is required as it has to have multiple values 
  // and for that multiple form controls are required.
  onCheckChange(event, quesId: number) { 
    let formArray: FormArray = this.myForm.get(quesId + '') as FormArray
    // If the checkbox was marked as checked
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    // if the checkbock was unchecked.
    else{
      // find the unchecked element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unchecked element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // Submit the form to backend
  onSubmit(): void {
    let val = this.myForm.value;
    let formData = [];
    // currently the data in form will be in this format:
    // [{<quesId>: <answer>}, {<quesId>: <answer>}..]
    // We have to convert it into this form:
    // [{quesId: <quesId>, ansVal: <answer>}, {quesId: <quesId>, ansVal: <answer>}, ...]
    for (const [key, value] of Object.entries(val)) {
      let ans = {
        "quesId": parseInt(key,10),
        "ansVal": Array.isArray(value) ? value : [value] 
      }
      formData.push(ans);
    }
    //sending the request to backend.
    this.httpRequest.submitForm(formData).subscribe(
      (response) => {
        Swal.fire('Sucess', 'Form Submitted Successfully', 'success');
        this.router.navigate(['/']);
      },
      (error) => {
        Swal.fire('Error', 'There was an error submitting the form', 'error');
      }
    )
  }
}
