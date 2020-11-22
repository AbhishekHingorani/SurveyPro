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
    this.route.paramMap.subscribe((params) => {
      this.formId = params.get('formId');
    });

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
    if (!this.formData) {
      Swal.fire(
        'Error',
        'Error loading form data. Please ensure the form url is correct.',
        'error'
      );
      return;
    }

  
    const group = this.fb.group({});
    this.formData.questions.forEach((element) => {
      if(element.quesType === 3) {
        group.addControl(element.quesId, new FormArray([]));
      } else {
        group.addControl(element.quesId, this.fb.control(null));
      }
    });
    this.myForm = group;
  }

  onCheckChange(event, quesId: number) { 
    let formArray: FormArray = this.myForm.get(quesId + '') as FormArray
    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  getFormControl(quesId: number): AbstractControl {
    return (<FormControl> this.myForm.get(quesId + ''));
  }

  onSubmit(): void {
    let val = this.myForm.value;
    let formData = [];
    for (const [key, value] of Object.entries(val)) {
      let ans = {
        "quesId": parseInt(key,10),
        "ansVal": Array.isArray(value) ? value : [value] 
      }
      formData.push(ans);
    }
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
