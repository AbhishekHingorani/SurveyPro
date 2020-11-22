import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Authguard } from '../authentication/authguard.service';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { CreateformComponent } from './createform/createform.component';
import { FillFormComponent } from './fill-form/fill-form.component';
import { FormResponsesComponent } from './form-responses/form-responses.component';
import { FormsComponent } from './forms/forms.component';
import { FormslistComponent } from './formslist/formslist.component';

const routes: Routes = [
  { path: '', redirectTo: 'forms/list', pathMatch: 'full'},
  { path: 'forms', component: FormsComponent, canActivate: [Authguard], children: [
    {path: 'list', component: FormslistComponent},
    {path: 'create', component: CreateformComponent},
    {path: ':formId/fill', component: FillFormComponent},
    {path: ':formId/responses', component: FormResponsesComponent},
    {path: '**', component: PageNotFoundComponent},
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
