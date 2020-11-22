import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormslistComponent } from './formslist/formslist.component';
import { FormsRoutingModule } from './forms-routing.module';
import { CreateformComponent } from './createform/createform.component';
import { FormsComponent } from './forms/forms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FillFormComponent } from './fill-form/fill-form.component';
import { FormResponsesComponent } from './form-responses/form-responses.component';



@NgModule({
  declarations: [
    FormslistComponent,
    CreateformComponent,
    FormsComponent,
    FillFormComponent,
    FormResponsesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsRoutingModule
  ]
})
export class SurveyFormsModule { }
