
import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './services/auth.service';
import { switchMap } from 'rxjs/operators';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    auth: AuthService;

    constructor(private inj: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.auth = this.inj.get(AuthService); // inject the authservice manually (see https://github.com/angular/angular/issues/18224)

        return this.auth.getUserIdToken().pipe(
            switchMap(token => {
                request = request.clone({
                    setHeaders: {
                    Authorization: `Bearer ${token}`
                    }
                });

                return next.handle(request);
            })
        );
    }
}
