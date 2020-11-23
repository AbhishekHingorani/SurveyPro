import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // This interceptor will intercept all the outgoing HTTP requests and append token to its headers.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // getting token from local storage.
        const token = localStorage.getItem("token");
        if (token) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: token
                }
            });
            return next.handle(cloned);
        }  else {
            return next.handle(req);
        }
    }
}