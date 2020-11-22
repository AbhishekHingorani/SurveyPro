import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  baseUrl = "http://localhost:8989/";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}
  
  getFormsList() {
    return this.http.get(this.baseUrl + 'forms');
  }

  createForm(formData: any) {
    return this.http.post(
      this.baseUrl + 'form',
      JSON.stringify(formData),
      this.httpOptions
    );
  }

  getFormQuestions(formId: number) {
    return this.http.get(this.baseUrl + 'form/' + formId);
  }

  submitForm(formData) {
    return this.http.post(
      this.baseUrl + 'answers',
      JSON.stringify(formData),
      this.httpOptions
    )
  }

  getFormResponses(formId: string) {
    return this.http.get(this.baseUrl + 'form/' + formId + '/answers');
  }

}
