import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {

  baseUrl = "http://localhost:8989/";

  constructor(private http: HttpClient) {}
  
  getFormsList(userId: number) {
    return this.http.get(this.baseUrl + 'formList');
  }

}
